package com.smartwaste.service.impl;

import com.smartwaste.dto.ComplaintAnalysisResponse;
import com.smartwaste.dto.ComplaintResponse;
import com.smartwaste.entity.*;
import com.smartwaste.exception.CustomExceptions.ResourceNotFoundException;
import com.smartwaste.exception.CustomExceptions.BadRequestException;
import com.smartwaste.mapper.DtoMapper;
import com.smartwaste.repository.AuditLogRepository;
import com.smartwaste.repository.ComplaintRepository;
import com.smartwaste.repository.NotificationRepository;
import com.smartwaste.repository.RewardRepository;
import com.smartwaste.repository.UserRepository;
import com.smartwaste.service.ComplaintService;
import com.smartwaste.service.FileStorageService;
import com.smartwaste.service.GeminiService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ComplaintServiceImpl implements ComplaintService {

    private final UserRepository userRepository;
    private final ComplaintRepository complaintRepository;
    private final RewardRepository rewardRepository;
    private final NotificationRepository notificationRepository;
    private final AuditLogRepository auditLogRepository;
    private final FileStorageService fileStorageService;
    private final GeminiService geminiService;

    @Override
    @Transactional
    public ComplaintResponse reportComplaint(
            String email,
            MultipartFile file,
            String complaintType,
            String description,
            String language
    ) {
        log.info("Reporting complaint from user: {}, type: {}", email, complaintType);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));

        // 1. Upload File (if provided)
        String imageUrl = null;
        ComplaintAnalysisResponse aiResponse = null;

        if (file != null && !file.isEmpty()) {
            imageUrl = fileStorageService.storeFile(file);

            // 2. Call Gemini for analysis
            byte[] imageBytes;
            try {
                imageBytes = file.getBytes();
            } catch (IOException e) {
                log.error("Failed to read complaint image bytes", e);
                throw new BadRequestException("Failed to process complaint image");
            }

            String contentType = file.getContentType();
            if (contentType == null) {
                contentType = "image/jpeg";
            }

            String lang = (language == null || language.trim().isEmpty()) ? "en" : language;

            // Trigger analysis
            aiResponse = geminiService.analyzeComplaint(imageBytes, contentType, lang);
        }

        // 3. Save Complaint
        Complaint complaint = Complaint.builder()
                .user(user)
                .imageUrl(imageUrl)
                .complaintType(complaintType)
                .description(description)
                .status(ComplaintStatus.PENDING)
                .aiSeverity(aiResponse != null ? aiResponse.getSeverity() : "N/A")
                .aiWasteType(aiResponse != null ? aiResponse.getEstimatedWasteType() : "N/A")
                .aiRecommendedAction(aiResponse != null ? aiResponse.getRecommendedMunicipalAction() : "No image provided")
                .language(language != null ? language : "en")
                .build();

        Complaint savedComplaint = complaintRepository.save(complaint);

        // 4. Save Notification
        notificationRepository.save(Notification.builder()
                .user(user)
                .title("Complaint Filed Successfully")
                .message("Your complaint regarding illegal dumping has been logged. Our administrative team will review it.")
                .readStatus(false)
                .build());

        // 5. Save Audit Log
        auditLogRepository.save(AuditLog.builder()
                .action("Complaint Filed. Complaint ID: " + savedComplaint.getId())
                .user(user.getEmail())
                .build());

        return DtoMapper.toComplaintResponse(savedComplaint);
    }

    @Override
    public List<ComplaintResponse> getUserComplaints(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));
        return complaintRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).stream()
                .map(DtoMapper::toComplaintResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<ComplaintResponse> getAllComplaints() {
        return complaintRepository.findAll().stream()
                .map(DtoMapper::toComplaintResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ComplaintResponse updateComplaintStatus(Long id, String status, String comment) {
        log.info("Admin updating complaint: {} status to: {}, comment: {}", id, status, comment);

        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found with id: " + id));

        ComplaintStatus newStatus;
        try {
            newStatus = ComplaintStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid status. Supported: PENDING, RESOLVED, REJECTED");
        }

        complaint.setStatus(newStatus);
        if (comment != null) {
            complaint.setAdminComment(comment);
        }
        Complaint savedComplaint = complaintRepository.save(complaint);
        User user = savedComplaint.getUser();

        // If complaint resolved, reward user +15 points for local environmental surveillance!
        if (newStatus == ComplaintStatus.RESOLVED) {
            Reward reward = rewardRepository.findByUserId(user.getId())
                    .orElseGet(() -> rewardRepository.save(Reward.builder()
                            .user(user)
                            .points(0)
                            .badges("")
                            .build()));
            reward.setPoints(reward.getPoints() + 15);
            rewardRepository.save(reward);

            notificationRepository.save(Notification.builder()
                    .user(user)
                    .title("Complaint Resolved!")
                    .message("The dumping issue you reported was successfully resolved. You earned +15 points!")
                    .readStatus(false)
                    .build());
        } else {
            notificationRepository.save(Notification.builder()
                    .user(user)
                    .title("Complaint Status Updated")
                    .message(String.format("Your complaint status has been updated to: %s.", newStatus.name()))
                    .readStatus(false)
                    .build());
        }

        // Save Audit Log
        auditLogRepository.save(AuditLog.builder()
                .action("Complaint status updated by Admin. Complaint ID: " + id + " Status: " + newStatus)
                .user("SYSTEM/ADMIN")
                .build());

        return DtoMapper.toComplaintResponse(savedComplaint);
    }
}

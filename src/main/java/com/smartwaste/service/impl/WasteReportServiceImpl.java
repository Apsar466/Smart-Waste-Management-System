package com.smartwaste.service.impl;

import com.smartwaste.dto.WasteAnalysisResponse;
import com.smartwaste.dto.WasteReportResponse;
import com.smartwaste.entity.*;
import com.smartwaste.exception.CustomExceptions.ResourceNotFoundException;
import com.smartwaste.exception.CustomExceptions.BadRequestException;
import com.smartwaste.mapper.DtoMapper;
import com.smartwaste.repository.*;
import com.smartwaste.service.AICacheService;
import com.smartwaste.service.FileStorageService;
import com.smartwaste.service.WasteReportService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class WasteReportServiceImpl implements WasteReportService {

    private final UserRepository userRepository;
    private final WasteReportRepository wasteReportRepository;
    private final WasteCategoryRepository wasteCategoryRepository;
    private final RewardRepository rewardRepository;
    private final NotificationRepository notificationRepository;
    private final AuditLogRepository auditLogRepository;
    private final FileStorageService fileStorageService;
    private final AICacheService aiCacheService;

    @Override
    @Transactional
    public WasteReportResponse analyzeWaste(
            String email,
            MultipartFile file,
            String location,
            Double latitude,
            Double longitude,
            String language
    ) {
        log.info("Analyzing waste report for user: {}, language: {}", email, language);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));

        // 1. Upload File
        String imageUrl = fileStorageService.storeFile(file);

        // 2. Call Gemini
        byte[] imageBytes;
        try {
            imageBytes = file.getBytes();
        } catch (IOException e) {
            log.error("Failed to read uploaded file bytes", e);
            throw new BadRequestException("Failed to process uploaded file bytes");
        }

        String contentType = file.getContentType();
        if (contentType == null) {
            contentType = "image/jpeg";
        }

        String lang = (language == null || language.trim().isEmpty()) ? "en" : language;

        // 2. Call Gemini via cache layer (Cache-first, then live Gemini)
        WasteAnalysisResponse aiResponse = aiCacheService.getOrAnalyzeWaste(imageBytes, contentType, lang);

        // 3. Keep database WasteCategories normalized
        String categoryName = aiResponse.getCategoryName();
        if (categoryName == null || categoryName.trim().isEmpty()) {
            categoryName = "Other";
        }

        String finalCategoryName = categoryName;
        WasteCategory category = wasteCategoryRepository.findByCategoryNameIgnoreCase(finalCategoryName)
                .orElseGet(() -> {
                    log.info("Creating new waste category: {}", finalCategoryName);
                    return wasteCategoryRepository.save(WasteCategory.builder()
                            .categoryName(finalCategoryName)
                            .recyclable(aiResponse.isRecyclable())
                            .disposalMethod(aiResponse.getDisposalInstructions())
                            .build());
                });

        // 4. Save WasteReport
        WasteReport report = WasteReport.builder()
                .user(user)
                .imageUrl(imageUrl)
                .wasteType(aiResponse.getWasteType())
                .aiConfidence(aiResponse.getConfidence())
                .aiDescription(aiResponse.getEnvironmentalImpact())
                .disposalMethod(aiResponse.getDisposalInstructions())
                .location(location)
                .latitude(latitude)
                .longitude(longitude)
                .language(lang)
                .build();

        WasteReport savedReport = wasteReportRepository.save(report);

        // 5. Gamified Rewards updates
        Reward reward = rewardRepository.findByUserId(user.getId())
                .orElseGet(() -> rewardRepository.save(Reward.builder()
                        .user(user)
                        .points(0)
                        .badges("")
                        .build()));

        // Award +10 points per report
        int oldPoints = reward.getPoints();
        int newPoints = oldPoints + 10;
        reward.setPoints(newPoints);

        // Recheck badges
        long reportCount = wasteReportRepository.findByUserId(user.getId(), org.springframework.data.domain.Pageable.unpaged()).getTotalElements();
        String currentBadges = reward.getBadges() == null ? "" : reward.getBadges();
        StringBuilder badgesBuilder = new StringBuilder(currentBadges);

        if (reportCount >= 1 && !currentBadges.contains("Eco-Novice")) {
            if (badgesBuilder.length() > 0) badgesBuilder.append(", ");
            badgesBuilder.append("Eco-Novice");
        }
        if (reportCount >= 5 && !currentBadges.contains("Eco-Warrior")) {
            if (badgesBuilder.length() > 0) badgesBuilder.append(", ");
            badgesBuilder.append("Eco-Warrior");
        }
        if (reportCount >= 10 && !currentBadges.contains("Eco-Champion")) {
            if (badgesBuilder.length() > 0) badgesBuilder.append(", ");
            badgesBuilder.append("Eco-Champion");
        }
        reward.setBadges(badgesBuilder.toString());
        rewardRepository.save(reward);

        // 6. Create Notification
        notificationRepository.save(Notification.builder()
                .user(user)
                .title("Waste Analyzed successfully")
                .message(String.format("Waste item '%s' classified under '%s'. You earned +10 points!",
                        savedReport.getWasteType(), category.getCategoryName()))
                .readStatus(false)
                .build());

        // 7. Save Audit Log
        auditLogRepository.save(AuditLog.builder()
                .action("Waste Image Analyzed. Report ID: " + savedReport.getId())
                .user(user.getEmail())
                .build());

        // Propagate cache source to response
        WasteReportResponse resp = DtoMapper.toWasteReportResponse(savedReport);
        resp.setSource(aiResponse.getSource());
        return resp;
    }

    @Override
    public List<WasteReportResponse> getUserHistory(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));
        return wasteReportRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).stream()
                .map(DtoMapper::toWasteReportResponse)
                .collect(Collectors.toList());
    }

    @Override
    public WasteReportResponse getReportById(Long id, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));

        WasteReport report = wasteReportRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Waste report not found with id: " + id));

        // Validate access
        if (user.getRole() != Role.ADMIN && !report.getUser().getId().equals(user.getId())) {
            throw new AccessDeniedException("You do not have permission to view this report.");
        }

        return DtoMapper.toWasteReportResponse(report);
    }

    @Override
    public List<WasteReportResponse> getAllReports() {
        return wasteReportRepository.findAll().stream()
                .map(DtoMapper::toWasteReportResponse)
                .collect(Collectors.toList());
    }
}

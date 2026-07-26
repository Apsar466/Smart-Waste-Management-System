package com.smartwaste.service.impl;

import com.smartwaste.dto.PickupRequestRequest;
import com.smartwaste.dto.PickupRequestResponse;
import com.smartwaste.entity.*;
import com.smartwaste.exception.CustomExceptions.ResourceNotFoundException;
import com.smartwaste.exception.CustomExceptions.BadRequestException;
import com.smartwaste.mapper.DtoMapper;
import com.smartwaste.repository.*;
import com.smartwaste.service.PickupRequestService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class PickupRequestServiceImpl implements PickupRequestService {

    private final UserRepository userRepository;
    private final WasteReportRepository wasteReportRepository;
    private final PickupRequestRepository pickupRequestRepository;
    private final RewardRepository rewardRepository;
    private final NotificationRepository notificationRepository;
    private final AuditLogRepository auditLogRepository;

    @Override
    @Transactional
    public PickupRequestResponse createPickupRequest(String email, PickupRequestRequest request) {
        log.info("Creating pickup request for user: {}, reportId: {}", email, request.getReportId());

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));

        WasteReport report = wasteReportRepository.findById(request.getReportId())
                .orElseThrow(() -> new ResourceNotFoundException("Waste report not found with id: " + request.getReportId()));

        // Validate that the report belongs to this user
        if (!report.getUser().getId().equals(user.getId())) {
            throw new AccessDeniedException("You do not have permission to book a pickup for this report.");
        }

        // We have a OneToOne mapping, so check if there is already a pickup request linked
        // We can check if a pickup request exists for this report
        // We can search through all and see if one exists or let Hibernate throw exception. Checking manually is better.
        List<PickupRequest> existingPickups = pickupRequestRepository.findByUserId(user.getId());
        for (PickupRequest p : existingPickups) {
            if (p.getReport().getId().equals(report.getId())) {
                throw new BadRequestException("A pickup request already exists for this waste report.");
            }
        }

        PickupRequest pickupRequest = PickupRequest.builder()
                .report(report)
                .pickupDate(request.getPickupDate())
                .status(PickupStatus.PENDING)
                .build();

        PickupRequest savedRequest = pickupRequestRepository.save(pickupRequest);

        // Notify user
        notificationRepository.save(Notification.builder()
                .user(user)
                .title("Pickup booked successfully")
                .message(String.format("Collection scheduled for %s.", savedRequest.getPickupDate().toString()))
                .readStatus(false)
                .build());

        // Save Audit Log
        auditLogRepository.save(AuditLog.builder()
                .action("Pickup Booked. Request ID: " + savedRequest.getId())
                .user(user.getEmail())
                .build());

        return DtoMapper.toPickupRequestResponse(savedRequest);
    }

    @Override
    public List<PickupRequestResponse> getUserPickups(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));
        return pickupRequestRepository.findByUserId(user.getId()).stream()
                .map(DtoMapper::toPickupRequestResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public PickupRequestResponse cancelPickupRequest(Long id, String email) {
        log.info("Cancelling pickup request: {} by user: {}", id, email);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));

        PickupRequest pickupRequest = pickupRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pickup request not found with id: " + id));

        // Validate ownership
        if (!pickupRequest.getReport().getUser().getId().equals(user.getId())) {
            throw new AccessDeniedException("You do not have permission to cancel this pickup request.");
        }

        // Validate status
        if (pickupRequest.getStatus() == PickupStatus.COMPLETED) {
            throw new BadRequestException("Cannot cancel a completed pickup request.");
        }
        if (pickupRequest.getStatus() == PickupStatus.CANCELLED) {
            throw new BadRequestException("Pickup request is already cancelled.");
        }

        pickupRequest.setStatus(PickupStatus.CANCELLED);
        PickupRequest savedRequest = pickupRequestRepository.save(pickupRequest);

        // Notify user
        notificationRepository.save(Notification.builder()
                .user(user)
                .title("Pickup Cancelled")
                .message("Your pickup request was cancelled successfully.")
                .readStatus(false)
                .build());

        // Save Audit Log
        auditLogRepository.save(AuditLog.builder()
                .action("Pickup Cancelled. Request ID: " + id)
                .user(user.getEmail())
                .build());

        return DtoMapper.toPickupRequestResponse(savedRequest);
    }

    @Override
    public List<PickupRequestResponse> getAllPickups() {
        return pickupRequestRepository.findAll().stream()
                .map(DtoMapper::toPickupRequestResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public PickupRequestResponse updatePickupStatus(Long id, String status, String driver, String remarks) {
        log.info("Admin updating pickup request: {} status to: {}, driver: {}", id, status, driver);

        PickupRequest pickupRequest = pickupRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pickup request not found with id: " + id));

        PickupStatus newStatus;
        try {
            newStatus = PickupStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid status. Supported: PENDING, ACCEPTED, SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED");
        }

        pickupRequest.setStatus(newStatus);
        if (driver != null) {
            pickupRequest.setAssignedDriver(driver);
        }
        if (remarks != null) {
            pickupRequest.setRemarks(remarks);
        }

        PickupRequest savedRequest = pickupRequestRepository.save(pickupRequest);
        User user = savedRequest.getReport().getUser();

        // If completed, award user +20 points
        if (newStatus == PickupStatus.COMPLETED) {
            Reward reward = rewardRepository.findByUserId(user.getId())
                    .orElseGet(() -> rewardRepository.save(Reward.builder()
                            .user(user)
                            .points(0)
                            .badges("")
                            .build()));
            reward.setPoints(reward.getPoints() + 20);
            rewardRepository.save(reward);

            notificationRepository.save(Notification.builder()
                    .user(user)
                    .title("Collection Completed!")
                    .message("The driver successfully picked up your waste. You earned +20 points!")
                    .readStatus(false)
                    .build());
        } else {
            notificationRepository.save(Notification.builder()
                    .user(user)
                    .title("Pickup Request Updated")
                    .message(String.format("Your pickup status is now: %s.", newStatus.name()))
                    .readStatus(false)
                    .build());
        }

        // Save Audit Log
        auditLogRepository.save(AuditLog.builder()
                .action("Pickup status updated by Admin. Request ID: " + id + " Status: " + newStatus)
                .user("SYSTEM/ADMIN")
                .build());

        return DtoMapper.toPickupRequestResponse(savedRequest);
    }
}

package com.smartwaste.mapper;

import com.smartwaste.dto.*;
import com.smartwaste.entity.*;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public class DtoMapper {

    public static UserProfileResponse toUserProfileResponse(User user) {
        if (user == null) return null;
        return UserProfileResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .address(user.getAddress())
                .role(user.getRole().name())
                .status(user.getStatus())
                .createdAt(user.getCreatedAt())
                .build();
    }

    public static WasteReportResponse toWasteReportResponse(WasteReport report) {
        if (report == null) return null;
        return WasteReportResponse.builder()
                .id(report.getId())
                .userId(report.getUser().getId())
                .imageUrl(report.getImageUrl())
                .wasteType(report.getWasteType())
                .aiConfidence(report.getAiConfidence())
                .aiDescription(report.getAiDescription())
                .disposalMethod(report.getDisposalMethod())
                .location(report.getLocation())
                .latitude(report.getLatitude())
                .longitude(report.getLongitude())
                .language(report.getLanguage())
                .createdAt(report.getCreatedAt())
                .build();
    }

    public static PickupRequestResponse toPickupRequestResponse(PickupRequest request) {
        if (request == null) return null;
        return PickupRequestResponse.builder()
                .id(request.getId())
                .reportId(request.getReport().getId())
                .pickupDate(request.getPickupDate())
                .status(request.getStatus().name())
                .assignedDriver(request.getAssignedDriver())
                .remarks(request.getRemarks())
                .build();
    }

    public static ComplaintResponse toComplaintResponse(Complaint complaint) {
        if (complaint == null) return null;
        return ComplaintResponse.builder()
                .id(complaint.getId())
                .userId(complaint.getUser().getId())
                .imageUrl(complaint.getImageUrl())
                .complaintType(complaint.getComplaintType())
                .description(complaint.getDescription())
                .status(complaint.getStatus().name())
                .aiSeverity(complaint.getAiSeverity())
                .aiWasteType(complaint.getAiWasteType())
                .aiRecommendedAction(complaint.getAiRecommendedAction())
                .adminComment(complaint.getAdminComment())
                .language(complaint.getLanguage())
                .createdAt(complaint.getCreatedAt())
                .build();
    }

    public static ChatResponse toChatResponse(AIChatHistory chat) {
        if (chat == null) return null;
        return ChatResponse.builder()
                .id(chat.getId())
                .question(chat.getQuestion())
                .answer(chat.getAnswer())
                .language(chat.getLanguage())
                .timestamp(chat.getTimestamp())
                .build();
    }

    public static RewardResponse toRewardResponse(Reward reward) {
        if (reward == null) return null;
        List<String> badgeList = Collections.emptyList();
        if (reward.getBadges() != null && !reward.getBadges().trim().isEmpty()) {
            badgeList = Arrays.asList(reward.getBadges().split(",\\s*"));
        }
        return RewardResponse.builder()
                .id(reward.getId())
                .userId(reward.getUser().getId())
                .points(reward.getPoints())
                .badges(badgeList)
                .build();
    }

    public static NotificationResponse toNotificationResponse(Notification notification) {
        if (notification == null) return null;
        return NotificationResponse.builder()
                .id(notification.getId())
                .title(notification.getTitle())
                .message(notification.getMessage())
                .readStatus(notification.isReadStatus())
                .createdAt(notification.getCreatedAt())
                .build();
    }
}

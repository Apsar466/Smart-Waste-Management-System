package com.smartwaste.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ComplaintResponse {
    private Long id;
    private Long userId;
    private String imageUrl;
    private String complaintType;
    private String description;
    private String status;
    private String aiSeverity;
    private String aiWasteType;
    private String aiRecommendedAction;
    private String adminComment;
    private String language;
    private LocalDateTime createdAt;
}

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
public class WasteReportResponse {
    private Long id;
    private Long userId;
    private String imageUrl;
    private String wasteType;
    private Double aiConfidence;
    private String aiDescription;
    private String disposalMethod;
    private String location;
    private Double latitude;
    private Double longitude;
    private String language;
    private LocalDateTime createdAt;
    private String source;
}

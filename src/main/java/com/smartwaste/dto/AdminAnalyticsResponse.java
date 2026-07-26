package com.smartwaste.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminAnalyticsResponse {
    private long geminiRequests;
    private long cacheHits;
    private long cacheMisses;
    private double cacheHitRate;
    private long averageResponseTimeMs;
    private long savedRequests;
    
    private List<WasteTypeCount> topWasteTypes;
    private List<QuestionCount> mostCommonQuestions;
    private List<ImageUploadDetail> mostUploadedImages;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class WasteTypeCount {
        private String wasteType;
        private long count;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class QuestionCount {
        private String question;
        private long count;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class ImageUploadDetail {
        private String imageUrl;
        private long count;
    }
}

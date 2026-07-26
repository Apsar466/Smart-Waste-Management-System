package com.smartwaste.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CacheStatisticsResponse {
    private long totalGeminiRequests;
    private long totalCacheHits;
    private double cacheHitRate;
    private long requestsSaved;
}

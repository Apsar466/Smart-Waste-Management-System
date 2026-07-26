package com.smartwaste.service;

import com.smartwaste.dto.CacheStatisticsResponse;
import com.smartwaste.dto.WasteAnalysisResponse;

public interface AICacheService {
    WasteAnalysisResponse getOrAnalyzeWaste(byte[] imageBytes, String contentType, String languageCode);
    ChatResult getOrChat(String question, String languageCode);
    CacheStatisticsResponse getStatistics();

    record ChatResult(String answer, String source) {}
}

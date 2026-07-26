package com.smartwaste.service;

import com.smartwaste.dto.ComplaintAnalysisResponse;
import com.smartwaste.dto.WasteAnalysisResponse;

public interface GeminiService {
    WasteAnalysisResponse analyzeWaste(byte[] imageBytes, String contentType, String languageCode);
    ComplaintAnalysisResponse analyzeComplaint(byte[] imageBytes, String contentType, String languageCode);
    String getChatResponse(String question, String languageCode);
}

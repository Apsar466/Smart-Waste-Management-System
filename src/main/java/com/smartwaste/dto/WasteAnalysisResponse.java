package com.smartwaste.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WasteAnalysisResponse {
    private String wasteType;
    private String categoryName;
    private boolean recyclable;
    private Double confidence;
    private String disposalInstructions;
    private String environmentalImpact;
    private String recyclingSuggestions;
    /** "CACHE" or "GEMINI" – set by AICacheService, not persisted */
    private String source;
}

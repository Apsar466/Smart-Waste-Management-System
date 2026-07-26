package com.smartwaste.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ComplaintAnalysisResponse {
    private boolean garbagePresent;
    private String severity;
    private String estimatedWasteType;
    private String recommendedMunicipalAction;
}

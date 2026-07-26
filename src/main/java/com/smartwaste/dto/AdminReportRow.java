package com.smartwaste.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminReportRow {
    private String period; // Date string or format e.g. "2026-07-15"
    private long usersRegistered;
    private long wasteAnalyzed;
    private long pickupsScheduled;
    private long pickupsCompleted;
    private long complaintsFiled;
    private long complaintsResolved;
    private double carbonSavedKg;
}

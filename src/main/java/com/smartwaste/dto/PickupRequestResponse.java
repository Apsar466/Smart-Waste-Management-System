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
public class PickupRequestResponse {
    private Long id;
    private Long reportId;
    private LocalDateTime pickupDate;
    private String status;
    private String assignedDriver;
    private String remarks;
}

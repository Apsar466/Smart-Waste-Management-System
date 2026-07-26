package com.smartwaste.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PickupRequestRequest {

    @NotNull(message = "Report ID is required")
    private Long reportId;

    @NotNull(message = "Pickup date is required")
    private LocalDateTime pickupDate;
}

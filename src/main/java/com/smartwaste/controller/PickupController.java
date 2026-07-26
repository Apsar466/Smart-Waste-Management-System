package com.smartwaste.controller;

import com.smartwaste.dto.ApiResponse;
import com.smartwaste.dto.PickupRequestRequest;
import com.smartwaste.dto.PickupRequestResponse;
import com.smartwaste.service.PickupRequestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/pickup")
@RequiredArgsConstructor
@Slf4j
public class PickupController {

    private final PickupRequestService pickupRequestService;

    @PostMapping("/request")
    public ResponseEntity<ApiResponse<PickupRequestResponse>> createPickup(
            @Valid @RequestBody PickupRequestRequest request,
            Principal principal
    ) {
        log.info("REST request to schedule pickup for user: {}", principal.getName());
        PickupRequestResponse response = pickupRequestService.createPickupRequest(principal.getName(), request);
        return ResponseEntity.ok(ApiResponse.success("Pickup scheduled successfully", response));
    }

    @GetMapping("/history")
    public ResponseEntity<ApiResponse<List<PickupRequestResponse>>> getHistory(
            Principal principal,
            @RequestParam(value = "page", required = false) Integer page,
            @RequestParam(value = "size", required = false) Integer size
    ) {
        log.info("REST request to get pickup history for user: {}", principal.getName());
        List<PickupRequestResponse> response = pickupRequestService.getUserPickups(principal.getName());
        return ResponseEntity.ok(ApiResponse.success("Pickup request history fetched successfully", response));
    }

    @PutMapping("/cancel/{id}")
    public ResponseEntity<ApiResponse<PickupRequestResponse>> cancelPickup(
            @PathVariable Long id,
            Principal principal
    ) {
        log.info("REST request to cancel pickup: {} for user: {}", id, principal.getName());
        PickupRequestResponse response = pickupRequestService.cancelPickupRequest(id, principal.getName());
        return ResponseEntity.ok(ApiResponse.success("Pickup request cancelled successfully", response));
    }
}

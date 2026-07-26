package com.smartwaste.controller;

import com.smartwaste.dto.ApiResponse;
import com.smartwaste.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/public")
@RequiredArgsConstructor
@Slf4j
public class PublicController {

    private final UserRepository userRepository;
    private final WasteReportRepository wasteReportRepository;
    private final PickupRequestRepository pickupRequestRepository;
    private final ComplaintRepository complaintRepository;

    /**
     * Public platform statistics endpoint — no auth required.
     * Used by the landing page hero section to display live numbers.
     */
    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getPlatformStats() {
        log.info("Public request to fetch platform statistics");

        long totalUsers    = userRepository.count();
        long totalReports  = wasteReportRepository.count();
        long totalPickups  = pickupRequestRepository.count();
        long totalComplaints = complaintRepository.count();

        Map<String, Object> stats = new LinkedHashMap<>();
        stats.put("totalUsers",       totalUsers);
        stats.put("totalReports",     totalReports);
        stats.put("totalPickups",     totalPickups);
        stats.put("totalComplaints",  totalComplaints);
        stats.put("wasteCategories",  9);   // Supported categories count (system constant)
        stats.put("languages",        4);   // Supported languages: en, hi, ta, ml
        stats.put("aiAvailability",   "24/7");
        stats.put("analysisAccuracy", "Real-time");

        return ResponseEntity.ok(ApiResponse.success("Platform statistics fetched successfully", stats));
    }
}

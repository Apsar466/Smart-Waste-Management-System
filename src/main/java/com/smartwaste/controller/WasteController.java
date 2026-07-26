package com.smartwaste.controller;

import com.smartwaste.dto.ApiResponse;
import com.smartwaste.dto.WasteReportResponse;
import com.smartwaste.service.WasteReportService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/waste")
@RequiredArgsConstructor
@Slf4j
public class WasteController {

    private final WasteReportService wasteReportService;

    @PostMapping(value = "/analyze", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<WasteReportResponse>> analyzeWaste(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "location", required = false) String location,
            @RequestParam(value = "latitude", required = false) Double latitude,
            @RequestParam(value = "longitude", required = false) Double longitude,
            @RequestParam(value = "language", required = false) String language,
            Principal principal
    ) {
        log.info("REST request to analyze waste image for user: {}", principal.getName());
        WasteReportResponse response = wasteReportService.analyzeWaste(
                principal.getName(), file, location, latitude, longitude, language
        );
        return ResponseEntity.ok(ApiResponse.success("Waste analyzed successfully", response, response.getLanguage()));
    }

    @GetMapping("/history")
    public ResponseEntity<ApiResponse<List<WasteReportResponse>>> getHistory(Principal principal) {
        log.info("REST request to get waste history for user: {}", principal.getName());
        List<WasteReportResponse> response = wasteReportService.getUserHistory(principal.getName());
        return ResponseEntity.ok(ApiResponse.success("Waste report history fetched successfully", response));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<WasteReportResponse>> getReportById(
            @PathVariable Long id,
            Principal principal
    ) {
        log.info("REST request to get waste report: {} for user: {}", id, principal.getName());
        WasteReportResponse response = wasteReportService.getReportById(id, principal.getName());
        return ResponseEntity.ok(ApiResponse.success("Waste report details fetched successfully", response));
    }
}

package com.smartwaste.controller;

import com.smartwaste.dto.ApiResponse;
import com.smartwaste.dto.ComplaintResponse;
import com.smartwaste.service.ComplaintService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/complaints")
@RequiredArgsConstructor
@Slf4j
public class ComplaintController {

    private final ComplaintService complaintService;

    @PostMapping(value = "/report", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<ComplaintResponse>> reportComplaint(
            @RequestParam(value = "file", required = false) MultipartFile file,
            // Frontend sends "location" (address of the dumping site) as the complaint descriptor
            @RequestParam(value = "location", required = false) String location,
            // Also accept "complaintType" for backwards-compatibility
            @RequestParam(value = "complaintType", required = false) String complaintType,
            @RequestParam("description") String description,
            @RequestParam(value = "language", required = false) String language,
            Principal principal
    ) {
        // Use location if provided (from frontend), otherwise fall back to complaintType
        String resolvedType = (location != null && !location.isBlank()) ? location : complaintType;
        log.info("REST request to file complaint for user: {}", principal.getName());
        ComplaintResponse response = complaintService.reportComplaint(
                principal.getName(), file, resolvedType, description, language
        );
        return ResponseEntity.ok(ApiResponse.success("Complaint filed successfully", response, response.getLanguage()));
    }

    @GetMapping("/history")
    public ResponseEntity<ApiResponse<List<ComplaintResponse>>> getHistory(
            Principal principal,
            // Accept page/size params silently (frontend sends them for consistency)
            @RequestParam(value = "page", required = false) Integer page,
            @RequestParam(value = "size", required = false) Integer size
    ) {
        log.info("REST request to get complaint history for user: {}", principal.getName());
        List<ComplaintResponse> response = complaintService.getUserComplaints(principal.getName());
        return ResponseEntity.ok(ApiResponse.success("Complaint history fetched successfully", response));
    }
}

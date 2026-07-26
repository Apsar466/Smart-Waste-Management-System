package com.smartwaste.service;

import com.smartwaste.dto.WasteReportResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface WasteReportService {
    WasteReportResponse analyzeWaste(
            String email,
            MultipartFile file,
            String location,
            Double latitude,
            Double longitude,
            String language
    );

    List<WasteReportResponse> getUserHistory(String email);

    WasteReportResponse getReportById(Long id, String email);

    List<WasteReportResponse> getAllReports(); // for Admin
}

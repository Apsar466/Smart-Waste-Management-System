package com.smartwaste.service;

import com.smartwaste.dto.ComplaintResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ComplaintService {
    ComplaintResponse reportComplaint(
            String email,
            MultipartFile file,
            String complaintType,
            String description,
            String language
    );

    List<ComplaintResponse> getUserComplaints(String email);

    List<ComplaintResponse> getAllComplaints(); // for Admin

    ComplaintResponse updateComplaintStatus(Long id, String status, String comment); // for Admin
}

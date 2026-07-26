package com.smartwaste.service;

import com.smartwaste.dto.PickupRequestRequest;
import com.smartwaste.dto.PickupRequestResponse;

import java.util.List;

public interface PickupRequestService {
    PickupRequestResponse createPickupRequest(String email, PickupRequestRequest request);
    List<PickupRequestResponse> getUserPickups(String email);
    PickupRequestResponse cancelPickupRequest(Long id, String email);
    List<PickupRequestResponse> getAllPickups(); // for Admin
    PickupRequestResponse updatePickupStatus(Long id, String status, String driver, String remarks); // for Admin
}

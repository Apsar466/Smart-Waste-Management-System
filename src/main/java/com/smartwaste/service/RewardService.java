package com.smartwaste.service;

import com.smartwaste.dto.RewardResponse;

public interface RewardService {
    RewardResponse getUserRewards(String email);
}

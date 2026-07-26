package com.smartwaste.controller;

import com.smartwaste.dto.ApiResponse;
import com.smartwaste.dto.RewardResponse;
import com.smartwaste.service.RewardService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

@RestController
@RequestMapping("/rewards")
@RequiredArgsConstructor
@Slf4j
public class RewardController {

    private final RewardService rewardService;

    @GetMapping
    public ResponseEntity<ApiResponse<RewardResponse>> getRewards(Principal principal) {
        log.info("REST request to get rewards for user: {}", principal.getName());
        RewardResponse response = rewardService.getUserRewards(principal.getName());
        return ResponseEntity.ok(ApiResponse.success("Rewards fetched successfully", response));
    }
}

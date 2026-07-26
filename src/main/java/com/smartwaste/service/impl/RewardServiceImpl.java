package com.smartwaste.service.impl;

import com.smartwaste.dto.RewardResponse;
import com.smartwaste.entity.Reward;
import com.smartwaste.entity.User;
import com.smartwaste.exception.CustomExceptions.ResourceNotFoundException;
import com.smartwaste.mapper.DtoMapper;
import com.smartwaste.repository.RewardRepository;
import com.smartwaste.repository.UserRepository;
import com.smartwaste.service.RewardService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class RewardServiceImpl implements RewardService {

    private final UserRepository userRepository;
    private final RewardRepository rewardRepository;

    @Override
    @Transactional
    public RewardResponse getUserRewards(String email) {
        log.info("Fetching rewards for user: {}", email);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        Reward reward = rewardRepository.findByUserId(user.getId())
                .orElseGet(() -> rewardRepository.save(Reward.builder()
                        .user(user)
                        .points(0)
                        .badges("")
                        .build()));

        return DtoMapper.toRewardResponse(reward);
    }
}

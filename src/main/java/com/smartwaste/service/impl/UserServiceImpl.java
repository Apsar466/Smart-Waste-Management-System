package com.smartwaste.service.impl;

import com.smartwaste.dto.*;
import com.smartwaste.entity.AuditLog;
import com.smartwaste.entity.Reward;
import com.smartwaste.entity.Role;
import com.smartwaste.entity.User;
import com.smartwaste.exception.CustomExceptions.BadRequestException;
import com.smartwaste.exception.CustomExceptions.ResourceNotFoundException;
import com.smartwaste.exception.CustomExceptions.UnauthorizedException;
import com.smartwaste.mapper.DtoMapper;
import com.smartwaste.repository.AuditLogRepository;
import com.smartwaste.repository.RewardRepository;
import com.smartwaste.repository.UserRepository;
import com.smartwaste.security.JwtTokenProvider;
import com.smartwaste.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RewardRepository rewardRepository;
    private final AuditLogRepository auditLogRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final AuthenticationManager authenticationManager;

    @Override
    @Transactional
    public UserProfileResponse register(RegisterRequest request) {
        log.info("Registering user with email: {}", request.getEmail());

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email address is already in use.");
        }

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .address(request.getAddress())
                .role(Role.USER) // Default role is USER
                .build();

        User savedUser = userRepository.save(user);

        // Initialize user reward balance
        Reward reward = Reward.builder()
                .user(savedUser)
                .points(0)
                .badges("")
                .build();
        rewardRepository.save(reward);

        // Save Audit Log
        auditLogRepository.save(AuditLog.builder()
                .action("User Registered")
                .user(savedUser.getEmail())
                .build());

        return DtoMapper.toUserProfileResponse(savedUser);
    }

    @Override
    public LoginResponse login(LoginRequest request) {
        log.info("Authenticating user: {}", request.getEmail());

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String accessToken = tokenProvider.generateAccessToken(user.getEmail());
        String refreshToken = tokenProvider.generateRefreshToken(user.getEmail());

        // Save Audit Log
        auditLogRepository.save(AuditLog.builder()
                .action("User Logged In")
                .user(user.getEmail())
                .build());

        return LoginResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole().name())
                .build();
    }

    @Override
    public TokenResponse refreshToken(String refreshToken) {
        log.info("Refreshing JWT token");

        if (refreshToken == null || !tokenProvider.validateToken(refreshToken)) {
            throw new UnauthorizedException("Invalid or expired refresh token.");
        }

        String email = tokenProvider.getEmailFromJwt(refreshToken);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UnauthorizedException("User associated with refresh token not found."));

        String newAccessToken = tokenProvider.generateAccessToken(user.getEmail());
        String newRefreshToken = tokenProvider.generateRefreshToken(user.getEmail());

        return TokenResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(newRefreshToken)
                .build();
    }

    @Override
    @Transactional
    public void changePassword(String email, ChangePasswordRequest request) {
        log.info("Changing password for user: {}", email);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new BadRequestException("Current password does not match.");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        // Save Audit Log
        auditLogRepository.save(AuditLog.builder()
                .action("Password Changed")
                .user(user.getEmail())
                .build());
    }

    @Override
    public void forgotPassword(ForgotPasswordRequest request) {
        log.info("Forgot password triggered for email: {}", request.getEmail());

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email " + request.getEmail()));

        // In a real-world scenario, you would send an email with a reset token/link.
        // Since we are building the backend without an active SMTP server, we log it.
        auditLogRepository.save(AuditLog.builder()
                .action("Forgot Password Initiated")
                .user(user.getEmail())
                .build());
    }

    @Override
    public UserProfileResponse getProfile(String email) {
        User user = getUserByEmail(email);
        return DtoMapper.toUserProfileResponse(user);
    }

    @Override
    @Transactional
    public UserProfileResponse updateProfile(String email, UpdateProfileRequest request) {
        log.info("Updating profile for user: {}", email);

        User user = getUserByEmail(email);
        user.setFullName(request.getFullName());
        user.setPhone(request.getPhone());
        user.setAddress(request.getAddress());

        User updatedUser = userRepository.save(user);

        // Save Audit Log
        auditLogRepository.save(AuditLog.builder()
                .action("Profile Updated")
                .user(user.getEmail())
                .build());

        return DtoMapper.toUserProfileResponse(updatedUser);
    }

    @Override
    public List<UserProfileResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(DtoMapper::toUserProfileResponse)
                .collect(Collectors.toList());
    }

    @Override
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }
}

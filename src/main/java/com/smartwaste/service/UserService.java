package com.smartwaste.service;

import com.smartwaste.dto.*;
import com.smartwaste.entity.User;

import java.util.List;

public interface UserService {
    UserProfileResponse register(RegisterRequest request);
    LoginResponse login(LoginRequest request);
    TokenResponse refreshToken(String refreshToken);
    void changePassword(String email, ChangePasswordRequest request);
    void forgotPassword(ForgotPasswordRequest request);
    UserProfileResponse getProfile(String email);
    UserProfileResponse updateProfile(String email, UpdateProfileRequest request);
    List<UserProfileResponse> getAllUsers(); // for Admin
    User getUserByEmail(String email);
}

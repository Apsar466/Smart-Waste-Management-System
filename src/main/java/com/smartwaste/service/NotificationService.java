package com.smartwaste.service;

import com.smartwaste.dto.NotificationResponse;

import java.util.List;

public interface NotificationService {
    List<NotificationResponse> getUserNotifications(String email);
    void markAllAsRead(String email);
    void markRead(Long id, String email);
}

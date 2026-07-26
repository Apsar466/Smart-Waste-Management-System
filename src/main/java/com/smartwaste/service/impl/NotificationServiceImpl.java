package com.smartwaste.service.impl;

import com.smartwaste.dto.NotificationResponse;
import com.smartwaste.entity.Notification;
import com.smartwaste.entity.User;
import com.smartwaste.exception.CustomExceptions.ResourceNotFoundException;
import com.smartwaste.mapper.DtoMapper;
import com.smartwaste.repository.NotificationRepository;
import com.smartwaste.repository.UserRepository;
import com.smartwaste.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationServiceImpl implements NotificationService {

    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;

    @Override
    public List<NotificationResponse> getUserNotifications(String email) {
        log.info("Fetching notifications for user: {}", email);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        return notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).stream()
                .map(DtoMapper::toNotificationResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void markAllAsRead(String email) {
        log.info("Marking all notifications as read for user: {}", email);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        List<Notification> unread = notificationRepository.findByUserIdAndReadStatusFalseOrderByCreatedAtDesc(user.getId());
        for (Notification n : unread) {
            n.setReadStatus(true);
        }
        notificationRepository.saveAll(unread);
    }

    @Override
    @Transactional
    public void markRead(Long id, String email) {
        log.info("Marking notification {} as read for user: {}", id, email);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found with id: " + id));

        if (!notification.getUser().getId().equals(user.getId())) {
            throw new org.springframework.security.access.AccessDeniedException("You do not have permission to modify this notification");
        }

        notification.setReadStatus(true);
        notificationRepository.save(notification);
    }
}

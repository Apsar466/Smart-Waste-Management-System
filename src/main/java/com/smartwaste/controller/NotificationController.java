package com.smartwaste.controller;

import com.smartwaste.dto.ApiResponse;
import com.smartwaste.dto.NotificationResponse;
import com.smartwaste.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
@Slf4j
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<NotificationResponse>>> getNotifications(Principal principal) {
        log.info("REST request to get notifications for user: {}", principal.getName());
        List<NotificationResponse> response = notificationService.getUserNotifications(principal.getName());
        return ResponseEntity.ok(ApiResponse.success("Notifications fetched successfully", response));
    }

    @PostMapping("/read")
    public ResponseEntity<ApiResponse<Object>> markAsRead(Principal principal) {
        log.info("REST request to mark notifications as read for user: {}", principal.getName());
        notificationService.markAllAsRead(principal.getName());
        return ResponseEntity.ok(ApiResponse.success("All notifications marked as read", null));
    }

    @org.springframework.web.bind.annotation.PutMapping("/{id}/read")
    public ResponseEntity<ApiResponse<Object>> markNotificationAsRead(
            @org.springframework.web.bind.annotation.PathVariable Long id,
            Principal principal
    ) {
        log.info("REST request to mark notification {} as read for user: {}", id, principal.getName());
        notificationService.markRead(id, principal.getName());
        return ResponseEntity.ok(ApiResponse.success("Notification marked as read", null));
    }
}

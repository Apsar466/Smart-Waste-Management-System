package com.smartwaste.service;

import com.smartwaste.dto.*;
import java.util.List;

public interface AdminService {
    AdminDashboardResponse getDashboardStats();
    AdminAnalyticsResponse getAnalytics();
    List<AdminReportRow> generateReport(String type, String startDate, String endDate);
    void broadcastNotification(String title, String message);
    void deleteUser(Long id);
    void updateUserStatus(Long id, String status);
}

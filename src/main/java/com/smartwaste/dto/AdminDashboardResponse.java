package com.smartwaste.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminDashboardResponse {
    private long totalUsers;
    private long todayLogins;
    private long totalWasteAnalysed;
    private long geminiRequests;
    private long cacheHits;
    private double cacheHitRate;
    private double carbonSaved;
    private long pendingPickups;
    private long completedPickups;
    private long unreadNotifications;
    private long totalComplaints;
    
    // Additional metrics for visual charts and dashboard previews
    private List<MonthlyStat> monthlyWasteStats;
    private List<CategoryStat> wasteCategoryStats;
    private List<PickupStatusStat> pickupStatusStats;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class MonthlyStat {
        private String month;
        private long count;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class CategoryStat {
        private String category;
        private long count;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class PickupStatusStat {
        private String status;
        private long count;
    }
}

package com.smartwaste.controller;

import com.smartwaste.dto.*;
import com.smartwaste.service.AdminService;
import com.smartwaste.service.AICacheService;
import com.smartwaste.service.ComplaintService;
import com.smartwaste.service.PickupRequestService;
import com.smartwaste.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Slf4j
public class AdminController {

    private final UserService userService;
    private final ComplaintService complaintService;
    private final PickupRequestService pickupRequestService;
    private final AICacheService aiCacheService;
    private final AdminService adminService;

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<AdminDashboardResponse>> getDashboardStats() {
        log.info("Admin REST request to get dashboard stats");
        AdminDashboardResponse response = adminService.getDashboardStats();
        return ResponseEntity.ok(ApiResponse.success("Dashboard stats fetched successfully", response));
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<UserProfileResponse>>> getAllUsers(
            @RequestParam(value = "page", required = false) Integer page,
            @RequestParam(value = "size", required = false) Integer size
    ) {
        log.info("Admin REST request to get all users");
        List<UserProfileResponse> response = userService.getAllUsers();
        return ResponseEntity.ok(ApiResponse.success("All users fetched successfully", response));
    }

    @PutMapping("/users/{id}/status")
    public ResponseEntity<ApiResponse<Object>> updateUserStatus(
            @PathVariable Long id,
            @RequestParam("status") String status
    ) {
        log.info("Admin REST request to update status of user {} to {}", id, status);
        adminService.updateUserStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success("User status updated successfully", null));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<ApiResponse<Object>> deleteUser(@PathVariable Long id) {
        log.info("Admin REST request to delete user {}", id);
        adminService.deleteUser(id);
        return ResponseEntity.ok(ApiResponse.success("User deleted successfully", null));
    }

    @GetMapping("/pickups")
    public ResponseEntity<ApiResponse<List<PickupRequestResponse>>> getAllPickups() {
        log.info("Admin REST request to get all pickup requests");
        List<PickupRequestResponse> response = pickupRequestService.getAllPickups();
        return ResponseEntity.ok(ApiResponse.success("All pickup requests fetched successfully", response));
    }

    @PutMapping("/pickups/{id}/status")
    public ResponseEntity<ApiResponse<PickupRequestResponse>> updatePickupStatus(
            @PathVariable Long id,
            @RequestParam("status") String status,
            @RequestParam(value = "driver", required = false) String driver,
            @RequestParam(value = "remarks", required = false) String remarks
    ) {
        log.info("Admin REST request to update pickup: {} status to: {}", id, status);
        PickupRequestResponse response = pickupRequestService.updatePickupStatus(id, status, driver, remarks);
        return ResponseEntity.ok(ApiResponse.success("Pickup request status updated successfully", response));
    }

    @GetMapping("/complaints")
    public ResponseEntity<ApiResponse<List<ComplaintResponse>>> getAllComplaints() {
        log.info("Admin REST request to get all complaints");
        List<ComplaintResponse> response = complaintService.getAllComplaints();
        return ResponseEntity.ok(ApiResponse.success("All complaints fetched successfully", response));
    }

    @PutMapping("/complaints/{id}/status")
    public ResponseEntity<ApiResponse<ComplaintResponse>> updateComplaintStatus(
            @PathVariable Long id,
            @RequestParam("status") String status,
            @RequestParam(value = "comment", required = false) String comment
    ) {
        log.info("Admin REST request to update complaint: {} status to: {}, comment: {}", id, status, comment);
        ComplaintResponse response = complaintService.updateComplaintStatus(id, status, comment);
        return ResponseEntity.ok(ApiResponse.success("Complaint status updated successfully", response));
    }

    @GetMapping("/analytics")
    public ResponseEntity<ApiResponse<AdminAnalyticsResponse>> getAnalytics() {
        log.info("Admin REST request to get advanced analytics");
        AdminAnalyticsResponse response = adminService.getAnalytics();
        return ResponseEntity.ok(ApiResponse.success("Analytics fetched successfully", response));
    }

    @GetMapping("/cache/statistics")
    public ResponseEntity<ApiResponse<CacheStatisticsResponse>> getCacheStatistics() {
        log.info("Admin REST request to get AI cache statistics");
        CacheStatisticsResponse response = aiCacheService.getStatistics();
        return ResponseEntity.ok(ApiResponse.success("Cache statistics fetched successfully", response));
    }

    @GetMapping("/reports")
    public ResponseEntity<ApiResponse<List<AdminReportRow>>> getReports(
            @RequestParam(value = "type", defaultValue = "daily") String type,
            @RequestParam(value = "startDate", required = false) String startDate,
            @RequestParam(value = "endDate", required = false) String endDate
    ) {
        log.info("Admin REST request to get reports of type: {}", type);
        List<AdminReportRow> response = adminService.generateReport(type, startDate, endDate);
        return ResponseEntity.ok(ApiResponse.success("Reports generated successfully", response));
    }

    @GetMapping("/reports/export")
    public ResponseEntity<byte[]> exportReports(
            @RequestParam(value = "type", defaultValue = "daily") String type,
            @RequestParam(value = "startDate", required = false) String startDate,
            @RequestParam(value = "endDate", required = false) String endDate
    ) {
        log.info("Admin REST request to export reports of type: {}", type);
        List<AdminReportRow> rows = adminService.generateReport(type, startDate, endDate);

        StringBuilder csv = new StringBuilder();
        csv.append("Period,Users Registered,Waste Analyzed,Pickups Scheduled,Pickups Completed,Complaints Filed,Complaints Resolved,Carbon Saved (kg)\n");
        for (AdminReportRow row : rows) {
            csv.append(String.format("%s,%d,%d,%d,%d,%d,%d,%.2f\n",
                    row.getPeriod(),
                    row.getUsersRegistered(),
                    row.getWasteAnalyzed(),
                    row.getPickupsScheduled(),
                    row.getPickupsCompleted(),
                    row.getComplaintsFiled(),
                    row.getComplaintsResolved(),
                    row.getCarbonSavedKg()
            ));
        }

        byte[] output = csv.toString().getBytes();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType("text/csv"));
        headers.setContentDispositionFormData("attachment", "ecowaste_admin_report_" + type + ".csv");
        headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");

        return new ResponseEntity<>(output, headers, HttpStatus.OK);
    }

    @PostMapping("/notifications")
    public ResponseEntity<ApiResponse<Object>> broadcastNotification(
            @RequestParam("title") String title,
            @RequestParam("message") String message
    ) {
        log.info("Admin REST request to broadcast announcement: {}", title);
        adminService.broadcastNotification(title, message);
        return ResponseEntity.ok(ApiResponse.success("Notification broadcasted successfully", null));
    }
}

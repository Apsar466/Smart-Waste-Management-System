package com.smartwaste.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "pickup_requests")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PickupRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "report_id", nullable = false)
    private WasteReport report;

    @Column(name = "pickup_date", nullable = false)
    private LocalDateTime pickupDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private PickupStatus status;

    @Column(name = "assigned_driver")
    private String assignedDriver;

    @Column(name = "remarks", length = 1000)
    private String remarks;
}

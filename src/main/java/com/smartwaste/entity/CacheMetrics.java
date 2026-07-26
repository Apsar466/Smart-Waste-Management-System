package com.smartwaste.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "cache_metrics")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CacheMetrics {

    @Id
    private Long id;

    @Column(name = "gemini_requests", nullable = false)
    private long geminiRequests;

    @Column(name = "cache_hits", nullable = false)
    private long cacheHits;
}

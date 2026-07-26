package com.smartwaste.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "waste_analysis_cache", indexes = {
    @Index(name = "idx_image_hash", columnList = "image_hash")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WasteAnalysisCache {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "image_hash", nullable = false, unique = true, length = 64)
    private String imageHash;

    @Column(name = "waste_type")
    private String wasteType;

    @Column(name = "recyclable")
    private boolean recyclable;

    @Column(name = "confidence")
    private Double confidence;

    @Column(name = "disposal_method", columnDefinition = "TEXT")
    private String disposalMethod;

    @Column(name = "environmental_impact", columnDefinition = "TEXT")
    private String environmentalImpact;

    @Column(name = "recycling_suggestions", columnDefinition = "TEXT")
    private String recyclingSuggestions;

    @Column(name = "raw_ai_response", columnDefinition = "TEXT")
    private String rawAiResponse;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
}

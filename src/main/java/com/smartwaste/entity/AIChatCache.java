package com.smartwaste.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "ai_chat_cache", indexes = {
    @Index(name = "idx_norm_question_lang", columnList = "normalized_question, language")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AIChatCache {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "normalized_question", nullable = false, length = 500)
    private String normalizedQuestion;

    @Column(name = "language", nullable = false, length = 10)
    private String language;

    @Column(name = "ai_response", columnDefinition = "TEXT")
    private String aiResponse;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
}

package com.smartwaste.repository;

import com.smartwaste.entity.AIChatCache;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AIChatCacheRepository extends JpaRepository<AIChatCache, Long> {
    Optional<AIChatCache> findByNormalizedQuestionAndLanguage(String normalizedQuestion, String language);
}

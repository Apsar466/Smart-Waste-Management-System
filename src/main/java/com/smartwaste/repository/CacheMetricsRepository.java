package com.smartwaste.repository;

import com.smartwaste.entity.CacheMetrics;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface CacheMetricsRepository extends JpaRepository<CacheMetrics, Long> {

    @Modifying
    @Transactional
    @Query("UPDATE CacheMetrics m SET m.geminiRequests = m.geminiRequests + 1 WHERE m.id = 1")
    void incrementGeminiRequests();

    @Modifying
    @Transactional
    @Query("UPDATE CacheMetrics m SET m.cacheHits = m.cacheHits + 1 WHERE m.id = 1")
    void incrementCacheHits();
}

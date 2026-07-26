package com.smartwaste.repository;

import com.smartwaste.entity.WasteAnalysisCache;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WasteAnalysisCacheRepository extends JpaRepository<WasteAnalysisCache, Long> {
    Optional<WasteAnalysisCache> findByImageHash(String imageHash);
}

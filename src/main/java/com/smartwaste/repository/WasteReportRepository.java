package com.smartwaste.repository;

import com.smartwaste.entity.WasteReport;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WasteReportRepository extends JpaRepository<WasteReport, Long> {
    List<WasteReport> findByUserIdOrderByCreatedAtDesc(Long userId);
    Page<WasteReport> findByUserId(Long userId, Pageable pageable);
}

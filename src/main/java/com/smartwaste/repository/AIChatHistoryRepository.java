package com.smartwaste.repository;

import com.smartwaste.entity.AIChatHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AIChatHistoryRepository extends JpaRepository<AIChatHistory, Long> {
    List<AIChatHistory> findByUserIdOrderByTimestampAsc(Long userId);
}

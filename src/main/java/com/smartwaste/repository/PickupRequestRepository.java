package com.smartwaste.repository;

import com.smartwaste.entity.PickupRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PickupRequestRepository extends JpaRepository<PickupRequest, Long> {
    @Query("SELECT p FROM PickupRequest p WHERE p.report.user.id = :userId ORDER BY p.pickupDate DESC")
    List<PickupRequest> findByUserId(@Param("userId") Long userId);
}

package com.rms.backend2.repository;

import com.rms.backend2.model.StockAlert;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StockAlertRepository extends JpaRepository<StockAlert, Long> {

    Optional<StockAlert> findByInventoryItemId(Long inventoryItemId);
}
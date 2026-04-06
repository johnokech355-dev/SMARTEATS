package com.rms.backend2.repository;

import com.rms.backend2.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    @Query("""
        SELECT oi.name
        FROM OrderItem oi
        GROUP BY oi.name
        ORDER BY SUM(oi.quantity) DESC
    """)
    List<String> findTopSellingItems();
}
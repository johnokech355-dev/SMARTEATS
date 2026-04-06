package com.rms.backend2.repository;

import com.rms.backend2.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    // ===============================
    // ORDER LISTING
    // ===============================
    List<Order> findAllByOrderByCreatedAtDesc();
    List<Order> findByStatus(String status);
    List<Order> findByWaiterName(String waiterName);
    List<Order> findByTakeAway(Boolean takeAway);

    // ===============================
    // 📊 DASHBOARD KPIs
    // ===============================

    @Query("""
        SELECT COALESCE(SUM(o.totalAmount), 0)
        FROM Order o
        WHERE o.status = 'COMPLETED'
        AND o.createdAt BETWEEN :start AND :end
    """)
    Double sumTodayRevenue(@Param("start") LocalDateTime start,
                           @Param("end") LocalDateTime end);

    @Query("""
        SELECT COUNT(o)
        FROM Order o
        WHERE o.status IN ('PENDING','PREPARING')
    """)
    long countActiveOrders();

    @Query("""
        SELECT COUNT(o)
        FROM Order o
        WHERE o.tableNumber IS NOT NULL
        AND o.status IN ('PENDING','PREPARING')
    """)
    long countOccupiedTables();

    @Query("""
        SELECT COUNT(o)
        FROM Order o
        WHERE o.takeAway = TRUE
        AND o.status IN ('PENDING','PREPARING')
    """)
    long countTakeAwayOrders();

    @Query("""
        SELECT COALESCE(AVG(o.totalAmount), 0)
        FROM Order o
        WHERE o.status = 'COMPLETED'
    """)
    Double averageOrderValue();

    // ===============================
    // 📈 WEEKLY REVENUE
    // ===============================
    @Query("""
        SELECT FUNCTION('DAYNAME', o.createdAt), COALESCE(SUM(o.totalAmount), 0)
        FROM Order o
        WHERE o.status = 'COMPLETED'
        GROUP BY FUNCTION('DAYOFWEEK', o.createdAt), FUNCTION('DAYNAME', o.createdAt)
        ORDER BY FUNCTION('DAYOFWEEK', o.createdAt)
    """)
    List<Object[]> getWeeklyRevenue();

    // ===============================
    // ⏱️ PEAK HOUR (FIXED)
    // ===============================
    @Query("""
        SELECT FUNCTION('HOUR', o.createdAt)
        FROM Order o
        GROUP BY FUNCTION('HOUR', o.createdAt)
        ORDER BY COUNT(o) DESC
    """)
    List<Integer> findPeakHours();

    // ===============================
    // ⏱️ HOURLY ORDERS
    // ===============================
    @Query("""
        SELECT FUNCTION('HOUR', o.createdAt), COUNT(o)
        FROM Order o
        GROUP BY FUNCTION('HOUR', o.createdAt)
        ORDER BY FUNCTION('HOUR', o.createdAt)
    """)
    List<Object[]> getHourlyOrders();
}
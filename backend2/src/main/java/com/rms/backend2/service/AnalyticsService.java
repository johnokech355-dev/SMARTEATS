package com.rms.backend2.service;

import com.rms.backend2.repository.OrderRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;

@Service
public class AnalyticsService {

    private final OrderRepository orderRepository;

    public AnalyticsService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    // ===============================
    // 📊 DASHBOARD KPIs
    // ===============================
    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();

        LocalDate today = LocalDate.now();
        LocalDateTime startOfDay = today.atStartOfDay();
        LocalDateTime endOfDay = today.atTime(LocalTime.MAX);

        // Revenue today (safely)
        Double revenue = Optional.ofNullable(orderRepository.sumTodayRevenue(startOfDay, endOfDay))
                                 .orElse(0.0);

        // Active orders
        long activeOrders = orderRepository.countActiveOrders();

        // Table occupancy
        long tableOccupancy = orderRepository.countOccupiedTables();

        // Takeaway orders
        long takeawayOrders = orderRepository.countTakeAwayOrders();

        // Average order value
        Double avgOrderValue = Optional.ofNullable(orderRepository.averageOrderValue())
                                       .orElse(0.0);

        stats.put("revenue", revenue);
        stats.put("activeOrders", activeOrders);
        stats.put("tableOccupancy", tableOccupancy);
        stats.put("takeawayOrders", takeawayOrders);
        stats.put("averageOrderValue", avgOrderValue);

        return stats;
    }

    // ===============================
    // 📈 WEEKLY REVENUE
    // ===============================
    public List<Map<String, Object>> getWeeklyRevenue() {
        List<Object[]> results = Optional.ofNullable(orderRepository.getWeeklyRevenue())
                                         .orElse(Collections.emptyList());

        List<Map<String, Object>> data = new ArrayList<>();

        for (Object[] row : results) {
            Map<String, Object> item = new HashMap<>();

            // Safely handle nulls
            String dayFull = (row[0] != null) ? row[0].toString() : "Unknown";
            String dayShort = (dayFull.length() >= 3) ? dayFull.substring(0, 3) : dayFull;
            double revenue = (row[1] != null) ? ((Number) row[1]).doubleValue() : 0.0;

            item.put("day", dayShort);
            item.put("revenue", revenue);

            data.add(item);
        }

        // If no data, provide a dummy default to avoid frontend crash
        if (data.isEmpty()) {
            for (String d : Arrays.asList("Mon","Tue","Wed","Thu","Fri","Sat","Sun")) {
                Map<String,Object> dummy = new HashMap<>();
                dummy.put("day", d);
                dummy.put("revenue", 0.0);
                data.add(dummy);
            }
        }

        return data;
    }

    // ===============================
    // ⏱️ HOURLY ORDERS
    // ===============================
    public List<Map<String, Object>> getHourlyOrders() {
        List<Object[]> results = Optional.ofNullable(orderRepository.getHourlyOrders())
                                         .orElse(Collections.emptyList());

        List<Map<String, Object>> data = new ArrayList<>();

        for (Object[] row : results) {
            Map<String, Object> item = new HashMap<>();

            int hour = (row[0] != null) ? ((Number) row[0]).intValue() : 0;
            int orders = (row[1] != null) ? ((Number) row[1]).intValue() : 0;

            String label = hour + ":00";

            item.put("hour", label);
            item.put("orders", orders);

            data.add(item);
        }

        // Fill missing hours if empty
        if (data.isEmpty()) {
            for (int i = 0; i < 24; i++) {
                Map<String,Object> dummy = new HashMap<>();
                dummy.put("hour", i + ":00");
                dummy.put("orders", 0);
                data.add(dummy);
            }
        }

        return data;
    }
}
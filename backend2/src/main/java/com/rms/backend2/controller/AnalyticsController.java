package com.rms.backend2.controller;

import com.rms.backend2.service.AIInsightsService;
import com.rms.backend2.service.AnalyticsService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
@CrossOrigin(origins = "http://localhost:3000")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    // ===============================
    // 📊 Dashboard KPIs
    // ===============================
    @GetMapping("/dashboard-stats")
    public Map<String, Object> getDashboardStats() {
        return analyticsService.getDashboardStats();
    }

    // ===============================
    // 📈 Weekly Revenue
    // ===============================
    @GetMapping("/weekly-revenue")
    public List<Map<String, Object>> getWeeklyRevenue() {
        return analyticsService.getWeeklyRevenue();
    }

    // ===============================
    // ⏱️ Hourly Orders
    // ===============================
    @GetMapping("/hourly-orders")
    public List<Map<String, Object>> getHourlyOrders() {
        return analyticsService.getHourlyOrders();
    }
    
}
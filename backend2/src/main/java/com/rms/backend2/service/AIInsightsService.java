package com.rms.backend2.service;

import com.rms.backend2.repository.OrderItemRepository;
import com.rms.backend2.repository.OrderRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class AIInsightsService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;

    public AIInsightsService(OrderRepository orderRepository,
                             OrderItemRepository orderItemRepository) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
    }

    // ===============================
    // 📊 INSIGHTS (CARDS)
    // ===============================
    public List<String> generateInsights() {

        List<String> insights = new ArrayList<>();

        LocalDate today = LocalDate.now();
        LocalDateTime start = today.atStartOfDay();
        LocalDateTime end = today.atTime(23, 59);

        Double revenue = Optional.ofNullable(
                orderRepository.sumTodayRevenue(start, end)
        ).orElse(0.0);

        if (revenue > 1000) {
            insights.add("🔥 High revenue today: $" + revenue);
        } else {
            insights.add("📉 Revenue is low today: $" + revenue);
        }

        // 🍔 Top item
        String topItem = orderItemRepository.findTopSellingItems()
                .stream()
                .findFirst()
                .orElse(null);

        if (topItem != null) {
            insights.add("🍔 Most popular item: " + topItem);
        }

        // ⏱️ Peak hour
        Integer peakHour = orderRepository.findPeakHours()
                .stream()
                .findFirst()
                .orElse(null);

        if (peakHour != null) {
            insights.add("⏰ Peak orders at: " + peakHour + ":00");
        }

        Double avg = Optional.ofNullable(
                orderRepository.averageOrderValue()
        ).orElse(0.0);

        insights.add("💰 Avg order value: $" + avg);

        return insights;
    }

    // ===============================
    // 🤖 AI ASSISTANT (REAL DATA)
    // ===============================
    public String askAssistant(String message) {

        String lower = message.toLowerCase();

        LocalDate today = LocalDate.now();
        LocalDateTime start = today.atStartOfDay();
        LocalDateTime end = today.atTime(23, 59);

        Double revenue = Optional.ofNullable(
                orderRepository.sumTodayRevenue(start, end)
        ).orElse(0.0);

        Double avg = Optional.ofNullable(
                orderRepository.averageOrderValue()
        ).orElse(0.0);

        Long activeOrders = orderRepository.countActiveOrders();

        Integer peakHour = orderRepository.findPeakHours()
                .stream()
                .findFirst()
                .orElse(null);

        String topItem = orderItemRepository.findTopSellingItems()
                .stream()
                .findFirst()
                .orElse(null);

        // 🔥 SMART RESPONSES

        if (lower.contains("revenue")) {
            return "💰 Today's revenue is $" + revenue +
                   ". Average order value is $" + avg + ".";
        }

        if (lower.contains("order")) {
            return "🧾 You currently have " + activeOrders + " active orders.";
        }

        if (lower.contains("peak") || lower.contains("busy")) {
            return peakHour != null
                    ? "⏰ Peak time is around " + peakHour + ":00."
                    : "⏰ Peak hour data not available.";
        }

        if (lower.contains("popular") || lower.contains("top")) {
            return topItem != null
                    ? "🍔 Top selling item is " + topItem + "."
                    : "🍔 No top item data yet.";
        }

        if (lower.contains("summary") || lower.contains("status")) {
            return "📊 Business Summary:\n" +
                    "💰 Revenue: $" + revenue + "\n" +
                    "🧾 Active Orders: " + activeOrders + "\n" +
                    "📊 Avg Order: $" + avg + "\n" +
                    (peakHour != null ? "⏰ Peak Hour: " + peakHour + ":00\n" : "") +
                    (topItem != null ? "🍔 Top Item: " + topItem : "");
        }

        return "🤖 Current snapshot:\n" +
                "💰 Revenue: $" + revenue + "\n" +
                "🧾 Orders: " + activeOrders + "\n" +
                "📊 Avg: $" + avg;
    }
}
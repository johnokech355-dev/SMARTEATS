package com.rms.backend2.controller;

import com.rms.backend2.events.OrderEvent;
import com.rms.backend2.events.OrderEventType;
import com.rms.backend2.model.Order;
import com.rms.backend2.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin("*")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    // ===============================
    // CREATE ORDER
    // ===============================
    @PreAuthorize("hasAnyRole('WAITER','MANAGER','OWNER')")
    @PostMapping
    public Order createOrder(@RequestBody Order order){

        Order saved = orderService.createOrder(order);

        messagingTemplate.convertAndSend(
                "/topic/orders",
                new OrderEvent(OrderEventType.ORDER_CREATED, saved)
        );

        return saved;
    }

    // ===============================
    // UPDATE ORDER
    // ===============================
    @PutMapping("/{id}")
    public Order updateOrder(
            @PathVariable Long id,
            @RequestBody Order order){

        Order saved = orderService.updateOrder(id, order);

        messagingTemplate.convertAndSend(
                "/topic/orders",
                new OrderEvent(OrderEventType.ORDER_UPDATED, saved)
        );

        return saved;
    }

    // ===============================
    // UPDATE STATUS (ROLE SAFE ⭐)
    // ===============================
    @PreAuthorize("hasAnyRole('CHEF','CASHIER','MANAGER','OWNER')")
    @PutMapping("/{id}/status")
    public Order updateStatus(
            @PathVariable Long id,
            @RequestParam String status){

        // 🔍 Get existing order
        Order existing = orderService.getOrderById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        String currentStatus = existing.getStatus();

        // 🔐 Get user role
        String role = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getAuthorities()
                .iterator()
                .next()
                .getAuthority();

        // ===============================
        // 🚫 ROLE VALIDATION
        // ===============================

        // 👨‍🍳 CHEF rules
        if (role.contains("CHEF")) {
            boolean valid =
                    (status.equals("PREPARING") && currentStatus.equals("PENDING")) ||
                    (status.equals("READY") && currentStatus.equals("PREPARING"));

            if (!valid) {
                throw new RuntimeException("Chef not allowed to perform this action");
            }
        }

        // 💰 CASHIER rules
        if (role.contains("CASHIER")) {
            boolean valid =
                    (status.equals("COMPLETED") && currentStatus.equals("READY"));

            if (!valid) {
                throw new RuntimeException("Cashier can only complete READY orders");
            }
        }

        // ===============================
        // ✅ SAVE STATUS
        // ===============================
        Order saved = orderService.updateOrderStatus(id, status);

        // ===============================
        // 📡 EVENT MAPPING
        // ===============================
        OrderEventType eventType = switch (saved.getStatus()) {

            case "PREPARING" -> OrderEventType.ORDER_PREPARING;
            case "READY" -> OrderEventType.ORDER_READY;
            case "COMPLETED" -> OrderEventType.ORDER_COMPLETED;
            case "CANCELLED" -> OrderEventType.ORDER_CANCELLED;

            default -> OrderEventType.ORDER_UPDATED;
        };

        messagingTemplate.convertAndSend(
                "/topic/orders",
                new OrderEvent(eventType, saved)
        );

        return saved;
    }

    // ===============================
    // GET ORDERS
    // ===============================
    @GetMapping
    public List<Order> getAllOrders(){
        return orderService.getAllOrders();
    }

    @GetMapping("/{id}")
    public Optional<Order> getOrderById(@PathVariable Long id){
        return orderService.getOrderById(id);
    }

    // ===============================
    // DELETE ORDER
    // ===============================
    @DeleteMapping("/{id}")
    public void deleteOrder(@PathVariable Long id){
        orderService.deleteOrder(id);
    }

    // ===============================
    // FILTERS
    // ===============================
    @GetMapping("/status/{status}")
    public List<Order> getOrdersByStatus(@PathVariable String status){
        return orderService.getOrdersByStatus(status);
    }

    @GetMapping("/waiter/{waiter}")
    public List<Order> getOrdersByWaiter(@PathVariable String waiter){
        return orderService.getOrdersByWaiter(waiter);
    }

    @GetMapping("/type/{takeAway}")
    public List<Order> getOrdersByTakeAway(@PathVariable Boolean takeAway){
        return orderService.getOrdersByTakeAway(takeAway);
    }
}
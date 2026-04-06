package com.rms.backend2.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String customerName;

    private Double totalAmount = 0.0;

    private String status;

    private String priority = "medium";

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private String waiterName;

    private Boolean takeAway;

    private Integer tableNumber;

    @OneToMany(
            mappedBy = "order",
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.EAGER
    )
    private List<OrderItem> items = new ArrayList<>();

    public Order() {
        this.createdAt = LocalDateTime.now();
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    // =========================
    // BUSINESS LOGIC
    // =========================

    public void recalculateTotal() {
        this.totalAmount = items.stream()
                .mapToDouble(i -> {
                    if (i.getPrice() == null || i.getQuantity() == null) return 0.0;
                    return i.getPrice() * i.getQuantity();
                })
                .sum();
    }

    // =========================
    // ITEM HANDLING
    // =========================

    public void setItems(List<OrderItem> items) {

        this.items.clear();

        if (items != null) {
            for (OrderItem item : items) {
                addItem(item);
            }
        }

        recalculateTotal();
    }

    public void addItem(OrderItem item) {
        item.setOrder(this);
        items.add(item);
    }

    // =========================
    // GETTERS & SETTERS
    // =========================

    public Long getId() {
        return id;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public Double getTotalAmount() {
        return totalAmount;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public String getWaiterName() {
        return waiterName;
    }

    public void setWaiterName(String waiterName) {
        this.waiterName = waiterName;
    }

    public Boolean getTakeAway() {
        return takeAway;
    }

    public void setTakeAway(Boolean takeAway) {
        this.takeAway = takeAway;
    }

    public Integer getTableNumber() {
        return tableNumber;
    }

    public void setTableNumber(Integer tableNumber) {
        this.tableNumber = tableNumber;
    }

    public List<OrderItem> getItems() {
        return items;
    }
}
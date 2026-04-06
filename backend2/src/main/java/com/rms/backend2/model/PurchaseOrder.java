package com.rms.backend2.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "purchase_orders")
public class PurchaseOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "inventory_item_id")
    private InventoryItem inventoryItem;

    @Column(nullable = false)
    private int quantityOrdered;

    private String supplier;

    @Enumerated(EnumType.STRING)
    private PurchaseOrderStatus status;

    private LocalDateTime createdAt;

    @Version
    private Long version;

    public PurchaseOrder() {
        this.createdAt = LocalDateTime.now();
        this.status = PurchaseOrderStatus.PENDING;
    }

    // Getters & Setters

    public Long getId() { return id; }

    public void setId(Long id) { this.id = id; }

    public InventoryItem getInventoryItem() { return inventoryItem; }

    public void setInventoryItem(InventoryItem inventoryItem) {
        this.inventoryItem = inventoryItem;
    }

    public int getQuantityOrdered() { return quantityOrdered; }

    public void setQuantityOrdered(int quantityOrdered) {
        this.quantityOrdered = quantityOrdered;
    }

    public String getSupplier() { return supplier; }

    public void setSupplier(String supplier) {
        this.supplier = supplier;
    }

    public PurchaseOrderStatus getStatus() { return status; }

    public void setStatus(PurchaseOrderStatus status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() { return createdAt; }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Long getVersion() { return version; }

    public void setVersion(Long version) { this.version = version; }
}

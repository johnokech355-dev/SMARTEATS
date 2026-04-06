package com.rms.backend2.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "inventory_items")
public class InventoryItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String category;

    @Column(name = "stock", nullable = false)
    private Integer quantity;

    @Column(name = "low_stock", nullable = false)
    private Integer reorderLevel;

    @Column(name = "supplier")
    private String supplier;

    @Column(name = "unit")
    private String unit;

    @Column(name = "supplier_reliability")
    private Integer supplierReliability;   // NEW

    @Column(name = "last_restocked")
    private LocalDate lastRestocked;       // NEW

    @Enumerated(EnumType.STRING)
    private InventoryStatus status;

    @Version
    private Long version;

    public InventoryItem() {}

    // Getters & Setters

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public Integer getReorderLevel() { return reorderLevel; }
    public void setReorderLevel(Integer reorderLevel) { this.reorderLevel = reorderLevel; }

    public String getSupplier() { return supplier; }
    public void setSupplier(String supplier) { this.supplier = supplier; }

    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }

    public Integer getSupplierReliability() { return supplierReliability; }
    public void setSupplierReliability(Integer supplierReliability) { this.supplierReliability = supplierReliability; }

    public LocalDate getLastRestocked() { return lastRestocked; }
    public void setLastRestocked(LocalDate lastRestocked) { this.lastRestocked = lastRestocked; }

    public InventoryStatus getStatus() { return status; }
    public void setStatus(InventoryStatus status) { this.status = status; }

    public Long getVersion() { return version; }
    public void setVersion(Long version) { this.version = version; }
}
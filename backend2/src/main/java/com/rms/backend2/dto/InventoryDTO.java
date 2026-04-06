package com.rms.backend2.dto;

public class InventoryDTO {

    private Long id;
    private String name;
    private String category;
    private Integer quantity;
    private Integer reorderLevel;
    private String supplier;
    private String unit;
    private Integer supplierReliability;  // NEW
    private String lastRestocked;         // NEW (String for JSON)
    private String status;

    public InventoryDTO() {}

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

    public String getLastRestocked() { return lastRestocked; }
    public void setLastRestocked(String lastRestocked) { this.lastRestocked = lastRestocked; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
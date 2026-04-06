package com.rms.backend2.dto;

public class StockAlertDTO {

    private Long id;
    private Long inventoryItemId;
    private String itemName;
    private int currentStock;
    private int minThreshold;
    private String alertType;
    private String status;
    private String notificationMethod;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getInventoryItemId() { return inventoryItemId; }
    public void setInventoryItemId(Long inventoryItemId) {
        this.inventoryItemId = inventoryItemId;
    }

    public String getItemName() { return itemName; }
    public void setItemName(String itemName) {
        this.itemName = itemName;
    }

    public int getCurrentStock() { return currentStock; }
    public void setCurrentStock(int currentStock) {
        this.currentStock = currentStock;
    }

    public int getMinThreshold() { return minThreshold; }
    public void setMinThreshold(int minThreshold) {
        this.minThreshold = minThreshold;
    }

    public String getAlertType() { return alertType; }
    public void setAlertType(String alertType) {
        this.alertType = alertType;
    }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getNotificationMethod() { return notificationMethod; }
    public void setNotificationMethod(String notificationMethod) {
        this.notificationMethod = notificationMethod;
    }
}
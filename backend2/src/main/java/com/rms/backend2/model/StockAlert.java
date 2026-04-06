package com.rms.backend2.model;

import jakarta.persistence.*;

@Entity
@Table(name = "stock_alerts")
public class StockAlert {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "inventory_item_id")
    private InventoryItem inventoryItem;

    @Enumerated(EnumType.STRING)
    private AlertType alertType;

    private boolean active = true;

    private String notificationMethod = "DASHBOARD";

    @Version
    private Long version;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public InventoryItem getInventoryItem() { return inventoryItem; }
    public void setInventoryItem(InventoryItem inventoryItem) { this.inventoryItem = inventoryItem; }

    public AlertType getAlertType() { return alertType; }
    public void setAlertType(AlertType alertType) { this.alertType = alertType; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

    public String getNotificationMethod() { return notificationMethod; }
    public void setNotificationMethod(String notificationMethod) {
        this.notificationMethod = notificationMethod;
    }

    public Long getVersion() { return version; }
    public void setVersion(Long version) { this.version = version; }
}
package com.rms.backend2.model;

import jakarta.persistence.*;

@Entity
@Table(name = "menu_ingredients")
public class MenuIngredient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Which menu item uses this ingredient
    @ManyToOne
    @JoinColumn(name = "menu_item_id")
    private MenuItem menuItem;

    // Which inventory item it consumes
    @ManyToOne
    @JoinColumn(name = "inventory_item_id")
    private InventoryItem inventoryItem;

    // Quantity required for ONE menu item
    private Double quantityRequired;

    public MenuIngredient() {}

    public Long getId() { return id; }

    public MenuItem getMenuItem() { return menuItem; }
    public void setMenuItem(MenuItem menuItem) { this.menuItem = menuItem; }

    public InventoryItem getInventoryItem() { return inventoryItem; }
    public void setInventoryItem(InventoryItem inventoryItem) { this.inventoryItem = inventoryItem; }

    public Double getQuantityRequired() { return quantityRequired; }
    public void setQuantityRequired(Double quantityRequired) { this.quantityRequired = quantityRequired; }
}
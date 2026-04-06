package com.rms.backend2.service;

import com.rms.backend2.model.*;
import com.rms.backend2.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private MenuItemRepository menuItemRepository;

    // ✅ FIXED: use your actual repository names
    @Autowired
    private MenuIngredientRepository menuIngredientRepository;

    @Autowired
    private InventoryRepository inventoryRepository;

    // ===============================
    // CREATE ORDER
    // ===============================
    @Transactional
    public Order createOrder(Order order) {

        if (order.getStatus() == null) {
            order.setStatus("PENDING");
        } else {
            order.setStatus(order.getStatus().toUpperCase());
        }

        if (order.getPriority() == null) {
            order.setPriority("medium");
        }

        if (order.getItems() != null) {

            List<OrderItem> safeItems = new ArrayList<>();

            for (OrderItem item : order.getItems()) {

                MenuItem menu = menuItemRepository
                        .findById(item.getMenuItemId())
                        .orElseThrow(() -> new RuntimeException("Menu item not found"));

                // 🔥 GET INGREDIENTS
                List<MenuIngredient> ingredients =
                	    menuIngredientRepository.findByMenuItemId(menu.getId());
                for (MenuIngredient ing : ingredients) {

                    InventoryItem inventory = ing.getInventoryItem();

                    double totalRequired =
                            ing.getQuantityRequired() * item.getQuantity();

                    // ❗ CHECK STOCK
                    if (inventory.getQuantity() < totalRequired) {
                        throw new RuntimeException(
                                "Not enough stock for " + inventory.getName()
                        );
                    }

                    // 🔻 REDUCE STOCK
                    int updatedQty = inventory.getQuantity() - (int) Math.ceil(totalRequired);
                    inventory.setQuantity(updatedQty);

                    // ✅ SAVE USING YOUR REPO
                    inventoryRepository.save(inventory);
                }

                // CREATE SAFE ORDER ITEM
                OrderItem newItem = new OrderItem();

                newItem.setMenuItemId(menu.getId());
                newItem.setName(menu.getName());
                newItem.setPrice(menu.getPrice());
                newItem.setQuantity(item.getQuantity());
                newItem.setOrder(order);

                safeItems.add(newItem);
            }

            order.setItems(safeItems);
        }

        order.recalculateTotal();

        return orderRepository.save(order);
    }

    // ===============================
    // GET ALL ORDERS
    // ===============================
    public List<Order> getAllOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc();
    }

    // ===============================
    // GET ORDER BY ID
    // ===============================
    public Optional<Order> getOrderById(Long id) {
        return orderRepository.findById(id);
    }

    // ===============================
    // UPDATE ORDER
    // ===============================
    public Order updateOrder(Long id, Order updated) {

        return orderRepository.findById(id)
                .map(order -> {

                    if (updated.getCustomerName() != null)
                        order.setCustomerName(updated.getCustomerName());

                    if (updated.getWaiterName() != null)
                        order.setWaiterName(updated.getWaiterName());

                    if (updated.getTableNumber() != null)
                        order.setTableNumber(updated.getTableNumber());

                    if (updated.getTakeAway() != null)
                        order.setTakeAway(updated.getTakeAway());

                    if (updated.getStatus() != null)
                        order.setStatus(updated.getStatus().toUpperCase());

                    if (updated.getPriority() != null)
                        order.setPriority(updated.getPriority());

                    if (updated.getItems() != null) {

                        List<OrderItem> safeItems = new ArrayList<>();

                        for (OrderItem item : updated.getItems()) {

                            MenuItem menu = menuItemRepository
                                    .findById(item.getMenuItemId())
                                    .orElseThrow(() -> new RuntimeException("Menu item not found"));

                            OrderItem newItem = new OrderItem();

                            newItem.setMenuItemId(menu.getId());
                            newItem.setName(menu.getName());
                            newItem.setPrice(menu.getPrice());
                            newItem.setQuantity(item.getQuantity());
                            newItem.setOrder(order);

                            safeItems.add(newItem);
                        }

                        order.setItems(safeItems);
                    }

                    order.recalculateTotal();

                    return orderRepository.save(order);

                })
                .orElseThrow(() -> new RuntimeException("Order not found"));
    }

    // ===============================
    // UPDATE STATUS
    // ===============================
    public Order updateOrderStatus(Long id, String status) {

        return orderRepository.findById(id)
                .map(order -> {

                    order.setStatus(status.toUpperCase());
                    return orderRepository.save(order);

                })
                .orElseThrow(() -> new RuntimeException("Order not found"));
    }

    // ===============================
    // FILTERS
    // ===============================
    public List<Order> getOrdersByStatus(String status) {
        return orderRepository.findByStatus(status.toUpperCase());
    }

    public List<Order> getOrdersByWaiter(String waiter) {
        return orderRepository.findByWaiterName(waiter);
    }

    public List<Order> getOrdersByTakeAway(Boolean takeAway) {
        return orderRepository.findByTakeAway(takeAway);
    }

    // ===============================
    // DELETE ORDER
    // ===============================
    public void deleteOrder(Long id) {
        orderRepository.deleteById(id);
    }
}
package com.rms.backend2.service;

import com.rms.backend2.dto.PurchaseOrderDTO;
import com.rms.backend2.model.*;
import com.rms.backend2.repository.InventoryRepository;
import com.rms.backend2.repository.PurchaseOrderRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PurchaseOrderService {

    private final PurchaseOrderRepository orderRepository;
    private final InventoryRepository inventoryRepository;
    private final EmailService emailService;

    public PurchaseOrderService(PurchaseOrderRepository orderRepository,
                                InventoryRepository inventoryRepository,
                                EmailService emailService) {
        this.orderRepository = orderRepository;
        this.inventoryRepository = inventoryRepository;
        this.emailService = emailService;
    }

    public PurchaseOrderDTO createOrder(Long inventoryId,
                                        int quantity,
                                        String supplier) {

        InventoryItem item = inventoryRepository.findById(inventoryId)
                .orElseThrow(() -> new RuntimeException("Inventory not found"));

        PurchaseOrder order = new PurchaseOrder();
        order.setInventoryItem(item);
        order.setQuantityOrdered(quantity);
        order.setSupplier(supplier);
        order.setStatus(PurchaseOrderStatus.PENDING);

        // Save order
        PurchaseOrder savedOrder = orderRepository.save(order);

        // 🔥 Send email to supplier
        emailService.sendPurchaseOrderEmail(
                supplier,
                item.getName(),
                quantity
        );

        return convertToDTO(savedOrder);
    }

    public List<PurchaseOrderDTO> getAll() {
        return orderRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // 🔥 Clean business method for receiving
    @Transactional
    public PurchaseOrderDTO receiveOrder(Long id) {

        PurchaseOrder order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (order.getStatus() == PurchaseOrderStatus.RECEIVED) {
            throw new RuntimeException("Order already received");
        }

        InventoryItem item = order.getInventoryItem();
        item.setQuantity(item.getQuantity() + order.getQuantityOrdered());
        item.setLastRestocked(java.time.LocalDate.now()); // 🔥 NEW: update restock date
        inventoryRepository.save(item);

        order.setStatus(PurchaseOrderStatus.RECEIVED);

        return convertToDTO(orderRepository.save(order));
    }

    private PurchaseOrderDTO convertToDTO(PurchaseOrder order) {

        PurchaseOrderDTO dto = new PurchaseOrderDTO();
        dto.setId(order.getId());
        dto.setInventoryItemId(order.getInventoryItem().getId());
        dto.setInventoryItemName(order.getInventoryItem().getName());
        dto.setQuantityOrdered(order.getQuantityOrdered());
        dto.setSupplier(order.getSupplier());
        dto.setStatus(order.getStatus().name());
        dto.setCreatedAt(order.getCreatedAt());

        return dto;
    }
}
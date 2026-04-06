package com.rms.backend2.service;

import com.rms.backend2.dto.StockAlertDTO;
import com.rms.backend2.model.*;
import com.rms.backend2.repository.InventoryRepository;
import com.rms.backend2.repository.StockAlertRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class StockAlertService {

    private final StockAlertRepository alertRepository;
    private final InventoryRepository inventoryRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public StockAlertService(StockAlertRepository alertRepository,
                             InventoryRepository inventoryRepository,
                             SimpMessagingTemplate messagingTemplate) {

        this.alertRepository = alertRepository;
        this.inventoryRepository = inventoryRepository;
        this.messagingTemplate = messagingTemplate;
    }

    public StockAlertDTO evaluateAndCreateOrUpdate(Long inventoryItemId) {

        InventoryItem item = inventoryRepository.findById(inventoryItemId)
                .orElseThrow(() -> new RuntimeException("Inventory not found"));

        AlertType type = computeAlertType(item);

        if (type == null) {
            return new StockAlertDTO();
        }

        StockAlert alert = alertRepository
                .findByInventoryItemId(inventoryItemId)
                .orElse(new StockAlert());

        alert.setInventoryItem(item);
        alert.setAlertType(type);
        alert.setActive(true);

        StockAlert saved = alertRepository.save(alert);

        // 🔥 Real-time notification push
        messagingTemplate.convertAndSend(
                "/alerts/stock",
                "Stock alert updated"
        );

        return convertToDTO(saved);
    }

    public List<StockAlertDTO> getAllAlerts() {
        return alertRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public void toggleAlert(Long id) {

        StockAlert alert = alertRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Alert not found"));

        alert.setActive(!alert.isActive());
        alertRepository.save(alert);
    }

    public void deleteAlert(Long id) {
        alertRepository.deleteById(id);
    }

    private AlertType computeAlertType(InventoryItem item) {

        if (item.getQuantity() <= item.getReorderLevel() * 0.5) {
            return AlertType.CRITICAL_STOCK;
        }

        if (item.getQuantity() <= item.getReorderLevel()) {
            return AlertType.LOW_STOCK;
        }

        return null;
    }

    private StockAlertDTO convertToDTO(StockAlert alert) {

        StockAlertDTO dto = new StockAlertDTO();

        dto.setId(alert.getId());
        dto.setInventoryItemId(alert.getInventoryItem().getId());
        dto.setItemName(alert.getInventoryItem().getName());
        dto.setCurrentStock(alert.getInventoryItem().getQuantity());
        dto.setMinThreshold(alert.getInventoryItem().getReorderLevel());
        dto.setAlertType(alert.getAlertType().name());
        dto.setStatus(alert.isActive() ? "ACTIVE" : "PAUSED");

        return dto;
    }
}
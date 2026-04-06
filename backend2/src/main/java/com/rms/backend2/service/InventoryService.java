package com.rms.backend2.service;

import com.rms.backend2.dto.InventoryDTO;
import com.rms.backend2.model.InventoryItem;
import com.rms.backend2.model.InventoryStatus;
import com.rms.backend2.repository.InventoryRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class InventoryService {

    private final InventoryRepository repository;

    public InventoryService(InventoryRepository repository) {
        this.repository = repository;
    }

    public InventoryDTO createItem(InventoryDTO dto) {
        InventoryItem item = new InventoryItem();

        item.setName(dto.getName());
        item.setCategory(dto.getCategory());
        item.setSupplier(dto.getSupplier());
        item.setUnit(dto.getUnit());

        int quantity = dto.getQuantity() != null ? dto.getQuantity() : 0;
        int reorderLevel = dto.getReorderLevel() != null ? dto.getReorderLevel() : 0;

        item.setQuantity(quantity);
        item.setReorderLevel(reorderLevel);
        item.setSupplierReliability(dto.getSupplierReliability() != null ? dto.getSupplierReliability() : 100);
        item.setLastRestocked(LocalDate.now());

        item.setStatus(computeStatus(quantity, reorderLevel));

        return convertToDTO(repository.save(item));
    }

    public List<InventoryDTO> getAllItems() {
        return repository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public InventoryDTO updateItem(Long id, InventoryDTO dto) {
        InventoryItem item = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item not found"));

        item.setName(dto.getName());
        item.setCategory(dto.getCategory());
        item.setSupplier(dto.getSupplier());
        item.setUnit(dto.getUnit());

        int oldQuantity = item.getQuantity();

        int newQuantity = dto.getQuantity() != null ? dto.getQuantity() : oldQuantity;
        int reorderLevel = dto.getReorderLevel() != null ? dto.getReorderLevel() : item.getReorderLevel();

        item.setQuantity(newQuantity);
        item.setReorderLevel(reorderLevel);

        // 🔥 AUTO-UPDATE RESTOCK DATE IF STOCK INCREASES
        if (newQuantity > oldQuantity) {
            item.setLastRestocked(LocalDate.now());
        }

        if (dto.getSupplierReliability() != null) {
            item.setSupplierReliability(dto.getSupplierReliability());
        }

        item.setStatus(computeStatus(newQuantity, reorderLevel));

        return convertToDTO(repository.save(item));
    }

    public void deleteItem(Long id) {
        repository.deleteById(id);
    }

    private InventoryStatus computeStatus(Integer quantity, Integer reorderLevel) {
        int qty = quantity != null ? quantity : 0;
        int reorder = reorderLevel != null ? reorderLevel : 0;

        if (qty <= reorder * 0.5) return InventoryStatus.CRITICAL;
        if (qty <= reorder) return InventoryStatus.LOW;
        return InventoryStatus.GOOD;
    }

    private InventoryDTO convertToDTO(InventoryItem item) {
        InventoryDTO dto = new InventoryDTO();

        dto.setId(item.getId());
        dto.setName(item.getName());
        dto.setCategory(item.getCategory());
        dto.setQuantity(item.getQuantity());
        dto.setReorderLevel(item.getReorderLevel());
        dto.setSupplier(item.getSupplier());
        dto.setUnit(item.getUnit());
        dto.setSupplierReliability(item.getSupplierReliability());
        dto.setLastRestocked(
                item.getLastRestocked() != null ? item.getLastRestocked().toString() : null
        );
        dto.setStatus(item.getStatus().name());

        return dto;
    }
}
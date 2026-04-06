package com.rms.backend2.controller;

import com.rms.backend2.dto.InventoryDTO;
import com.rms.backend2.service.InventoryService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventory")
@CrossOrigin
public class InventoryController {

    private final InventoryService service;

    public InventoryController(InventoryService service) {
        this.service = service;
    }

    @PostMapping
    public InventoryDTO create(@RequestBody InventoryDTO dto) {
        return service.createItem(dto);
    }

    @GetMapping
    public List<InventoryDTO> getAll() {
        return service.getAllItems();
    }

    @PutMapping("/{id}")
    public InventoryDTO update(@PathVariable Long id,
                               @RequestBody InventoryDTO dto) {
        return service.updateItem(id, dto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.deleteItem(id);
    }
}

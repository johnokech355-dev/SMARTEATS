package com.rms.backend2.controller;

import com.rms.backend2.dto.StockAlertDTO;
import com.rms.backend2.service.StockAlertService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stock-alerts")
@CrossOrigin(origins = "http://localhost:3000")
public class StockAlertController {

    private final StockAlertService service;

    public StockAlertController(StockAlertService service) {
        this.service = service;
    }

    @GetMapping
    public List<StockAlertDTO> getAll() {
        return service.getAllAlerts();
    }

    @PostMapping("/evaluate/{inventoryId}")
    public StockAlertDTO evaluate(@PathVariable Long inventoryId) {
        return service.evaluateAndCreateOrUpdate(inventoryId);
    }

    @PutMapping("/{id}/toggle")
    public void toggle(@PathVariable Long id) {
        service.toggleAlert(id);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.deleteAlert(id);
    }
}
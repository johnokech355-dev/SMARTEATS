package com.rms.backend2.scheduler;

import com.rms.backend2.repository.InventoryRepository;
import com.rms.backend2.service.StockAlertService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class StockAlertScheduler {

    private final InventoryRepository inventoryRepository;
    private final StockAlertService stockAlertService;

    public StockAlertScheduler(InventoryRepository inventoryRepository,
                               StockAlertService stockAlertService) {
        this.inventoryRepository = inventoryRepository;
        this.stockAlertService = stockAlertService;
    }

    // Runs every 5 minutes
    @Scheduled(fixedRate = 300000)
    public void evaluateStockLevels() {

        inventoryRepository.findAll().forEach(item -> {
            stockAlertService.evaluateAndCreateOrUpdate(item.getId());
        });

        System.out.println("✅ Stock evaluation cycle completed");
    }
}
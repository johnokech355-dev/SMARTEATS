package com.rms.backend2.controller;

import com.rms.backend2.dto.PurchaseOrderDTO;
import com.rms.backend2.dto.PurchaseOrderCreateRequest;
import com.rms.backend2.service.PurchaseOrderService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/purchase-orders")
@CrossOrigin
public class PurchaseOrderController {

    private final PurchaseOrderService service;

    public PurchaseOrderController(PurchaseOrderService service) {
        this.service = service;
    }

    // ✅ CREATE ORDER
    @PostMapping
    public PurchaseOrderDTO create(@RequestBody PurchaseOrderCreateRequest request) {

        return service.createOrder(
                request.getInventoryItemId(),
                request.getQuantityOrdered(),
                request.getSupplier()
        );
    }

    // ✅ GET ALL ORDERS
    @GetMapping
    public List<PurchaseOrderDTO> getAll() {
        return service.getAll();
    }

    // 🔥 RECEIVE ORDER (Professional endpoint)
    @PutMapping("/{id}/receive")
    public PurchaseOrderDTO receive(@PathVariable Long id) {
        return service.receiveOrder(id);
    }
}
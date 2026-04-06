package com.rms.backend2.service;

import org.springframework.stereotype.Service;

@Service
public class NotificationServiceImpl implements NotificationService {

    @Override
    public void sendLowStockAlert(String message) {
        System.out.println("LOW STOCK ALERT → " + message);
    }

    @Override
    public void sendCriticalStockAlert(String message) {
        System.out.println("CRITICAL STOCK ALERT → " + message);
    }
}
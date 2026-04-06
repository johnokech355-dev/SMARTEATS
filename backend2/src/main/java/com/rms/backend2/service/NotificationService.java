package com.rms.backend2.service;

public interface NotificationService {

    void sendLowStockAlert(String message);

    void sendCriticalStockAlert(String message);
}
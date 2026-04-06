package com.rms.backend2.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendPurchaseOrderEmail(
            String supplierEmail,
            String itemName,
            int quantity
    ) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(supplierEmail);
        message.setSubject("New Purchase Order Request");

        message.setText(
                "Hello Supplier,\n\n" +
                "We would like to order the following item:\n\n" +
                "Item: " + itemName + "\n" +
                "Quantity: " + quantity + "\n\n" +
                "Please confirm delivery.\n\n" +
                "Restaurant RMS System"
        );

        mailSender.send(message);
    }
}

package com.rms.backend2.events;

import com.rms.backend2.model.Order;

public class OrderEvent {

    private OrderEventType type;
    private Order order;

    public OrderEvent() {
    }

    public OrderEvent(OrderEventType type, Order order) {
        this.type = type;
        this.order = order;
    }

    public OrderEventType getType() {
        return type;
    }

    public void setType(OrderEventType type) {
        this.type = type;
    }

    public Order getOrder() {
        return order;
    }

    public void setOrder(Order order) {
        this.order = order;
    }
}
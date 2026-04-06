package com.rms.backend2.config;

import com.rms.backend2.security.JwtUtil;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.web.socket.server.HandshakeInterceptor;

import java.net.URI;
import java.util.Map;

public class WebSocketAuthInterceptor implements HandshakeInterceptor {

    private final JwtUtil jwtUtil;

    public WebSocketAuthInterceptor(JwtUtil jwtUtil){
        this.jwtUtil = jwtUtil;
    }

    @Override
    public boolean beforeHandshake(
            ServerHttpRequest request,
            ServerHttpResponse response,
            org.springframework.web.socket.WebSocketHandler wsHandler,
            Map<String, Object> attributes) {

        try {

            URI uri = request.getURI();
            String query = uri.getQuery();

            if(query == null || !query.contains("token=")){
                return false;
            }

            String token = query.substring(query.indexOf("token=") + 6);

            if(jwtUtil.isTokenExpired(token)){
                return false;
            }

            attributes.put("token", token);

            return true;

        } catch(Exception e){
            return false;
        }
    }

    @Override
    public void afterHandshake(
            ServerHttpRequest request,
            ServerHttpResponse response,
            org.springframework.web.socket.WebSocketHandler wsHandler,
            Exception exception) {
    }
}
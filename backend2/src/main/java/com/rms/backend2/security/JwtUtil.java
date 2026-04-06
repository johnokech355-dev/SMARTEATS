 package com.rms.backend2.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtUtil {

    private static final String SECRET_KEY_STRING =
            "6e2e1f7d64a6b2dca8a8f1dcb8f9a8e5b2c1a5d7c6e4b8f0a1b2c3d4e5f6a7b8";

    private final SecretKey SECRET_KEY =
    	    Keys.hmacShaKeyFor(SECRET_KEY_STRING.getBytes());

    private final long EXPIRATION_TIME = 1000 * 60 * 60 * 10;

    public String extractUsername(String token){
        return extractAllClaims(token).getSubject();
    }

    public String extractRole(String token){
        return extractAllClaims(token)
                .get("role", String.class);
    }

    public Date extractExpiration(String token){
        return extractAllClaims(token).getExpiration();
    }

    public boolean isTokenExpired(String token){
        return extractExpiration(token).before(new Date());
    }

    public boolean isTokenValid(String token, String username){

        try{
            String extractedUsername = extractUsername(token);

            return extractedUsername.equals(username)
                    && !isTokenExpired(token);

        }catch(Exception e){
            return false;
        }
    }

    public String generateToken(String username, String role){

        return Jwts.builder()
                .setSubject(username)
                .claim("role", role)
                .setIssuedAt(new Date())
                .setExpiration(
                        new Date(System.currentTimeMillis() + EXPIRATION_TIME)
                )
                .signWith(SECRET_KEY, SignatureAlgorithm.HS256)
                .compact();
    }

    private Claims extractAllClaims(String token){
        return Jwts.parserBuilder()
                .setSigningKey(SECRET_KEY)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
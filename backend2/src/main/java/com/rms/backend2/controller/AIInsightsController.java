package com.rms.backend2.controller;

import com.rms.backend2.service.AIInsightsService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "http://localhost:3000")
public class AIInsightsController {

    private final AIInsightsService aiService;

    public AIInsightsController(AIInsightsService aiService) {
        this.aiService = aiService;
    }

    // ===============================
    // 📊 INSIGHTS PANEL
    // ===============================
    @GetMapping("/insights")
    public List<String> getInsights() {
        return aiService.generateInsights();
    }

    // ===============================
    // 🤖 AI ASSISTANT
    // ===============================
    @PostMapping("/assistant")
    public String askAssistant(@RequestBody Map<String, String> body) {

        String message = body.get("message");

        if (message == null || message.trim().isEmpty()) {
            return "Please ask a valid question.";
        }

        return aiService.askAssistant(message);
    }
}
package com.smartwaste.service.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.smartwaste.dto.ComplaintAnalysisResponse;
import com.smartwaste.dto.WasteAnalysisResponse;
import com.smartwaste.exception.CustomExceptions.GeminiException;
import com.smartwaste.service.GeminiService;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;

import java.util.*;

@Service
@Slf4j
public class GeminiServiceImpl implements GeminiService {

    private final RestClient restClient;
    private final ObjectMapper objectMapper;

    @Value("${app.gemini.api-key:}")
    private String apiKey;

    private static final String GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models/";
    // Ordered list of active Gemini models — primary is gemini-3.6-flash
    private static final String[] GEMINI_MODELS = {
        "gemini-3.6-flash",          // primary: active multimodal model
        "gemini-3.5-flash",          // fallback 1
        "gemini-2.0-flash-lite",     // fallback 2
        "gemini-flash-latest"        // fallback 3
    };
    private static final int MAX_RETRIES = 2;
    private static final long RETRY_BACKOFF_MS = 1500L;

    public GeminiServiceImpl(ObjectMapper objectMapper) {
        this.restClient = RestClient.builder().build();
        this.objectMapper = objectMapper;
    }

    @PostConstruct
    public void verifyApiKeyOnStartup() {
        if (apiKey == null || apiKey.trim().isEmpty()) {
            log.error("CRITICAL CONFIGURATION ERROR: Google Gemini API key is missing! " +
                      "Please configure the GEMINI_API_KEY environment variable.");
        } else {
            log.info("Google Gemini API configuration: Key successfully validated and loaded.");
        }
    }

    @Override
    public WasteAnalysisResponse analyzeWasteImage(byte[] imageBytes, String mimeType, String language) {
        log.info("Analyzing waste image of size {} bytes, mimeType={}, language={}", imageBytes.length, mimeType, language);

        String langName = getLanguageName(language);
        String prompt = String.format(
            "You are an expert AI waste classifier and environmental analyst. " +
            "Analyze the waste item in the provided image and respond ONLY with a valid JSON object strictly matching this schema:\n" +
            "{\n" +
            "  \"wasteCategory\": \"Organic|Plastic|Paper|Metal|Glass|E-Waste|Hazardous|Other\",\n" +
            "  \"confidence\": 0.95,\n" +
            "  \"recyclable\": true,\n" +
            "  \"disposalMethod\": \"Short step-by-step instructions on how to properly dispose of or recycle this item in %s.\",\n" +
            "  \"environmentalImpact\": \"A concise 2-sentence explanation of the environmental footprint or CO2 savings from proper disposal in %s.\",\n" +
            "  \"detailedExplanation\": \"Comprehensive details about the item material, degradation time, and recycling potential in %s.\",\n" +
            "  \"safetyWarnings\": \"Any handling precautions (e.g. sharp glass, hazardous chemicals, battery risk) in %s, or empty string if safe.\"\n" +
            "}\n" +
            "Do NOT include markdown backticks around the JSON. Output raw JSON only.",
            langName, langName, langName, langName
        );

        try {
            String jsonText = callGeminiMultimodal(prompt, imageBytes, mimeType);
            return parseWasteAnalysisResponse(jsonText);
        } catch (Exception e) {
            log.error("Failed to analyze waste image with Gemini AI: {}", e.getMessage(), e);
            throw new GeminiException("AI waste analysis service is currently unavailable. " + e.getMessage());
        }
    }

    @Override
    public ComplaintAnalysisResponse analyzeComplaintImage(byte[] imageBytes, String mimeType) {
        log.info("Analyzing complaint image of size {} bytes, mimeType={}", imageBytes.length, mimeType);

        String prompt =
            "You are an AI civic infrastructure auditor. " +
            "Analyze the provided image of a waste management issue or civic complaint and respond ONLY with a valid JSON object strictly matching this schema:\n" +
            "{\n" +
            "  \"severity\": \"LOW|MEDIUM|HIGH|CRITICAL\",\n" +
            "  \"aiAnalysis\": \"Concise professional audit summarizing the observed hazard, volume of illegal dumping/overflow, and urgency.\",\n" +
            "  \"summary\": \"Short 1-sentence title for the complaint report.\"\n" +
            "}\n" +
            "Do NOT include markdown backticks. Output raw JSON only.";

        try {
            String jsonText = callGeminiMultimodal(prompt, imageBytes, mimeType);
            return parseComplaintAnalysisResponse(jsonText);
        } catch (Exception e) {
            log.error("Failed to analyze complaint image with Gemini AI: {}", e.getMessage(), e);
            throw new GeminiException("AI complaint analysis service is currently unavailable. " + e.getMessage());
        }
    }

    @Override
    public String chatWithAI(String userQuestion, String language) {
        log.info("AI chat request: question='{}', language='{}'", userQuestion, language);

        String langName = getLanguageName(language);
        String prompt = String.format(
            "You are EcoBot, an intelligent and friendly environmental assistant for EcoWaste AI. " +
            "Answer the user's question accurately, concisely, and helpfully in %s. " +
            "Focus on sustainability, waste segregation, recycling guidelines, carbon footprint reduction, and eco-friendly tips.\n\n" +
            "User Question: %s",
            langName, userQuestion
        );

        try {
            return callGeminiText(prompt);
        } catch (Exception e) {
            log.error("Failed to process AI chat with Gemini: {}", e.getMessage(), e);
            throw new GeminiException("AI Assistant is currently unavailable. " + e.getMessage());
        }
    }

    private String callGeminiMultimodal(String prompt, byte[] imageBytes, String mimeType) throws Exception {
        validateApiKey();

        String base64Data = Base64.getEncoder().encodeToString(imageBytes);
        Map<String, Object> textPart = Map.of("text", prompt);
        Map<String, Object> inlineData = Map.of(
            "mime_type", mimeType != null ? mimeType : "image/jpeg",
            "data", base64Data
        );
        Map<String, Object> imagePart = Map.of("inline_data", inlineData);

        Map<String, Object> contentNode = Map.of("parts", List.of(textPart, imagePart));
        Map<String, Object> requestBody = Map.of("contents", List.of(contentNode));

        Exception lastException = null;

        for (String model : GEMINI_MODELS) {
            String url = GEMINI_BASE_URL + model + ":generateContent?key=" + apiKey;
            boolean modelAvailable = true;
            for (int attempt = 1; attempt <= MAX_RETRIES && modelAvailable; attempt++) {
                try {
                    log.info("Gemini multimodal call: model={} attempt={}", model, attempt);
                    String responseStr = restClient.post()
                            .uri(url)
                            .contentType(MediaType.APPLICATION_JSON)
                            .body(requestBody)
                            .retrieve()
                            .body(String.class);
                    return extractTextFromGeminiResponse(responseStr);
                } catch (HttpClientErrorException.NotFound | HttpClientErrorException.Forbidden
                        | HttpClientErrorException.TooManyRequests e) {
                    lastException = e;
                    log.warn("Gemini model={} not available ({}). Trying next model.", model, e.getStatusCode());
                    modelAvailable = false;
                } catch (HttpServerErrorException.ServiceUnavailable | HttpServerErrorException.GatewayTimeout e) {
                    lastException = e;
                    log.warn("Gemini model={} returned {} on attempt {}. Retrying...", model, e.getStatusCode(), attempt);
                    if (attempt < MAX_RETRIES) {
                        Thread.sleep(RETRY_BACKOFF_MS * attempt);
                    }
                }
            }
        }

        throw new RuntimeException("All Gemini models failed after retries.", lastException);
    }

    private String callGeminiText(String prompt) throws Exception {
        validateApiKey();

        Map<String, Object> textPart = Map.of("text", prompt);
        Map<String, Object> contentNode = Map.of("parts", List.of(textPart));
        Map<String, Object> requestBody = Map.of("contents", List.of(contentNode));

        Exception lastException = null;

        for (String model : GEMINI_MODELS) {
            String url = GEMINI_BASE_URL + model + ":generateContent?key=" + apiKey;
            boolean modelAvailable = true;
            for (int attempt = 1; attempt <= MAX_RETRIES && modelAvailable; attempt++) {
                try {
                    log.info("Gemini text call: model={} attempt={}", model, attempt);
                    String responseStr = restClient.post()
                            .uri(url)
                            .contentType(MediaType.APPLICATION_JSON)
                            .body(requestBody)
                            .retrieve()
                            .body(String.class);
                    return extractTextFromGeminiResponse(responseStr);
                } catch (HttpClientErrorException.NotFound | HttpClientErrorException.Forbidden
                        | HttpClientErrorException.TooManyRequests e) {
                    lastException = e;
                    log.warn("Gemini model={} not available ({}). Trying next model.", model, e.getStatusCode());
                    modelAvailable = false;
                } catch (HttpServerErrorException.ServiceUnavailable | HttpServerErrorException.GatewayTimeout e) {
                    lastException = e;
                    log.warn("Gemini model={} returned {} on attempt {}. Retrying...", model, e.getStatusCode(), attempt);
                    if (attempt < MAX_RETRIES) {
                        Thread.sleep(RETRY_BACKOFF_MS * attempt);
                    }
                }
            }
        }

        throw new RuntimeException("All Gemini models failed after retries.", lastException);
    }

    private void validateApiKey() {
        if (apiKey == null || apiKey.trim().isEmpty()) {
            log.error("Gemini API key is not configured.");
            throw new GeminiException("Gemini API key is missing. Please configure 'app.gemini.api-key' in application.properties or set GEMINI_API_KEY environment variable.");
        }
    }

    private String extractTextFromGeminiResponse(String responseStr) throws Exception {
        JsonNode root = objectMapper.readTree(responseStr);
        JsonNode candidates = root.path("candidates");
        if (candidates.isArray() && !candidates.isEmpty()) {
            JsonNode parts = candidates.get(0).path("content").path("parts");
            if (parts.isArray() && !parts.isEmpty()) {
                String text = parts.get(0).path("text").asText();
                // Clean markdown code fence formatting if present
                if (text.startsWith("```json")) {
                    text = text.substring(7);
                } else if (text.startsWith("```")) {
                    text = text.substring(3);
                }
                if (text.endsWith("```")) {
                    text = text.substring(0, text.length() - 3);
                }
                return text.trim();
            }
        }
        throw new GeminiException("Unexpected empty or malformed response structure from Gemini API.");
    }

    private WasteAnalysisResponse parseWasteAnalysisResponse(String jsonText) throws Exception {
        try {
            return objectMapper.readValue(jsonText, WasteAnalysisResponse.class);
        } catch (Exception e) {
            log.error("Failed to parse waste analysis JSON response: {}. Raw: {}", e.getMessage(), jsonText);
            // Fallback parsing or fallback object
            return WasteAnalysisResponse.builder()
                    .wasteCategory("Other")
                    .confidence(0.85)
                    .recyclable(false)
                    .disposalMethod("Place in general waste bin or consult local municipality guidelines.")
                    .environmentalImpact("Proper disposal prevents environmental contamination.")
                    .detailedExplanation(jsonText)
                    .safetyWarnings("")
                    .build();
        }
    }

    private ComplaintAnalysisResponse parseComplaintAnalysisResponse(String jsonText) throws Exception {
        try {
            return objectMapper.readValue(jsonText, ComplaintAnalysisResponse.class);
        } catch (Exception e) {
            log.error("Failed to parse complaint analysis JSON response: {}. Raw: {}", e.getMessage(), jsonText);
            return ComplaintAnalysisResponse.builder()
                    .severity("MEDIUM")
                    .aiAnalysis(jsonText)
                    .summary("Waste Management Complaint")
                    .build();
        }
    }

    private String getLanguageName(String code) {
        if (code == null) {
            return "English";
        }
        return switch (code.toLowerCase()) {
            case "hi" -> "Hindi";
            case "ta" -> "Tamil";
            case "ml" -> "Malayalam";
            default -> "English";
        };
    }
}

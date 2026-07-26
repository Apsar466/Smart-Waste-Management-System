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
import org.springframework.web.client.RestClientResponseException;

import java.util.*;

@Service
@Slf4j
public class GeminiServiceImpl implements GeminiService {

    private final RestClient restClient;
    private final ObjectMapper objectMapper;

    @Value("${app.gemini.api-key:}")
    private String apiKey;

    private static final String GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models/";
    // Ordered list of models to try — first available/quota-enabled wins
    // These models are confirmed accessible for this API key via ListModels
    private static final String[] GEMINI_MODELS = {
        "gemini-2.5-flash",          // primary: latest, multimodal capable
        "gemini-2.0-flash-lite",     // fallback 1: lighter, less throttled
        "gemini-2.0-flash",          // fallback 2
        "gemini-flash-latest"        // fallback 3: legacy alias
    };
    private static final int MAX_RETRIES = 3;
    private static final long RETRY_BACKOFF_MS = 3000L;

    public GeminiServiceImpl(ObjectMapper objectMapper) {
        this.restClient = RestClient.builder().build();
        this.objectMapper = objectMapper;
    }

    /**
     * Verify the Gemini API key is loaded on application startup.
     */
    @PostConstruct
    public void verifyApiKeyOnStartup() {
        if (apiKey == null || apiKey.trim().isEmpty()) {
            log.error("CRITICAL CONFIGURATION ERROR: Google Gemini API key is missing! " +
                      "Please configure the GEMINI_API_KEY environment variable or the " +
                      "'gemini.api.key' property in application.properties.");
        } else {
            log.info("Google Gemini API configuration: Key successfully validated and loaded.");
        }
    }

    @Override
    public WasteAnalysisResponse analyzeWaste(byte[] imageBytes, String contentType, String languageCode) {
        String languageName = getLanguageName(languageCode);
        log.info("Analyzing waste image using Gemini in language: {}", languageName);

        String prompt = "Analyze this waste image. Return a JSON object with the following fields:\n" +
                "- wasteType: The estimated specific item or material name (e.g., Plastic bottle, Banana peel)\n" +
                "- categoryName: The general waste category. Choose one of: Organic, Plastic, Paper, Metal, Glass, E-Waste, Hazardous, Other.\n" +
                "- recyclable: boolean (true or false)\n" +
                "- confidence: double between 0.0 and 1.0\n" +
                "- disposalInstructions: detailed step-by-step instructions on how to prepare and dispose of this item\n" +
                "- environmentalImpact: environmental impact of disposing of this item correctly vs incorrectly\n" +
                "- recyclingSuggestions: specific suggestions on how to reuse or recycle this item\n\n" +
                "Rules:\n" +
                "1. Translate all textual descriptions and names to the language: " + languageName + " (language code: " + languageCode + ").\n" +
                "2. Do not translate the JSON keys. Keep them EXACTLY as specified above.\n" +
                "3. The response must be a valid JSON object matching this schema. Do not include markdown code block formatting (like ```json).";

        try {
            String rawJson = callGeminiMultimodal(prompt, imageBytes, contentType, true);
            log.debug("Received raw response from Gemini: {}", rawJson);
            return objectMapper.readValue(rawJson, WasteAnalysisResponse.class);
        } catch (RestClientResponseException e) {
            String responseBody = e.getResponseBodyAsString();
            log.error("Gemini API call failed: Status={}, Body={}", e.getStatusCode(), responseBody, e);
            throw new GeminiException("Gemini API Error: " + responseBody, e);
        } catch (Exception e) {
            log.error("Failed to analyze waste image with Gemini API", e);
            throw new GeminiException("Failed to analyze waste image: " + e.getMessage(), e);
        }
    }

    @Override
    public ComplaintAnalysisResponse analyzeComplaint(byte[] imageBytes, String contentType, String languageCode) {
        String languageName = getLanguageName(languageCode);
        log.info("Analyzing complaint image using Gemini in language: {}", languageName);

        String prompt = "Analyze this image for illegal dumping or garbage presence. Return a JSON object with the following fields:\n" +
                "- garbagePresent: boolean (true or false)\n" +
                "- severity: one of LOW, MEDIUM, HIGH, CRITICAL\n" +
                "- estimatedWasteType: estimated type of waste visible (e.g., Construction debris, Household trash, Plastic waste)\n" +
                "- recommendedMunicipalAction: recommended action for the local municipality to resolve this issue\n\n" +
                "Rules:\n" +
                "1. Translate all textual descriptions and names to the language: " + languageName + " (language code: " + languageCode + ").\n" +
                "2. Do not translate the JSON keys. Keep them EXACTLY as specified above.\n" +
                "3. The response must be a valid JSON object matching this schema. Do not include markdown wrappers.";

        try {
            String rawJson = callGeminiMultimodal(prompt, imageBytes, contentType, true);
            log.debug("Received raw response from Gemini: {}", rawJson);
            return objectMapper.readValue(rawJson, ComplaintAnalysisResponse.class);
        } catch (RestClientResponseException e) {
            String responseBody = e.getResponseBodyAsString();
            log.error("Gemini API call failed: Status={}, Body={}", e.getStatusCode(), responseBody, e);
            throw new GeminiException("Gemini API Error: " + responseBody, e);
        } catch (Exception e) {
            log.error("Failed to analyze complaint image with Gemini API", e);
            throw new GeminiException("Failed to analyze complaint image: " + e.getMessage(), e);
        }
    }

    @Override
    public String getChatResponse(String question, String languageCode) {
        String languageName = getLanguageName(languageCode);
        log.info("Requesting chatbot response from Gemini in language: {}", languageName);

        String prompt = "You are an expert AI waste management chatbot assistant.\n" +
                "Answer the following question in the language: " + languageName + " (language code: " + languageCode + ").\n" +
                "Question: " + question + "\n\n" +
                "Rules:\n" +
                "1. If the question is NOT related to waste management, recycling, garbage disposal, composting, landfilling, or environmental sustainability, respond politely in the chosen language that you are a waste management assistant and can only answer questions related to waste management.\n" +
                "2. Keep the answer clear, helpful, and concise.";

        try {
            return callGeminiText(prompt);
        } catch (RestClientResponseException e) {
            String responseBody = e.getResponseBodyAsString();
            log.error("Gemini API call failed: Status={}, Body={}", e.getStatusCode(), responseBody, e);
            throw new GeminiException("Gemini API Error: " + responseBody, e);
        } catch (Exception e) {
            log.error("Failed to fetch chatbot response from Gemini API", e);
            throw new GeminiException("Failed to fetch chat response: " + e.getMessage(), e);
        }
    }

    private String callGeminiMultimodal(String prompt, byte[] imageBytes, String contentType, boolean requireJson) throws Exception {
        validateApiKey();
        String base64Image = Base64.getEncoder().encodeToString(imageBytes);

        // Build Payload
        Map<String, Object> textPart = Map.of("text", prompt);
        Map<String, Object> imagePart = Map.of(
                "inlineData", Map.of(
                        "mimeType", contentType,
                        "data", base64Image
                )
        );

        Map<String, Object> contentNode = Map.of("parts", List.of(textPart, imagePart));
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("contents", List.of(contentNode));

        if (requireJson) {
            requestBody.put("generationConfig", Map.of("responseMimeType", "application/json"));
        }

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
                    // Model not available for this API key – skip to next model immediately
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
            if (modelAvailable) {
                log.warn("All retries exhausted for model={}. Trying next model.", model);
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
            if (modelAvailable) {
                log.warn("All retries exhausted for model={}. Trying next model.", model);
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
                return parts.get(0).path("text").asText();
            }
        }
        throw new GeminiException("Unexpected empty or malformed response structure from Gemini API: " + responseStr);
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

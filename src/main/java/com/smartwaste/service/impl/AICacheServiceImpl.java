package com.smartwaste.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.smartwaste.dto.CacheStatisticsResponse;
import com.smartwaste.dto.WasteAnalysisResponse;
import com.smartwaste.entity.AIChatCache;
import com.smartwaste.entity.CacheMetrics;
import com.smartwaste.entity.WasteAnalysisCache;
import com.smartwaste.exception.CustomExceptions.GeminiException;
import com.smartwaste.repository.AIChatCacheRepository;
import com.smartwaste.repository.CacheMetricsRepository;
import com.smartwaste.repository.WasteAnalysisCacheRepository;
import com.smartwaste.service.AICacheService;
import com.smartwaste.service.GeminiService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AICacheServiceImpl implements AICacheService {

    private final WasteAnalysisCacheRepository wasteCacheRepository;
    private final AIChatCacheRepository chatCacheRepository;
    private final CacheMetricsRepository metricsRepository;
    private final GeminiService geminiService;
    private final ObjectMapper objectMapper;

    @Override
    @Transactional
    public WasteAnalysisResponse getOrAnalyzeWaste(byte[] imageBytes, String contentType, String languageCode) {
        String hash = generateSHA256(imageBytes);
        Optional<WasteAnalysisCache> cachedOpt = wasteCacheRepository.findByImageHash(hash);

        if (cachedOpt.isPresent()) {
            WasteAnalysisCache cached = cachedOpt.get();
            boolean isExpired = cached.getCreatedAt().isBefore(LocalDateTime.now().minusDays(30));

            if (!isExpired) {
                log.info("Cache Hit: Retrieved waste analysis from cache for hash {}", hash);
                metricsRepository.incrementCacheHits();
                
                try {
                    WasteAnalysisResponse response = objectMapper.readValue(cached.getRawAiResponse(), WasteAnalysisResponse.class);
                    response.setSource("CACHE");
                    return response;
                } catch (Exception e) {
                    log.error("Failed to parse cached waste analysis, treating as cache miss", e);
                }
            } else {
                log.info("Cache Refresh: Stored waste analysis has expired for hash {}", hash);
            }
        } else {
            log.info("Cache Miss: No waste analysis entry found for hash {}", hash);
        }

        // Live request to Gemini API
        long startTime = System.currentTimeMillis();
        WasteAnalysisResponse liveResponse = null;
        try {
            log.info("Gemini Request: Calling live Gemini API for waste analysis");
            liveResponse = geminiService.analyzeWaste(imageBytes, contentType, languageCode);
            long duration = System.currentTimeMillis() - startTime;
            log.info("Gemini Response Time: {} ms", duration);
            
            metricsRepository.incrementGeminiRequests();

            // Save or update cache
            String rawJson = objectMapper.writeValueAsString(liveResponse);
            WasteAnalysisCache cacheEntry = cachedOpt.orElse(new WasteAnalysisCache());
            cacheEntry.setImageHash(hash);
            cacheEntry.setWasteType(liveResponse.getWasteType());
            cacheEntry.setRecyclable(liveResponse.isRecyclable());
            cacheEntry.setConfidence(liveResponse.getConfidence());
            cacheEntry.setDisposalMethod(liveResponse.getDisposalInstructions());
            cacheEntry.setEnvironmentalImpact(liveResponse.getEnvironmentalImpact());
            cacheEntry.setRecyclingSuggestions(liveResponse.getRecyclingSuggestions());
            cacheEntry.setRawAiResponse(rawJson);
            cacheEntry.setCreatedAt(LocalDateTime.now());
            wasteCacheRepository.save(cacheEntry);

            liveResponse.setSource("GEMINI");
            return liveResponse;

        } catch (Exception e) {
            log.error("Gemini API is unavailable or failed", e);
            // Fallback: Check if there's any cached entry (even if expired)
            if (cachedOpt.isPresent()) {
                log.warn("Gemini is offline. Gracefully falling back to expired cached analysis.");
                try {
                    WasteAnalysisResponse response = objectMapper.readValue(cachedOpt.get().getRawAiResponse(), WasteAnalysisResponse.class);
                    response.setSource("CACHE");
                    return response;
                } catch (Exception ex) {
                    log.error("Failed to parse cached entry during fallback", ex);
                }
            }
            throw new GeminiException("AI Service is temporarily unavailable and no cached result exists.", e);
        }
    }

    @Override
    @Transactional
    public ChatResult getOrChat(String question, String languageCode) {
        String normalized = normalizeQuestion(question);
        Optional<AIChatCache> cachedOpt = chatCacheRepository.findByNormalizedQuestionAndLanguage(normalized, languageCode);

        if (cachedOpt.isPresent()) {
            AIChatCache cached = cachedOpt.get();
            boolean isExpired = cached.getCreatedAt().isBefore(LocalDateTime.now().minusDays(30));

            if (!isExpired) {
                log.info("Cache Hit: Retrieved chat response from cache");
                metricsRepository.incrementCacheHits();
                return new ChatResult(cached.getAiResponse(), "CACHE");
            } else {
                log.info("Cache Refresh: Stored chat response has expired");
            }
        } else {
            log.info("Cache Miss: No chat response entry found");
        }

        // Live request to Gemini
        long startTime = System.currentTimeMillis();
        try {
            log.info("Gemini Request: Calling live Gemini API for chatbot response");
            String liveAnswer = geminiService.getChatResponse(question, languageCode);
            long duration = System.currentTimeMillis() - startTime;
            log.info("Gemini Response Time: {} ms", duration);

            metricsRepository.incrementGeminiRequests();

            // Save or update cache
            AIChatCache cacheEntry = cachedOpt.orElse(new AIChatCache());
            cacheEntry.setNormalizedQuestion(normalized);
            cacheEntry.setLanguage(languageCode);
            cacheEntry.setAiResponse(liveAnswer);
            cacheEntry.setCreatedAt(LocalDateTime.now());
            chatCacheRepository.save(cacheEntry);

            return new ChatResult(liveAnswer, "GEMINI");

        } catch (Exception e) {
            log.error("Gemini API is unavailable or failed", e);
            // Fallback: Check if there's any cached entry (even if expired)
            if (cachedOpt.isPresent()) {
                log.warn("Gemini is offline. Gracefully falling back to expired cached chat reply.");
                return new ChatResult(cachedOpt.get().getAiResponse(), "CACHE");
            }
            throw new GeminiException("AI Service is temporarily unavailable and no cached response exists.", e);
        }
    }

    @Override
    public CacheStatisticsResponse getStatistics() {
        CacheMetrics metrics = metricsRepository.findById(1L)
                .orElseGet(() -> CacheMetrics.builder().id(1L).geminiRequests(0).cacheHits(0).build());

        long requests = metrics.getGeminiRequests();
        long hits = metrics.getCacheHits();
        long total = requests + hits;
        double rate = total == 0 ? 0.0 : ((double) hits / total) * 100.0;

        return CacheStatisticsResponse.builder()
                .totalGeminiRequests(requests)
                .totalCacheHits(hits)
                .cacheHitRate(rate)
                .requestsSaved(hits)
                .build();
    }

    private String generateSHA256(byte[] data) {
        try {
            java.security.MessageDigest digest = java.security.MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(data);
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (java.security.NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 algorithm not found", e);
        }
    }

    private String normalizeQuestion(String question) {
        if (question == null) return "";
        return question.toLowerCase()
                .trim()
                .replaceAll("\\s+", " ");
    }
}

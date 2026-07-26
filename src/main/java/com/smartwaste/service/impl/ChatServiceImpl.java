package com.smartwaste.service.impl;

import com.smartwaste.dto.ChatRequest;
import com.smartwaste.dto.ChatResponse;
import com.smartwaste.entity.AIChatHistory;
import com.smartwaste.entity.User;
import com.smartwaste.exception.CustomExceptions.ResourceNotFoundException;
import com.smartwaste.mapper.DtoMapper;
import com.smartwaste.repository.AIChatHistoryRepository;
import com.smartwaste.repository.UserRepository;
import com.smartwaste.service.AICacheService;
import com.smartwaste.service.ChatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChatServiceImpl implements ChatService {

    private final UserRepository userRepository;
    private final AIChatHistoryRepository chatHistoryRepository;
    private final AICacheService aiCacheService;

    @Override
    @Transactional
    public ChatResponse askChatbot(String email, ChatRequest request) {
        log.info("Chatbot query from user: {}, question: {}", email, request.getQuestion());

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));

        String lang = (request.getLanguage() == null || request.getLanguage().trim().isEmpty())
                ? "en" : request.getLanguage();

        // Get answer via cache layer (Cache-first, then live Gemini)
        AICacheService.ChatResult result = aiCacheService.getOrChat(request.getQuestion(), lang);

        // Store chat history (always persists the interaction)
        AIChatHistory history = AIChatHistory.builder()
                .user(user)
                .question(request.getQuestion())
                .answer(result.answer())
                .language(lang)
                .build();

        AIChatHistory savedHistory = chatHistoryRepository.save(history);

        // Build response with source badge
        ChatResponse response = DtoMapper.toChatResponse(savedHistory);
        response.setSource(result.source());
        return response;
    }

    @Override
    public List<ChatResponse> getUserChatHistory(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));

        return chatHistoryRepository.findByUserIdOrderByTimestampAsc(user.getId()).stream()
                .map(DtoMapper::toChatResponse)
                .collect(Collectors.toList());
    }
}

package com.smartwaste.service;

import com.smartwaste.dto.ChatRequest;
import com.smartwaste.dto.ChatResponse;

import java.util.List;

public interface ChatService {
    ChatResponse askChatbot(String email, ChatRequest request);
    List<ChatResponse> getUserChatHistory(String email);
}

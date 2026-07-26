package com.smartwaste.controller;

import com.smartwaste.dto.ApiResponse;
import com.smartwaste.dto.ChatRequest;
import com.smartwaste.dto.ChatResponse;
import com.smartwaste.service.ChatService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/ai")
@RequiredArgsConstructor
@Slf4j
public class ChatController {

    private final ChatService chatService;

    @PostMapping("/chat")
    public ResponseEntity<ApiResponse<ChatResponse>> chat(
            @Valid @RequestBody ChatRequest request,
            Principal principal
    ) {
        log.info("REST request to ask chatbot for user: {}", principal.getName());
        ChatResponse response = chatService.askChatbot(principal.getName(), request);
        return ResponseEntity.ok(ApiResponse.success("AI response generated successfully.", response, response.getLanguage()));
    }

    @GetMapping("/history")
    public ResponseEntity<ApiResponse<List<ChatResponse>>> getHistory(Principal principal) {
        log.info("REST request to get chatbot history for user: {}", principal.getName());
        List<ChatResponse> response = chatService.getUserChatHistory(principal.getName());
        return ResponseEntity.ok(ApiResponse.success("Chat history fetched successfully", response));
    }
}

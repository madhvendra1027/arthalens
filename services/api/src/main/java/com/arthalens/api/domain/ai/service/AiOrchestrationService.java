package com.arthalens.api.domain.ai.service;

import com.arthalens.api.domain.ai.dto.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import java.util.List;
import java.util.UUID;

@Service
public class AiOrchestrationService {

    private final RestClient restClient;

    public AiOrchestrationService(
            @Value("${arthalens.ai-service.base-url:http://localhost:8001}") String aiBaseUrl) {
        this.restClient = RestClient.builder().baseUrl(aiBaseUrl).build();
    }

    public AiQueryResponse query(AiQueryRequest request) {
        try {
            return restClient.post()
                    .uri("/ai/v1/query")
                    .body(request)
                    .retrieve()
                    .body(AiQueryResponse.class);
        } catch (Exception ex) {
            // Return graceful degradation response if AI service unavailable
            return new AiQueryResponse(
                    request.conversationId() != null ? request.conversationId() : UUID.randomUUID().toString(),
                    "The AI research assistant is temporarily unavailable. Please try again later.",
                    List.of(),
                    0.0,
                    "ArthaLens AI Assistant — responses are research aids only, not investment advice."
            );
        }
    }
}

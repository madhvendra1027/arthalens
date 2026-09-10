package com.arthalens.api.domain.ai.dto;

import jakarta.validation.constraints.*;

public record AiQueryRequest(
    @NotBlank @Size(max = 2000)
    String query,
    String conversationId,
    boolean stream
) {}

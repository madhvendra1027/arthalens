package com.arthalens.api.domain.ai.dto;

import java.util.List;

public record AiQueryResponse(
    String conversationId,
    String answer,
    List<CitationDto> citations,
    Double groundednessScore,
    String disclaimer
) {}

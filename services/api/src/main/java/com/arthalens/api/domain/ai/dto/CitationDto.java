package com.arthalens.api.domain.ai.dto;

import java.time.LocalDate;

public record CitationDto(
    String citationId,
    String sourceId,
    String title,
    String publisher,
    LocalDate publicationDate,
    String section,
    String page,
    String url,
    String excerpt
) {}

package com.arthalens.api.domain.sources.dto;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;

public record SourceDto(
    UUID id,
    String name,
    String authority,
    String canonicalUrl,
    String updateFrequency,
    OffsetDateTime lastSuccessfulRetrieval,
    LocalDate lastObservedPubDate
) {}

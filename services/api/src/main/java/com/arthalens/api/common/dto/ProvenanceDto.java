package com.arthalens.api.common.dto;

import java.time.LocalDate;
import java.time.OffsetDateTime;

public record ProvenanceDto(
    String sourceId,
    String sourceName,
    String sourceUrl,
    LocalDate publicationDate,
    OffsetDateTime retrievalTimestamp,
    String baseYear,
    String methodologyVersion,
    String observationStatus
) {}

package com.arthalens.api.domain.gdp.dto;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;

public record RevisionEntryDto(
    UUID id,
    String period,
    String baseYear,
    String releaseLabel,
    LocalDate revisionDate,
    Double fromValue,
    Double toValue,
    String fromStatus,
    String toStatus,
    Double absoluteChange,
    Double percentChange
) {}

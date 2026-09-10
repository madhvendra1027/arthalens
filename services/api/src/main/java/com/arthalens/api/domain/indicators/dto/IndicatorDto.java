package com.arthalens.api.domain.indicators.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record IndicatorDto(
    UUID id,
    String indexType,
    String seriesName,
    String baseYear,
    String periodLabel,
    BigDecimal indexValue,
    BigDecimal yoyChangePct,
    String status,
    LocalDate publicationDate
) {}

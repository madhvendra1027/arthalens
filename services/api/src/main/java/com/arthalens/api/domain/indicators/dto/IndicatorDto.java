package com.arthalens.api.domain.indicators.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
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
) {
    @JsonProperty("indicatorCode")
    public String indicatorCode() { return indexType; }

    @JsonProperty("indicatorName")
    public String indicatorName() { return seriesName; }

    @JsonProperty("latestValue")
    public BigDecimal latestValue() { return indexValue; }

    @JsonProperty("period")
    public String period() { return periodLabel; }

    @JsonProperty("unit")
    public String unit() { return "Index Point"; }
}


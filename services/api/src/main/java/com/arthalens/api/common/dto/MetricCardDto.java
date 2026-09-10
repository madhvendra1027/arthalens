package com.arthalens.api.common.dto;

import java.math.BigDecimal;

public record MetricCardDto(
    String label,
    BigDecimal value,
    String unit,
    String period,
    String status,
    ProvenanceDto provenance
) {}

package com.arthalens.api.domain.gdp.dto;

import com.arthalens.api.common.dto.ProvenanceDto;
import java.math.BigDecimal;
import java.util.UUID;

public record GdpObservationDto(
    UUID id,
    String period,
    String periodType,
    BigDecimal valueCrore,
    String unit,
    String priceType,
    BigDecimal growthRateYoy,
    String baseYear,
    String status,
    ProvenanceDto provenance
) {}

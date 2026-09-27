package com.arthalens.api.domain.gdp.dto;

import java.math.BigDecimal;
import java.util.UUID;

public record StateGvaDto(
    UUID id,
    String stateCode,
    String stateName,
    String period,
    BigDecimal gsdpCrore,
    BigDecimal gvaCrore,
    BigDecimal growthRateYoy,
    BigDecimal shareOfNationalGva,
    String status
) {}

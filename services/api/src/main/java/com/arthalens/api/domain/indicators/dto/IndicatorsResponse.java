package com.arthalens.api.domain.indicators.dto;

import java.util.List;

public record IndicatorsResponse(
    List<IndicatorDto> indicators,
    String indexType,
    int totalCount
) {}

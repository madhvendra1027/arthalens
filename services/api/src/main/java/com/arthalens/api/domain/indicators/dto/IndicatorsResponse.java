package com.arthalens.api.domain.indicators.dto;

import java.util.List;

public record IndicatorsResponse(
    List<IndicatorDto> data,
    List<IndicatorDto> indicators,
    String indexType,
    int totalCount
) {
    public IndicatorsResponse(List<IndicatorDto> indicators, String indexType, int totalCount) {
        this(indicators, indicators, indexType, totalCount);
    }
}


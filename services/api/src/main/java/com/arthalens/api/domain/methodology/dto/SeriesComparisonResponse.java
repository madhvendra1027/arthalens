package com.arthalens.api.domain.methodology.dto;

import java.util.List;

public record SeriesComparisonResponse(
    List<MethodologyVersionDto> series2011_12,
    List<MethodologyVersionDto> series2022_23,
    String note
) {}

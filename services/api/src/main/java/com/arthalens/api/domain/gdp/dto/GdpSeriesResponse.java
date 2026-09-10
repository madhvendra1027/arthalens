package com.arthalens.api.domain.gdp.dto;

import com.arthalens.api.common.dto.PaginationDto;
import java.util.List;

public record GdpSeriesResponse(
    String baseYear,
    String priceType,
    String periodType,
    String prominentWarning,
    List<GdpObservationDto> data,
    PaginationDto pagination
) {}

package com.arthalens.api.domain.gdp.dto;

import java.util.List;

public record SectorBreakdownResponse(
    String period,
    String baseYear,
    String priceType,
    List<SectorDataDto> sectors
) {}

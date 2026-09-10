package com.arthalens.api.domain.gdp.dto;

public record SectorDataDto(
    String sectorCode,
    String sectorName,
    Double value,
    String unit,
    Double shareOfGdp,
    Double growthRateYoy,
    String sourceId,
    String status
) {}

package com.arthalens.api.domain.gdp.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record SectorDataDto(
    String sectorCode,
    String sectorName,
    Double value,
    String unit,
    Double shareOfGdp,
    Double growthRateYoy,
    String sourceId,
    String status
) {
    @JsonProperty("growthRate")
    public Double growthRate() {
        return growthRateYoy;
    }
}


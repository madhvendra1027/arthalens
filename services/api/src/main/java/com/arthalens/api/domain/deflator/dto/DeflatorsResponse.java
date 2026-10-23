package com.arthalens.api.domain.deflator.dto;

import java.util.List;

public record DeflatorsResponse(
    List<DeflatorPointDto> data,
    List<DeflatorDto> deflators,
    String baseYear,
    String periodType,
    String note
) {
    public DeflatorsResponse(List<DeflatorDto> deflators, String baseYear, String note) {
        this(
            deflators != null ? deflators.stream().map(d -> new DeflatorPointDto(
                d.periodLabel(),
                d.deflatorValue(),
                null,
                null
            )).toList() : List.of(),
            deflators,
            baseYear,
            "Q",
            note
        );
    }
}


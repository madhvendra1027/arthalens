package com.arthalens.api.domain.deflator.dto;

import java.util.List;

public record DeflatorsResponse(
    List<DeflatorDto> deflators,
    String baseYear,
    String note
) {}

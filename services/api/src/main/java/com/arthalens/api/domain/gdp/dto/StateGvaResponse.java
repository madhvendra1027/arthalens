package com.arthalens.api.domain.gdp.dto;

import java.util.List;

public record StateGvaResponse(
    String period,
    String baseYear,
    String authority,
    List<StateGvaDto> states
) {}

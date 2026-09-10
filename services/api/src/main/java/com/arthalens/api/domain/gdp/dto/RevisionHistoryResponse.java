package com.arthalens.api.domain.gdp.dto;

import java.util.List;

public record RevisionHistoryResponse(
    String period,
    String baseYear,
    String prominentWarning,
    List<RevisionEntryDto> revisions
) {}

package com.arthalens.api.domain.dashboard.dto;

import com.arthalens.api.common.dto.MetricCardDto;
import java.time.OffsetDateTime;
import java.util.List;

public record DashboardResponse(
    OffsetDateTime asOf,
    String baseYear,
    MetricCardDto realGdpGrowth,
    MetricCardDto nominalGdpGrowth,
    MetricCardDto gdpAbsolute,
    MetricCardDto gvaGrowth,
    MetricCardDto gdpDeflator,
    MetricCardDto cpi,
    MetricCardDto wpi,
    List<MetricCardDto> topSectors
) {}

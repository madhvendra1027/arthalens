package com.arthalens.api.domain.methodology.dto;

import java.util.List;

public record BaseYearSeriesDto(
    String baseYear,
    String methodologyVersion,
    String baseYearDescription,
    String deflationMethod,
    List<String> primaryDataSources,
    String coveragePeriodFrom,
    String coveragePeriodTo,
    List<String> keyChanges
) {}

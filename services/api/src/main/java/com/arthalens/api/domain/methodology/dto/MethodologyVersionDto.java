package com.arthalens.api.domain.methodology.dto;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public record MethodologyVersionDto(
    UUID id,
    String baseYear,
    String versionLabel,
    String deflationMethod,
    List<String> primaryDataSources,
    String coverageFrom,
    String coverageTo,
    List<String> keyChanges,
    LocalDate releaseDate,
    String notes
) {}

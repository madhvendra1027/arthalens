package com.arthalens.api.domain.gdp.controller;

import com.arthalens.api.common.exception.ResourceNotFoundException;
import com.arthalens.api.domain.gdp.dto.*;
import com.arthalens.api.domain.gdp.service.GdpService;
import com.arthalens.api.domain.methodology.entity.BaseYear;
import com.arthalens.api.domain.methodology.repository.BaseYearRepository;
import io.swagger.v3.oas.annotations.*;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.*;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/gdp")
@Validated
@Tag(name = "gdp", description = "GDP time series, sectors, and revisions")
public class GdpController {

    private final GdpService service;
    private final BaseYearRepository baseYearRepository;

    public GdpController(GdpService service, BaseYearRepository baseYearRepository) {
        this.service = service;
        this.baseYearRepository = baseYearRepository;
    }

    @GetMapping("/latest")
    @Operation(summary = "Latest GDP observation")
    public GdpObservationDto getLatest(
            @RequestParam(defaultValue = "2022-23") String baseYear,
            @RequestParam(defaultValue = "constant") String priceType) {
        UUID baseYearId = resolveBaseYearId(baseYear);
        return service.getLatest(baseYearId, priceType);
    }

    @GetMapping("/series")
    @Operation(summary = "GDP time series")
    public GdpSeriesResponse getSeries(
            @RequestParam(defaultValue = "2022-23") String baseYear,
            @RequestParam(defaultValue = "constant") String priceType,
            @RequestParam(required = false) String periodType,
            @RequestParam(defaultValue = "false") boolean allowMixedSeries,
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "50") @Min(1) @Max(200) int size) {
        UUID baseYearId = resolveBaseYearId(baseYear);
        return service.getSeries(baseYearId, priceType, periodType, allowMixedSeries, page, size);
    }

    private UUID resolveBaseYearId(String baseYear) {
        String effective = (baseYear != null && !baseYear.isBlank()) ? baseYear : "2022-23";
        return baseYearRepository.findByYearLabel(effective)
                .map(BaseYear::getId)
                .orElseThrow(() -> new ResourceNotFoundException("BaseYear", "yearLabel", effective));
    }
}

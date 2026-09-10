package com.arthalens.api.domain.gdp.controller;

import com.arthalens.api.domain.gdp.dto.*;
import com.arthalens.api.domain.gdp.service.GdpService;
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

    public GdpController(GdpService service) {
        this.service = service;
    }

    @GetMapping("/latest")
    @Operation(summary = "Latest GDP observation")
    public GdpObservationDto getLatest(
            @RequestParam(defaultValue = "2022-23") String baseYear,
            @RequestParam(defaultValue = "constant") String priceType) {
        // In production: resolve baseYear string to UUID from methodology service
        // Using placeholder UUID here — replaced once DB is seeded
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
        return switch (baseYear) {
            case "2022-23" -> UUID.fromString("00000000-0000-0000-0000-000000000002");
            case "2011-12" -> UUID.fromString("00000000-0000-0000-0000-000000000001");
            default -> throw new IllegalArgumentException("Invalid base year: " + baseYear + ". Must be 2011-12 or 2022-23.");
        };
    }
}

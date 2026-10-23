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
            @RequestParam(value = "base_year", required = false) String baseYearSnake,
            @RequestParam(value = "baseYear", required = false) String baseYearCamel,
            @RequestParam(value = "price_type", required = false) String priceTypeSnake,
            @RequestParam(value = "priceType", required = false) String priceTypeCamel) {
        String baseYear = firstNonBlank(baseYearSnake, baseYearCamel, "2022-23");
        String priceType = firstNonBlank(priceTypeSnake, priceTypeCamel, "constant");
        validateBaseYear(baseYear);
        UUID baseYearId = resolveBaseYearId(baseYear);
        return service.getLatest(baseYearId, priceType);
    }

    @GetMapping("/series")
    @Operation(summary = "GDP time series")
    public GdpSeriesResponse getSeries(
            @RequestParam(value = "base_year", required = false) String baseYearSnake,
            @RequestParam(value = "baseYear", required = false) String baseYearCamel,
            @RequestParam(value = "price_type", required = false) String priceTypeSnake,
            @RequestParam(value = "priceType", required = false) String priceTypeCamel,
            @RequestParam(value = "period_type", required = false) String periodTypeSnake,
            @RequestParam(value = "periodType", required = false) String periodTypeCamel,
            @RequestParam(value = "allow_mixed_series", required = false) Boolean allowMixedSnake,
            @RequestParam(value = "allowMixedSeries", defaultValue = "false") boolean allowMixedCamel,
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "50") @Min(1) @Max(200) int size) {
        String baseYear = firstNonBlank(baseYearSnake, baseYearCamel, "2022-23");
        String priceType = firstNonBlank(priceTypeSnake, priceTypeCamel, "constant");
        String periodType = firstNonBlank(periodTypeSnake, periodTypeCamel, null);
        boolean allowMixed = allowMixedSnake != null ? allowMixedSnake : allowMixedCamel;
        validateBaseYear(baseYear);
        UUID baseYearId = resolveBaseYearId(baseYear);
        return service.getSeries(baseYearId, priceType, periodType, allowMixed, page, size);
    }

    private void validateBaseYear(String baseYear) {
        if (!java.util.List.of("2011-12", "2022-23").contains(baseYear)) {
            throw new IllegalArgumentException("Invalid base year: " + baseYear + ". Permitted values are: 2011-12, 2022-23");
        }
    }

    private String firstNonBlank(String first, String second, String defaultValue) {
        if (first != null && !first.isBlank()) return first;
        if (second != null && !second.isBlank()) return second;
        return defaultValue;
    }

    private UUID resolveBaseYearId(String baseYear) {
        String effective = (baseYear != null && !baseYear.isBlank()) ? baseYear : "2022-23";
        return baseYearRepository.findByYearLabel(effective)
                .map(BaseYear::getId)
                .orElseThrow(() -> new ResourceNotFoundException("BaseYear", "yearLabel", effective));
    }
}


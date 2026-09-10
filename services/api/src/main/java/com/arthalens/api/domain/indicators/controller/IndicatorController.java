package com.arthalens.api.domain.indicators.controller;

import com.arthalens.api.domain.indicators.dto.IndicatorsResponse;
import com.arthalens.api.domain.indicators.service.IndicatorService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.Pattern;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/indicators")
@Tag(name = "Indicators", description = "Price indices: CPI, WPI, IIP")
@Validated
public class IndicatorController {

    private final IndicatorService indicatorService;

    public IndicatorController(IndicatorService indicatorService) {
        this.indicatorService = indicatorService;
    }

    @GetMapping
    @Operation(summary = "Get price index observations, optionally filtered by type")
    public ResponseEntity<IndicatorsResponse> getIndicators(
        @Pattern(regexp = "cpi|wpi|iip|pce", message = "type must be one of: cpi, wpi, iip, pce")
        @RequestParam(required = false) String type) {
        return ResponseEntity.ok(indicatorService.getIndicators(type));
    }
}

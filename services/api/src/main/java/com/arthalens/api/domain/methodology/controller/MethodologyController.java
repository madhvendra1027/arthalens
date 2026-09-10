package com.arthalens.api.domain.methodology.controller;

import com.arthalens.api.domain.methodology.dto.SeriesComparisonResponse;
import com.arthalens.api.domain.methodology.service.MethodologyService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/methodology")
@Tag(name = "Methodology", description = "Series methodology and base year comparison")
public class MethodologyController {

    private final MethodologyService methodologyService;

    public MethodologyController(MethodologyService methodologyService) {
        this.methodologyService = methodologyService;
    }

    @GetMapping("/series-comparison")
    @Operation(summary = "Compare 2011-12 and 2022-23 NAS series methodology")
    public ResponseEntity<SeriesComparisonResponse> getSeriesComparison() {
        return ResponseEntity.ok(methodologyService.getSeriesComparison());
    }
}

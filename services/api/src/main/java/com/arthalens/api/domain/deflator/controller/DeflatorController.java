package com.arthalens.api.domain.deflator.controller;

import com.arthalens.api.domain.deflator.dto.DeflatorsResponse;
import com.arthalens.api.domain.deflator.service.DeflatorService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/deflators")
@Tag(name = "Deflators", description = "GDP and price deflator series")
public class DeflatorController {

    private final DeflatorService deflatorService;

    public DeflatorController(DeflatorService deflatorService) {
        this.deflatorService = deflatorService;
    }

    @GetMapping
    @Operation(summary = "Get deflator observations for a base year")
    public ResponseEntity<DeflatorsResponse> getDeflators(
        @RequestParam(value = "base_year", required = false) String baseYearSnake,
        @RequestParam(value = "baseYear", required = false) String baseYearCamel,
        @RequestParam(required = false) String type) {
        String baseYear = (baseYearSnake != null && !baseYearSnake.isBlank())
            ? baseYearSnake
            : ((baseYearCamel != null && !baseYearCamel.isBlank()) ? baseYearCamel : "2022-23");
        return ResponseEntity.ok(deflatorService.getDeflators(baseYear, type));
    }
}

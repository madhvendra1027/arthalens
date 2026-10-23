package com.arthalens.api.domain.dashboard.controller;

import com.arthalens.api.domain.dashboard.dto.DashboardResponse;
import com.arthalens.api.domain.dashboard.service.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/dashboard")
@Tag(name = "dashboard", description = "Economic snapshot dashboard")
public class DashboardController {

    private final DashboardService service;

    public DashboardController(DashboardService service) {
        this.service = service;
    }

    @GetMapping("/india")
    @Operation(summary = "India economic snapshot")
    public DashboardResponse getIndiaDashboard(
            @RequestParam(value = "base_year", required = false) String baseYearSnake,
            @RequestParam(value = "baseYear", required = false) String baseYearCamel) {
        String baseYear = (baseYearSnake != null && !baseYearSnake.isBlank())
                ? baseYearSnake
                : ((baseYearCamel != null && !baseYearCamel.isBlank()) ? baseYearCamel : "2022-23");
        return service.getSnapshot(baseYear);
    }
}

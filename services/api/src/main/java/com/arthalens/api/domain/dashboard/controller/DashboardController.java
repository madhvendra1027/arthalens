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
            @RequestParam(defaultValue = "2022-23") String baseYear) {
        return service.getSnapshot(baseYear);
    }
}

package com.arthalens.api.domain.gdp.controller;

import com.arthalens.api.domain.gdp.dto.StateGvaResponse;
import com.arthalens.api.domain.gdp.service.StateGvaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@Tag(name = "state-gva", description = "State-level Gross State Value Added and GSDP (MoSPI & State DES)")
public class StateGvaController {

    private final StateGvaService stateGvaService;

    public StateGvaController(StateGvaService stateGvaService) {
        this.stateGvaService = stateGvaService;
    }

    @GetMapping({"/gdp/states", "/gva/states"})
    @Operation(
        summary = "Get State-level GSDP and GVA breakdown",
        description = "Returns official Gross State Domestic Product and Value Added by Indian states and union territories."
    )
    public ResponseEntity<StateGvaResponse> getStates(
            @RequestParam(value = "base_year", defaultValue = "2022-23") String baseYear,
            @RequestParam(value = "period", required = false) String period) {

        if (!List.of("2011-12", "2022-23").contains(baseYear)) {
            return ResponseEntity.badRequest().build();
        }

        return ResponseEntity.ok(stateGvaService.getStates(baseYear, period));
    }
}

package com.arthalens.api.domain.gdp.controller;

import com.arthalens.api.domain.gdp.dto.SectorBreakdownResponse;
import com.arthalens.api.domain.gdp.dto.SectorDataDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * GDP Sector Breakdown endpoint.
 * Returns GVA by sector (Agriculture, Industry, Services etc.) for a given period.
 * Sector shares are derived from official MoSPI NAS sector tables.
 */
@RestController
@RequestMapping("/api/v1/gdp/sectors")
@Tag(name = "gdp-sectors", description = "GDP/GVA breakdown by sector (MoSPI NAS)")
public class GdpSectorController {

    @GetMapping
    @Operation(
        summary = "Get GDP/GVA sector breakdown",
        description = """
            Returns GVA decomposition by sector for a given period and base-year series.
            Sector shares are computed from official MoSPI data and are labelled as derived.
            Growth rates are within-series comparisons only.
            """
    )
    public ResponseEntity<SectorBreakdownResponse> getSectors(
            @RequestParam(value = "base_year", defaultValue = "2022-23") String baseYear,
            @RequestParam(value = "price_type", defaultValue = "constant") String priceType,
            @RequestParam(value = "period", required = false) String period) {

        if (!List.of("2011-12", "2022-23").contains(baseYear)) {
            return ResponseEntity.badRequest().build();
        }
        if (!List.of("constant", "current").contains(priceType)) {
            return ResponseEntity.badRequest().build();
        }

        return ResponseEntity.ok(new SectorBreakdownResponse(
                period != null ? period : "latest",
                baseYear,
                priceType,
                List.of()  // Populated after ingestion
        ));
    }
}

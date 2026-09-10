package com.arthalens.api.domain.gdp.controller;

import com.arthalens.api.domain.gdp.dto.RevisionHistoryResponse;
import com.arthalens.api.domain.gdp.dto.RevisionEntryDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * GDP Revision Tracker endpoint.
 * Returns a provenance-ordered history of estimate changes from Advance → First Revised → Final.
 * Query is restricted to a single base-year series. Cross-series revision comparison is disallowed.
 */
@RestController
@RequestMapping("/api/v1/gdp/revisions")
@Tag(name = "gdp-revisions", description = "GDP revision history across MoSPI releases")
public class GdpRevisionController {

    @GetMapping
    @Operation(
        summary = "Get GDP revision history",
        description = """
            Returns the revision trajectory for GDP observations within a single base-year series.
            Cross-series revisions (e.g., 2011-12 to 2022-23 rebasing) are NOT included here
            as they represent methodology changes, not corrections.
            All values are official MoSPI estimates at the time of each release.
            """
    )
    public ResponseEntity<RevisionHistoryResponse> getRevisions(
            @RequestParam(value = "base_year", defaultValue = "2022-23") String baseYear,
            @RequestParam(value = "period", required = false) String period) {

        // Validate base year to enforce series isolation
        if (!List.of("2011-12", "2022-23").contains(baseYear)) {
            return ResponseEntity.badRequest().build();
        }

        // When DB is connected, query gdp_revisions table joined to observations.
        // Currently returns empty list with warning — data populates after ingestion.
        return ResponseEntity.ok(new RevisionHistoryResponse(
                period != null ? period : "all",
                baseYear,
                "Revision history populates after ingestion pipeline runs. " +
                "Comparing values across base-year series is a methodology change, not a revision.",
                List.of()
        ));
    }
}

package com.arthalens.api.domain.ratings.controller;

import com.arthalens.api.domain.ratings.dto.RatingsResponse;
import com.arthalens.api.domain.ratings.service.RatingsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/ratings")
@Tag(name = "Ratings", description = "India sovereign credit ratings (Moodys, S&P, Fitch)")
public class RatingsController {

    private final RatingsService ratingsService;

    public RatingsController(RatingsService ratingsService) {
        this.ratingsService = ratingsService;
    }

    @GetMapping
    @Operation(summary = "Get sovereign ratings, optionally filtered by agency")
    public ResponseEntity<RatingsResponse> getRatings(
        @Parameter(description = "Agency: moodys, sp, or fitch")
        @RequestParam(required = false) String agency) {
        return ResponseEntity.ok(ratingsService.getRatings(agency));
    }
}

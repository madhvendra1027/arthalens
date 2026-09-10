package com.arthalens.api.domain.ai.controller;

import com.arthalens.api.domain.ai.dto.*;
import com.arthalens.api.domain.ai.service.AiOrchestrationService;
import io.swagger.v3.oas.annotations.*;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/ai")
@Tag(name = "ai", description = "AI research assistant — citation-first economic queries")
public class AiController {

    private final AiOrchestrationService service;

    public AiController(AiOrchestrationService service) {
        this.service = service;
    }

    @PostMapping("/query")
    @Operation(summary = "Submit an economic research query to the AI assistant")
    public AiQueryResponse query(@RequestBody @Valid AiQueryRequest request) {
        return service.query(request);
    }
}

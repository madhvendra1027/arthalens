package com.arthalens.api.domain.sources.controller;

import com.arthalens.api.domain.sources.dto.SourceDto;
import com.arthalens.api.domain.sources.service.SourceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/sources")
@Tag(name = "sources", description = "Source document metadata and provenance")
public class SourceController {

    private final SourceService service;

    public SourceController(SourceService service) {
        this.service = service;
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get source metadata by ID")
    public SourceDto getSource(@PathVariable UUID id) {
        return service.getById(id);
    }
}

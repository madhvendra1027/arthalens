package com.arthalens.api.domain;

import org.springframework.boot.actuate.health.HealthComponent;
import org.springframework.boot.actuate.health.HealthEndpoint;
import org.springframework.web.bind.annotation.*;
import java.time.OffsetDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/health")
public class HealthController {

    private final HealthEndpoint healthEndpoint;

    public HealthController(HealthEndpoint healthEndpoint) {
        this.healthEndpoint = healthEndpoint;
    }

    @GetMapping
    public Map<String, Object> health() {
        HealthComponent health = healthEndpoint.health();
        return Map.of(
                "status", health.getStatus().getCode(),
                "timestamp", OffsetDateTime.now().toString(),
                "services", Map.of("database", health.getStatus().getCode())
        );
    }
}

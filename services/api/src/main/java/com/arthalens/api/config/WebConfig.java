package com.arthalens.api.config;

import io.swagger.v3.oas.models.*;
import io.swagger.v3.oas.models.info.*;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.*;
import org.springframework.web.servlet.config.annotation.*;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${arthalens.cors.allowed-origins:http://localhost:3000}")
    private String allowedOrigins;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins(allowedOrigins.split(","))
                .allowedMethods("GET", "POST", "OPTIONS")
                .allowedHeaders("*")
                .maxAge(3600);
    }

    @Bean
    public OpenAPI arthaLensOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("ArthaLens API")
                        .version("1.0.0")
                        .description("""
                                ArthaLens REST API — India macroeconomic intelligence platform.
                                
                                Official statistics reproduced with provenance. Derived analytics,
                                ML forecasts, and AI interpretations are clearly distinguished
                                from official government estimates.
                                """)
                        .contact(new Contact().name("ArthaLens")))
                .addServersItem(new Server().url("/").description("Current server"));
    }
}

package com.arthalens.api.domain.dashboard.service;

import com.arthalens.api.common.dto.MetricCardDto;
import com.arthalens.api.domain.dashboard.dto.DashboardResponse;
import org.springframework.stereotype.Service;
import java.time.OffsetDateTime;
import java.util.List;

@Service
public class DashboardService {

    public DashboardResponse getSnapshot(String baseYear) {
        // Returns structured response with null values where data not yet ingested.
        // All values MUST come from database; never hardcoded.
        return new DashboardResponse(
                OffsetDateTime.now(),
                baseYear,
                unavailableCard("Real GDP Growth", "%", "Latest Quarter"),
                unavailableCard("Nominal GDP Growth", "%", "Latest Quarter"),
                unavailableCard("GDP (Absolute)", "INR Crore", "Latest FY"),
                unavailableCard("GVA Growth", "%", "Latest Quarter"),
                unavailableCard("GDP Deflator", "Index", "Latest FY"),
                unavailableCard("CPI Inflation", "%", "Latest Month"),
                unavailableCard("WPI Inflation", "%", "Latest Month"),
                List.of()
        );
    }

    private MetricCardDto unavailableCard(String label, String unit, String period) {
        return new MetricCardDto(label, null, unit, period, "unavailable", null);
    }
}

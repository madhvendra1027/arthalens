package com.arthalens.api.domain.methodology.service;

import com.arthalens.api.domain.methodology.dto.MethodologyVersionDto;
import com.arthalens.api.domain.methodology.dto.SeriesComparisonResponse;
import com.arthalens.api.domain.methodology.entity.MethodologyVersion;
import com.arthalens.api.domain.methodology.repository.MethodologyVersionRepository;
import com.arthalens.api.domain.methodology.repository.BaseYearRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MethodologyService {

    private final MethodologyVersionRepository methodologyVersionRepository;
    private final BaseYearRepository baseYearRepository;

    public MethodologyService(MethodologyVersionRepository methodologyVersionRepository,
                               BaseYearRepository baseYearRepository) {
        this.methodologyVersionRepository = methodologyVersionRepository;
        this.baseYearRepository = baseYearRepository;
    }

    public SeriesComparisonResponse getSeriesComparison() {
        var all = methodologyVersionRepository.findAll();
        var baseYears = baseYearRepository.findAll();

        // Resolve base year labels by ID
        var byYearLabel = baseYears.stream()
            .collect(java.util.stream.Collectors.toMap(
                by -> by.getId(), by -> by.getYearLabel()));

        var all2011 = all.stream()
            .filter(m -> "2011-12".equals(byYearLabel.get(m.getBaseYearId())))
            .map(m -> toDto(m, byYearLabel.getOrDefault(m.getBaseYearId(), "unknown")))
            .toList();

        var all2022 = all.stream()
            .filter(m -> "2022-23".equals(byYearLabel.get(m.getBaseYearId())))
            .map(m -> toDto(m, byYearLabel.getOrDefault(m.getBaseYearId(), "unknown")))
            .toList();

        return new SeriesComparisonResponse(
            all2011, all2022,
            "Base year 2022-23 is the current official series (released 2024). " +
            "The 2011-12 series is retained for historical comparison. " +
            "Do not silently mix values from different base years."
        );
    }

    private MethodologyVersionDto toDto(MethodologyVersion m, String baseYear) {
        return new MethodologyVersionDto(
            m.getId(), baseYear, m.getVersionLabel(), m.getDeflationMethod(),
            m.getPrimaryDataSources(), m.getCoverageFrom(), m.getCoverageTo(),
            m.getKeyChanges(), m.getReleaseDate(), m.getNotes()
        );
    }
}

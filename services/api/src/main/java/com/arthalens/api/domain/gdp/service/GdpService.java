package com.arthalens.api.domain.gdp.service;

import com.arthalens.api.common.dto.*;
import com.arthalens.api.common.exception.ResourceNotFoundException;
import com.arthalens.api.domain.gdp.dto.*;
import com.arthalens.api.domain.gdp.entity.GdpObservation;
import com.arthalens.api.domain.gdp.repository.GdpObservationRepository;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;

@Service
public class GdpService {

    private final GdpObservationRepository repo;

    public GdpService(GdpObservationRepository repo) {
        this.repo = repo;
    }

    public GdpObservationDto getLatest(UUID baseYearId, String priceType) {
        return repo.findLatest(baseYearId, priceType)
                .map(this::toDto)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No GDP observation found for base year " + baseYearId + " / " + priceType));
    }

    public GdpSeriesResponse getSeries(
            UUID baseYearId, String priceType, String periodType,
            boolean allowMixed, int page, int size) {

        String warning = allowMixed
                ? "WARNING: mixed base-year series requested. Values from different methodologies " +
                  "may not be directly comparable. Use with caution."
                : null;

        var pageable = PageRequest.of(page, size);
        var obsPage = repo.findSeries(baseYearId, priceType, periodType, pageable);
        List<GdpObservationDto> data = obsPage.getContent().stream().map(this::toDto).toList();

        return new GdpSeriesResponse(
                baseYearId.toString(), priceType, periodType, warning, data,
                new PaginationDto(page, size, obsPage.getTotalElements(), obsPage.getTotalPages()));
    }

    private GdpObservationDto toDto(GdpObservation o) {
        return new GdpObservationDto(
                o.getId(), o.getPeriodLabel(), o.getPeriodType(),
                o.getValueCrore(), "INR Crore", o.getPriceType(),
                o.getGrowthRateYoy(), o.getBaseYearId().toString(),
                o.getStatus().name(),
                new ProvenanceDto(o.getSourceId().toString(), null, null,
                        o.getPublicationDate(), o.getRetrievalTimestamp(),
                        o.getBaseYearId().toString(), o.getMethodologyVersionId().toString(),
                        o.getStatus().name()));
    }
}

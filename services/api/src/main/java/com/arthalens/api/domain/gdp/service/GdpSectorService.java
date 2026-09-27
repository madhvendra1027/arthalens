package com.arthalens.api.domain.gdp.service;

import com.arthalens.api.common.exception.ResourceNotFoundException;
import com.arthalens.api.domain.gdp.dto.SectorBreakdownResponse;
import com.arthalens.api.domain.gdp.dto.SectorDataDto;
import com.arthalens.api.domain.gdp.entity.SectorObservation;
import com.arthalens.api.domain.gdp.repository.SectorObservationRepository;
import com.arthalens.api.domain.methodology.entity.BaseYear;
import com.arthalens.api.domain.methodology.repository.BaseYearRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GdpSectorService {

    private final SectorObservationRepository sectorRepo;
    private final BaseYearRepository baseYearRepo;

    public GdpSectorService(SectorObservationRepository sectorRepo, BaseYearRepository baseYearRepo) {
        this.sectorRepo = sectorRepo;
        this.baseYearRepo = baseYearRepo;
    }

    public SectorBreakdownResponse getSectors(String baseYearLabel, String priceType, String period) {
        String effectiveBaseYear = (baseYearLabel != null && !baseYearLabel.isBlank()) ? baseYearLabel : "2022-23";
        String effectivePriceType = (priceType != null && !priceType.isBlank()) ? priceType : "constant";

        BaseYear by = baseYearRepo.findByYearLabel(effectiveBaseYear)
                .orElseThrow(() -> new ResourceNotFoundException("BaseYear", "yearLabel", effectiveBaseYear));

        List<SectorObservation> obsList;
        if (period != null && !period.isBlank()) {
            obsList = sectorRepo.findByBaseYearIdAndPriceTypeAndPeriodLabelOrderByShareOfGvaDesc(
                    by.getId(), effectivePriceType, period);
        } else {
            obsList = sectorRepo.findLatestSectors(by.getId(), effectivePriceType);
        }

        String resultPeriod = obsList.isEmpty() ? (period != null ? period : "FY 2023-24") : obsList.get(0).getPeriodLabel();

        List<SectorDataDto> dtos = obsList.stream().map(s -> new SectorDataDto(
                s.getSectorCode(),
                s.getSectorName(),
                s.getValueCrore() != null ? s.getValueCrore().doubleValue() : null,
                "INR Crore",
                s.getShareOfGva() != null ? s.getShareOfGva().doubleValue() : null,
                s.getGrowthRateYoy() != null ? s.getGrowthRateYoy().doubleValue() : null,
                s.getSourceId() != null ? s.getSourceId().toString() : "mospi-nas",
                s.getStatus() != null ? s.getStatus().name() : "official"
        )).toList();

        return new SectorBreakdownResponse(resultPeriod, effectiveBaseYear, effectivePriceType, dtos);
    }
}

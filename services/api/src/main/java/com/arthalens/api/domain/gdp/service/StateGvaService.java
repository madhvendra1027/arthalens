package com.arthalens.api.domain.gdp.service;

import com.arthalens.api.common.exception.ResourceNotFoundException;
import com.arthalens.api.domain.gdp.dto.StateGvaDto;
import com.arthalens.api.domain.gdp.dto.StateGvaResponse;
import com.arthalens.api.domain.gdp.entity.StateGvaObservation;
import com.arthalens.api.domain.gdp.repository.StateGvaObservationRepository;
import com.arthalens.api.domain.methodology.entity.BaseYear;
import com.arthalens.api.domain.methodology.repository.BaseYearRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StateGvaService {

    private final StateGvaObservationRepository repository;
    private final BaseYearRepository baseYearRepo;

    public StateGvaService(StateGvaObservationRepository repository, BaseYearRepository baseYearRepo) {
        this.repository = repository;
        this.baseYearRepo = baseYearRepo;
    }

    public StateGvaResponse getStates(String baseYearLabel, String period) {
        String effectiveBaseYear = (baseYearLabel != null && !baseYearLabel.isBlank()) ? baseYearLabel : "2022-23";
        BaseYear by = baseYearRepo.findByYearLabel(effectiveBaseYear)
                .orElseThrow(() -> new ResourceNotFoundException("BaseYear", "yearLabel", effectiveBaseYear));

        List<StateGvaObservation> list = (period != null && !period.isBlank())
                ? repository.findByPeriodLabelOrderByGsdpCroreDesc(period)
                : repository.findLatestStateGva();

        String effectivePeriod = list.isEmpty() ? (period != null ? period : "FY 2023-24") : list.get(0).getPeriodLabel();

        List<StateGvaDto> dtos = list.stream().map(s -> new StateGvaDto(
                s.getId(),
                s.getStateCode(),
                s.getStateName(),
                s.getPeriodLabel(),
                s.getGsdpCrore(),
                s.getGvaCrore(),
                s.getGrowthRateYoy(),
                s.getShareOfNationalGva(),
                s.getStatus() != null ? s.getStatus().name() : "official"
        )).toList();

        return new StateGvaResponse(
                effectivePeriod,
                effectiveBaseYear,
                "Ministry of Statistics & Programme Implementation (National Accounts Division) in coordination with State Directorates of Economics & Statistics (DES)",
                dtos
        );
    }
}

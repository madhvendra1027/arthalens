package com.arthalens.api.domain.gdp.service;

import com.arthalens.api.common.exception.ResourceNotFoundException;
import com.arthalens.api.domain.gdp.dto.RevisionEntryDto;
import com.arthalens.api.domain.gdp.dto.RevisionHistoryResponse;
import com.arthalens.api.domain.gdp.entity.Revision;
import com.arthalens.api.domain.gdp.repository.RevisionRepository;
import com.arthalens.api.domain.methodology.entity.BaseYear;
import com.arthalens.api.domain.methodology.repository.BaseYearRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GdpRevisionService {

    private final RevisionRepository revisionRepo;
    private final BaseYearRepository baseYearRepo;

    public GdpRevisionService(RevisionRepository revisionRepo, BaseYearRepository baseYearRepo) {
        this.revisionRepo = revisionRepo;
        this.baseYearRepo = baseYearRepo;
    }

    public RevisionHistoryResponse getRevisions(String baseYearLabel, String period) {
        String effectiveBaseYear = (baseYearLabel != null && !baseYearLabel.isBlank()) ? baseYearLabel : "2022-23";
        BaseYear by = baseYearRepo.findByYearLabel(effectiveBaseYear)
                .orElseThrow(() -> new ResourceNotFoundException("BaseYear", "yearLabel", effectiveBaseYear));

        List<Revision> revs = revisionRepo.findByEntityTypeOrderByRevisionDateAscRevisionSequenceAsc("gdp_observation");

        String effectivePeriod = period != null ? period : "FY 2022-23";

        List<RevisionEntryDto> dtos = revs.stream().map(r -> {
            Double from = r.getFromValue() != null ? r.getFromValue().doubleValue() : null;
            Double to = r.getToValue() != null ? r.getToValue().doubleValue() : null;
            Double absChange = (from != null && to != null) ? Math.round((to - from) * 100.0) / 100.0 : null;
            Double pctChange = (from != null && to != null && from != 0.0)
                    ? Math.round(((to - from) / from * 100.0) * 100.0) / 100.0 : null;

            return new RevisionEntryDto(
                    r.getId(),
                    effectivePeriod,
                    effectiveBaseYear,
                    r.getReleaseLabel() != null ? r.getReleaseLabel() : "Official Release",
                    r.getRevisionDate(),
                    from,
                    to,
                    r.getFromStatus() != null ? r.getFromStatus().name() : "none",
                    r.getToStatus() != null ? r.getToStatus().name() : "official",
                    absChange,
                    pctChange
            );
        }).toList();

        return new RevisionHistoryResponse(
                effectivePeriod,
                effectiveBaseYear,
                "Comparing values across base-year series is a methodology change, not a revision. " +
                "All revision trajectories represent within-series adjustments published in official MoSPI press notes.",
                dtos
        );
    }
}

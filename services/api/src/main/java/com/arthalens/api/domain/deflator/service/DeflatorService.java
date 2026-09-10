package com.arthalens.api.domain.deflator.service;

import com.arthalens.api.domain.deflator.dto.DeflatorDto;
import com.arthalens.api.domain.deflator.dto.DeflatorsResponse;
import com.arthalens.api.domain.deflator.entity.DeflatorObservation;
import com.arthalens.api.domain.deflator.repository.DeflatorRepository;
import com.arthalens.api.domain.methodology.entity.BaseYear;
import com.arthalens.api.domain.methodology.repository.BaseYearRepository;
import com.arthalens.api.common.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DeflatorService {

    private final DeflatorRepository deflatorRepository;
    private final BaseYearRepository baseYearRepository;

    public DeflatorService(DeflatorRepository deflatorRepository, BaseYearRepository baseYearRepository) {
        this.deflatorRepository = deflatorRepository;
        this.baseYearRepository = baseYearRepository;
    }

    public DeflatorsResponse getDeflators(String baseYearLabel, String deflatorType) {
        String effectiveLabel = (baseYearLabel != null && !baseYearLabel.isBlank()) ? baseYearLabel : "2022-23";
        BaseYear baseYear = baseYearRepository.findByYearLabel(effectiveLabel)
            .orElseThrow(() -> new ResourceNotFoundException("BaseYear", "yearLabel", effectiveLabel));

        List<DeflatorObservation> obs = (deflatorType != null && !deflatorType.isBlank())
            ? deflatorRepository.findByDeflatorTypeAndBaseYearIdOrderByPeriodLabelDesc(deflatorType, baseYear.getId())
            : deflatorRepository.findByBaseYearIdOrderByPeriodLabelDesc(baseYear.getId());

        List<DeflatorDto> dtos = obs.stream().map(o -> new DeflatorDto(
            o.getId(), o.getDeflatorType(), o.getPeriodLabel(), o.getDeflatorValue(),
            effectiveLabel, o.getStatus(), o.getPublicationDate()
        )).toList();

        return new DeflatorsResponse(dtos, effectiveLabel,
            "GDP deflator = (Nominal GDP / Real GDP) * 100. " +
            "Derived from official MoSPI NAS values. Not an independent official series.");
    }
}

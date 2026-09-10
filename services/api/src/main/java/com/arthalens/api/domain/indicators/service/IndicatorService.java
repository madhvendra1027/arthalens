package com.arthalens.api.domain.indicators.service;

import com.arthalens.api.domain.indicators.dto.IndicatorDto;
import com.arthalens.api.domain.indicators.dto.IndicatorsResponse;
import com.arthalens.api.domain.indicators.repository.PriceIndexRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class IndicatorService {

    private final PriceIndexRepository repository;

    public IndicatorService(PriceIndexRepository repository) {
        this.repository = repository;
    }

    public IndicatorsResponse getIndicators(String indexType) {
        var obs = (indexType != null && !indexType.isBlank())
            ? repository.findByIndexTypeOrderByPeriodLabelDesc(indexType)
            : repository.findAllByOrderByIndexTypeAscPeriodLabelDesc();

        List<IndicatorDto> dtos = obs.stream().map(o -> new IndicatorDto(
            o.getId(), o.getIndexType(), o.getSeriesName(), o.getBaseYear(),
            o.getPeriodLabel(), o.getIndexValue(), o.getYoyChangePct(),
            o.getStatus(), o.getPublicationDate()
        )).toList();

        return new IndicatorsResponse(dtos, indexType != null ? indexType : "all", dtos.size());
    }
}

package com.arthalens.api.domain.gdp;

import com.arthalens.api.domain.gdp.dto.StateGvaResponse;
import com.arthalens.api.domain.gdp.entity.StateGvaObservation;
import com.arthalens.api.domain.gdp.repository.StateGvaObservationRepository;
import com.arthalens.api.domain.gdp.service.StateGvaService;
import com.arthalens.api.domain.methodology.entity.BaseYear;
import com.arthalens.api.domain.methodology.repository.BaseYearRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class StateGvaServiceTest {

    @Mock
    private StateGvaObservationRepository repository;

    @Mock
    private BaseYearRepository baseYearRepo;

    @InjectMocks
    private StateGvaService service;

    private BaseYear baseYear;
    private StateGvaObservation sampleState;

    @BeforeEach
    void setUp() {
        baseYear = new BaseYear();
        ReflectionTestUtils.setField(baseYear, "id", UUID.randomUUID());
        ReflectionTestUtils.setField(baseYear, "yearLabel", "2022-23");

        sampleState = new StateGvaObservation();
        ReflectionTestUtils.setField(sampleState, "id", UUID.randomUUID());
        ReflectionTestUtils.setField(sampleState, "stateCode", "MH");
        ReflectionTestUtils.setField(sampleState, "stateName", "Maharashtra");
        ReflectionTestUtils.setField(sampleState, "periodLabel", "2023-24");
        ReflectionTestUtils.setField(sampleState, "gsdpCrore", new BigDecimal("4044251.00"));
        ReflectionTestUtils.setField(sampleState, "gvaCrore", new BigDecimal("3520000.00"));
        ReflectionTestUtils.setField(sampleState, "growthRateYoy", new BigDecimal("7.60"));
        ReflectionTestUtils.setField(sampleState, "shareOfNationalGva", new BigDecimal("13.80"));
    }

    @Test
    @DisplayName("getStates returns official state records and provenance")
    void getStates_Success() {
        when(baseYearRepo.findByYearLabel("2022-23")).thenReturn(Optional.of(baseYear));
        when(repository.findLatestStateGva()).thenReturn(List.of(sampleState));

        StateGvaResponse response = service.getStates("2022-23", null);

        assertThat(response).isNotNull();
        assertThat(response.baseYear()).isEqualTo("2022-23");
        assertThat(response.period()).isEqualTo("2023-24");
        assertThat(response.states()).hasSize(1);
        assertThat(response.states().get(0).stateCode()).isEqualTo("MH");
        assertThat(response.states().get(0).stateName()).isEqualTo("Maharashtra");
        assertThat(response.states().get(0).shareOfNationalGva()).isEqualByComparingTo("13.80");
        assertThat(response.authority()).contains("Ministry of Statistics & Programme Implementation");
    }
}

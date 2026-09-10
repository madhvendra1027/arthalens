package com.arthalens.api.domain.gdp;

import com.arthalens.api.common.exception.ResourceNotFoundException;
import com.arthalens.api.domain.gdp.dto.GdpObservationDto;
import com.arthalens.api.domain.gdp.dto.GdpSeriesResponse;
import com.arthalens.api.domain.gdp.entity.GdpObservation;
import com.arthalens.api.domain.gdp.repository.GdpObservationRepository;
import com.arthalens.api.domain.gdp.service.GdpService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.util.ReflectionTestUtils;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class GdpServiceTest {

    @Mock
    private GdpObservationRepository repository;

    @InjectMocks
    private GdpService service;

    private UUID baseYearId;
    private GdpObservation sampleObservation;

    @BeforeEach
    void setUp() {
        baseYearId = UUID.randomUUID();
        sampleObservation = new GdpObservation();
        ReflectionTestUtils.setField(sampleObservation, "id", UUID.randomUUID());
        ReflectionTestUtils.setField(sampleObservation, "periodType", "FY");
        ReflectionTestUtils.setField(sampleObservation, "periodLabel", "2023-24");
        ReflectionTestUtils.setField(sampleObservation, "valueCrore", new BigDecimal("17382000.00"));
        ReflectionTestUtils.setField(sampleObservation, "priceType", "constant");
        ReflectionTestUtils.setField(sampleObservation, "growthRateYoy", new BigDecimal("8.20"));
        ReflectionTestUtils.setField(sampleObservation, "baseYearId", baseYearId);
        ReflectionTestUtils.setField(sampleObservation, "methodologyVersionId", UUID.randomUUID());
        ReflectionTestUtils.setField(sampleObservation, "sourceId", UUID.randomUUID());
        ReflectionTestUtils.setField(sampleObservation, "status", GdpObservation.ObservationStatus.official);
        ReflectionTestUtils.setField(sampleObservation, "publicationDate", LocalDate.of(2024, 5, 31));
        ReflectionTestUtils.setField(sampleObservation, "retrievalTimestamp", OffsetDateTime.now());
    }

    @Test
    @DisplayName("getLatest returns observation DTO when found")
    void getLatest_Success() {
        when(repository.findLatest(baseYearId, "constant")).thenReturn(Optional.of(sampleObservation));

        GdpObservationDto result = service.getLatest(baseYearId, "constant");

        assertThat(result).isNotNull();
        assertThat(result.periodLabel()).isEqualTo("2023-24");
        assertThat(result.valueCrore()).isEqualByComparingTo("17382000.00");
        assertThat(result.provenance()).isNotNull();
    }

    @Test
    @DisplayName("getLatest throws ResourceNotFoundException when not found")
    void getLatest_NotFound() {
        when(repository.findLatest(baseYearId, "constant")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.getLatest(baseYearId, "constant"))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("No GDP observation found");
    }

    @Test
    @DisplayName("getSeries returns series with warning when allowMixed is true")
    void getSeries_WithMixedWarning() {
        var page = new PageImpl<>(List.of(sampleObservation), PageRequest.of(0, 10), 1);
        when(repository.findSeries(eq(baseYearId), eq("constant"), eq("FY"), any())).thenReturn(page);

        GdpSeriesResponse response = service.getSeries(baseYearId, "constant", "FY", true, 0, 10);

        assertThat(response).isNotNull();
        assertThat(response.warning()).isNotNull();
        assertThat(response.warning()).contains("WARNING: mixed base-year");
        assertThat(response.data()).hasSize(1);
    }
}

package com.arthalens.api.domain.gdp;

import com.arthalens.api.domain.gdp.dto.SectorBreakdownResponse;
import com.arthalens.api.domain.gdp.entity.SectorObservation;
import com.arthalens.api.domain.gdp.repository.SectorObservationRepository;
import com.arthalens.api.domain.gdp.service.GdpSectorService;
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
class GdpSectorServiceTest {

    @Mock
    private SectorObservationRepository sectorRepo;

    @Mock
    private BaseYearRepository baseYearRepo;

    @InjectMocks
    private GdpSectorService service;

    private BaseYear baseYear;
    private SectorObservation sampleSector;

    @BeforeEach
    void setUp() {
        UUID byId = UUID.randomUUID();
        baseYear = new BaseYear();
        ReflectionTestUtils.setField(baseYear, "id", byId);
        ReflectionTestUtils.setField(baseYear, "yearLabel", "2022-23");

        sampleSector = new SectorObservation();
        ReflectionTestUtils.setField(sampleSector, "id", UUID.randomUUID());
        ReflectionTestUtils.setField(sampleSector, "baseYearId", byId);
        ReflectionTestUtils.setField(sampleSector, "sectorCode", "MFG");
        ReflectionTestUtils.setField(sampleSector, "sectorName", "Manufacturing");
        ReflectionTestUtils.setField(sampleSector, "periodLabel", "FY 2023-24");
        ReflectionTestUtils.setField(sampleSector, "priceType", "constant");
        ReflectionTestUtils.setField(sampleSector, "valueCrore", new BigDecimal("2750000.00"));
        ReflectionTestUtils.setField(sampleSector, "shareOfGva", new BigDecimal("17.30"));
        ReflectionTestUtils.setField(sampleSector, "growthRateYoy", new BigDecimal("9.90"));
    }

    @Test
    @DisplayName("getSectors returns sectors sorted by share")
    void getSectors_Success() {
        when(baseYearRepo.findByYearLabel("2022-23")).thenReturn(Optional.of(baseYear));
        when(sectorRepo.findLatestSectors(baseYear.getId(), "constant")).thenReturn(List.of(sampleSector));

        SectorBreakdownResponse response = service.getSectors("2022-23", "constant", null);

        assertThat(response).isNotNull();
        assertThat(response.baseYear()).isEqualTo("2022-23");
        assertThat(response.priceType()).isEqualTo("constant");
        assertThat(response.sectors()).hasSize(1);
        assertThat(response.sectors().get(0).sectorCode()).isEqualTo("MFG");
        assertThat(response.sectors().get(0).shareOfGdp()).isEqualTo(17.30);
    }
}

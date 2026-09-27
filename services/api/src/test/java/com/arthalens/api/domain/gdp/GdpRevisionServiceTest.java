package com.arthalens.api.domain.gdp;

import com.arthalens.api.domain.gdp.dto.RevisionHistoryResponse;
import com.arthalens.api.domain.gdp.entity.Revision;
import com.arthalens.api.domain.gdp.repository.RevisionRepository;
import com.arthalens.api.domain.gdp.service.GdpRevisionService;
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
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class GdpRevisionServiceTest {

    @Mock
    private RevisionRepository revisionRepo;

    @Mock
    private BaseYearRepository baseYearRepo;

    @InjectMocks
    private GdpRevisionService service;

    private BaseYear baseYear;
    private Revision sampleRevision;

    @BeforeEach
    void setUp() {
        baseYear = new BaseYear();
        ReflectionTestUtils.setField(baseYear, "id", UUID.randomUUID());
        ReflectionTestUtils.setField(baseYear, "yearLabel", "2022-23");

        sampleRevision = new Revision();
        ReflectionTestUtils.setField(sampleRevision, "id", UUID.randomUUID());
        ReflectionTestUtils.setField(sampleRevision, "entityType", "gdp_observation");
        ReflectionTestUtils.setField(sampleRevision, "releaseLabel", "First Advance Estimates");
        ReflectionTestUtils.setField(sampleRevision, "revisionDate", LocalDate.of(2024, 1, 5));
        ReflectionTestUtils.setField(sampleRevision, "fromValue", new BigDecimal("17300000.00"));
        ReflectionTestUtils.setField(sampleRevision, "toValue", new BigDecimal("17382000.00"));
        ReflectionTestUtils.setField(sampleRevision, "revisionSequence", 1);
    }

    @Test
    @DisplayName("getRevisions returns sequential revision deltas")
    void getRevisions_Success() {
        when(baseYearRepo.findByYearLabel("2022-23")).thenReturn(Optional.of(baseYear));
        when(revisionRepo.findByEntityTypeOrderByRevisionDateAscRevisionSequenceAsc("gdp_observation"))
                .thenReturn(List.of(sampleRevision));

        RevisionHistoryResponse response = service.getRevisions("2022-23", "FY 2023-24");

        assertThat(response).isNotNull();
        assertThat(response.baseYear()).isEqualTo("2022-23");
        assertThat(response.revisions()).hasSize(1);
        assertThat(response.revisions().get(0).releaseLabel()).isEqualTo("First Advance Estimates");
        assertThat(response.revisions().get(0).absoluteChange()).isEqualTo(82000.00);
        assertThat(response.prominentWarning()).contains("Comparing values across base-year series is a methodology change");
    }
}

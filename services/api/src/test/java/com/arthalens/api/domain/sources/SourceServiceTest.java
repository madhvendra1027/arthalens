package com.arthalens.api.domain.sources;

import com.arthalens.api.common.exception.ResourceNotFoundException;
import com.arthalens.api.domain.sources.dto.SourceDto;
import com.arthalens.api.domain.sources.entity.Source;
import com.arthalens.api.domain.sources.repository.SourceRepository;
import com.arthalens.api.domain.sources.service.SourceService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class SourceServiceTest {

    @Mock
    private SourceRepository repository;

    @InjectMocks
    private SourceService service;

    private UUID sourceId;
    private Source sampleSource;

    @BeforeEach
    void setUp() {
        sourceId = UUID.randomUUID();
        sampleSource = new Source();
        ReflectionTestUtils.setField(sampleSource, "id", sourceId);
        ReflectionTestUtils.setField(sampleSource, "name", "MoSPI National Accounts Statistics");
        ReflectionTestUtils.setField(sampleSource, "authority", "MoSPI");
        ReflectionTestUtils.setField(sampleSource, "canonicalUrl", "https://mospi.gov.in");
        ReflectionTestUtils.setField(sampleSource, "updateFrequency", "Quarterly");
        ReflectionTestUtils.setField(sampleSource, "lastSuccessfulRetrieval", OffsetDateTime.now());
        ReflectionTestUtils.setField(sampleSource, "lastObservedPubDate", LocalDate.of(2024, 5, 31));
        ReflectionTestUtils.setField(sampleSource, "isActive", true);
    }

    @Test
    @DisplayName("getById returns source DTO when source exists")
    void getById_Success() {
        when(repository.findById(sourceId)).thenReturn(Optional.of(sampleSource));

        SourceDto result = service.getById(sourceId);

        assertThat(result).isNotNull();
        assertThat(result.name()).isEqualTo("MoSPI National Accounts Statistics");
        assertThat(result.authority()).isEqualTo("MoSPI");
    }

    @Test
    @DisplayName("getById throws ResourceNotFoundException when source does not exist")
    void getById_NotFound() {
        when(repository.findById(sourceId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.getById(sourceId))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining(sourceId.toString());
    }
}

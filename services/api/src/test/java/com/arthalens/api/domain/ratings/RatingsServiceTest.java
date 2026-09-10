package com.arthalens.api.domain.ratings;

import com.arthalens.api.domain.ratings.dto.RatingsResponse;
import com.arthalens.api.domain.ratings.entity.SovereignRating;
import com.arthalens.api.domain.ratings.repository.SovereignRatingRepository;
import com.arthalens.api.domain.ratings.service.RatingsService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RatingsServiceTest {

    @Mock
    private SovereignRatingRepository repository;

    @InjectMocks
    private RatingsService service;

    private SovereignRating currentRating;
    private SovereignRating historicalRating;

    @BeforeEach
    void setUp() {
        currentRating = new SovereignRating();
        ReflectionTestUtils.setField(currentRating, "id", UUID.randomUUID());
        ReflectionTestUtils.setField(currentRating, "country", "India");
        ReflectionTestUtils.setField(currentRating, "agency", "Moody's");
        ReflectionTestUtils.setField(currentRating, "rating", "Baa3");
        ReflectionTestUtils.setField(currentRating, "outlook", "Stable");
        ReflectionTestUtils.setField(currentRating, "ratingDate", LocalDate.of(2024, 1, 15));
        ReflectionTestUtils.setField(currentRating, "isCurrent", true);

        historicalRating = new SovereignRating();
        ReflectionTestUtils.setField(historicalRating, "id", UUID.randomUUID());
        ReflectionTestUtils.setField(historicalRating, "country", "India");
        ReflectionTestUtils.setField(historicalRating, "agency", "Moody's");
        ReflectionTestUtils.setField(historicalRating, "rating", "Baa2");
        ReflectionTestUtils.setField(historicalRating, "outlook", "Negative");
        ReflectionTestUtils.setField(historicalRating, "ratingDate", LocalDate.of(2020, 6, 11));
        ReflectionTestUtils.setField(historicalRating, "isCurrent", false);
    }

    @Test
    @DisplayName("getRatings separates current and historical ratings")
    void getRatings_All() {
        when(repository.findAllByOrderByRatingDateDesc()).thenReturn(List.of(currentRating, historicalRating));

        RatingsResponse response = service.getRatings(null);

        assertThat(response).isNotNull();
        assertThat(response.current()).hasSize(1);
        assertThat(response.current().get(0).agency()).isEqualTo("Moody's");
        assertThat(response.history()).hasSize(1);
        assertThat(response.disclaimer()).isNotBlank();
    }

    @Test
    @DisplayName("getRatings filters by agency when agency is specified")
    void getRatings_FilteredByAgency() {
        when(repository.findByAgencyOrderByRatingDateDesc("Moody's")).thenReturn(List.of(currentRating));

        RatingsResponse response = service.getRatings("Moody's");

        assertThat(response).isNotNull();
        assertThat(response.current()).hasSize(1);
        assertThat(response.history()).isEmpty();
    }
}

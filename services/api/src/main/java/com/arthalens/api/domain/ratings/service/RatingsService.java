package com.arthalens.api.domain.ratings.service;

import com.arthalens.api.domain.ratings.dto.RatingDto;
import com.arthalens.api.domain.ratings.dto.RatingsResponse;
import com.arthalens.api.domain.ratings.entity.SovereignRating;
import com.arthalens.api.domain.ratings.repository.SovereignRatingRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RatingsService {

    private final SovereignRatingRepository repository;

    public RatingsService(SovereignRatingRepository repository) {
        this.repository = repository;
    }

    public RatingsResponse getRatings(String agency) {
        List<SovereignRating> all = (agency != null && !agency.isBlank())
            ? repository.findByAgencyOrderByRatingDateDesc(agency)
            : repository.findAllByOrderByRatingDateDesc();

        List<RatingDto> current = all.stream().filter(SovereignRating::isCurrent).map(this::toDto).toList();
        List<RatingDto> history = all.stream().filter(r -> !r.isCurrent()).map(this::toDto).toList();

        return new RatingsResponse(current, history,
            "Sovereign ratings are official ratings from the listed agencies. " +
            "Source documents verified against official agency publications. Not investment advice.");
    }

    private RatingDto toDto(SovereignRating r) {
        return new RatingDto(r.getId(), r.getCountry(), r.getAgency(),
            r.getRating(), r.getOutlook(), r.getRatingDate(), r.isCurrent());
    }
}

package com.arthalens.api.domain.ratings.repository;

import com.arthalens.api.domain.ratings.entity.SovereignRating;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface SovereignRatingRepository extends JpaRepository<SovereignRating, UUID> {
    List<SovereignRating> findByIsCurrentTrueOrderByAgency();
    List<SovereignRating> findByAgencyOrderByRatingDateDesc(String agency);
    List<SovereignRating> findAllByOrderByRatingDateDesc();
}

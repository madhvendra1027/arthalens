package com.arthalens.api.domain.gdp.repository;

import com.arthalens.api.domain.gdp.entity.StateGvaObservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface StateGvaObservationRepository extends JpaRepository<StateGvaObservation, UUID> {

    List<StateGvaObservation> findByPeriodLabelOrderByGsdpCroreDesc(String periodLabel);

    @Query("SELECT s FROM StateGvaObservation s WHERE s.periodLabel = " +
           "(SELECT MAX(s2.periodLabel) FROM StateGvaObservation s2) " +
           "ORDER BY s.gsdpCrore DESC")
    List<StateGvaObservation> findLatestStateGva();

    List<StateGvaObservation> findByBaseYearIdOrderByGsdpCroreDesc(UUID baseYearId);
}

package com.arthalens.api.domain.gdp.repository;

import com.arthalens.api.domain.gdp.entity.GvaObservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface GvaObservationRepository extends JpaRepository<GvaObservation, UUID> {

    @Query("SELECT g FROM GvaObservation g WHERE g.baseYearId = :baseYearId " +
           "AND g.priceType = :priceType " +
           "ORDER BY g.periodLabel DESC LIMIT 1")
    Optional<GvaObservation> findLatest(
            @Param("baseYearId") UUID baseYearId,
            @Param("priceType") String priceType);

    List<GvaObservation> findByBaseYearIdAndPriceTypeOrderByPeriodLabelDesc(
            UUID baseYearId, String priceType);
}

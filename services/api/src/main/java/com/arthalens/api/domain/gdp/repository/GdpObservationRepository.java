package com.arthalens.api.domain.gdp.repository;

import com.arthalens.api.domain.gdp.entity.GdpObservation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface GdpObservationRepository extends JpaRepository<GdpObservation, UUID> {

    @Query("SELECT g FROM GdpObservation g WHERE g.baseYearId = :baseYearId " +
           "AND g.priceType = :priceType " +
           "ORDER BY g.periodLabel DESC LIMIT 1")
    Optional<GdpObservation> findLatest(
            @Param("baseYearId") UUID baseYearId,
            @Param("priceType") String priceType);

    @Query("SELECT g FROM GdpObservation g WHERE g.baseYearId = :baseYearId " +
           "AND g.priceType = :priceType " +
           "AND (:periodType IS NULL OR g.periodType = :periodType) " +
           "ORDER BY g.periodLabel ASC")
    Page<GdpObservation> findSeries(
            @Param("baseYearId") UUID baseYearId,
            @Param("priceType") String priceType,
            @Param("periodType") String periodType,
            Pageable pageable);
}

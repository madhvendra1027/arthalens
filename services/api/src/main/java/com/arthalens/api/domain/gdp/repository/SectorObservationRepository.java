package com.arthalens.api.domain.gdp.repository;

import com.arthalens.api.domain.gdp.entity.SectorObservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface SectorObservationRepository extends JpaRepository<SectorObservation, UUID> {

    List<SectorObservation> findByBaseYearIdAndPriceTypeAndPeriodLabelOrderByShareOfGvaDesc(
            UUID baseYearId, String priceType, String periodLabel);

    @Query("SELECT s FROM SectorObservation s WHERE s.baseYearId = :baseYearId " +
           "AND s.priceType = :priceType " +
           "AND s.periodLabel = (SELECT MAX(s2.periodLabel) FROM SectorObservation s2 WHERE s2.baseYearId = :baseYearId) " +
           "ORDER BY s.shareOfGva DESC")
    List<SectorObservation> findLatestSectors(
            @Param("baseYearId") UUID baseYearId,
            @Param("priceType") String priceType);

    @Query("SELECT s FROM SectorObservation s WHERE s.baseYearId = :baseYearId " +
           "AND s.priceType = :priceType " +
           "AND s.periodLabel = (SELECT MAX(s2.periodLabel) FROM SectorObservation s2 WHERE s2.baseYearId = :baseYearId) " +
           "ORDER BY s.growthRateYoy DESC LIMIT 4")
    List<SectorObservation> findTopSectorsByGrowth(
            @Param("baseYearId") UUID baseYearId,
            @Param("priceType") String priceType);
}

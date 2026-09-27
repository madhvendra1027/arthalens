package com.arthalens.api.domain.dashboard.service;

import com.arthalens.api.common.dto.MetricCardDto;
import com.arthalens.api.common.dto.ProvenanceDto;
import com.arthalens.api.domain.dashboard.dto.DashboardResponse;
import com.arthalens.api.domain.deflator.entity.DeflatorObservation;
import com.arthalens.api.domain.deflator.repository.DeflatorRepository;
import com.arthalens.api.domain.gdp.entity.GdpObservation;
import com.arthalens.api.domain.gdp.entity.GvaObservation;
import com.arthalens.api.domain.gdp.entity.SectorObservation;
import com.arthalens.api.domain.gdp.repository.GdpObservationRepository;
import com.arthalens.api.domain.gdp.repository.GvaObservationRepository;
import com.arthalens.api.domain.gdp.repository.SectorObservationRepository;
import com.arthalens.api.domain.indicators.entity.PriceIndex;
import com.arthalens.api.domain.indicators.repository.PriceIndexRepository;
import com.arthalens.api.domain.methodology.entity.BaseYear;
import com.arthalens.api.domain.methodology.repository.BaseYearRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class DashboardService {

    private final GdpObservationRepository gdpRepo;
    private final GvaObservationRepository gvaRepo;
    private final DeflatorRepository deflatorRepo;
    private final PriceIndexRepository priceIndexRepo;
    private final SectorObservationRepository sectorRepo;
    private final BaseYearRepository baseYearRepo;

    public DashboardService(
            GdpObservationRepository gdpRepo,
            GvaObservationRepository gvaRepo,
            DeflatorRepository deflatorRepo,
            PriceIndexRepository priceIndexRepo,
            SectorObservationRepository sectorRepo,
            BaseYearRepository baseYearRepo) {
        this.gdpRepo = gdpRepo;
        this.gvaRepo = gvaRepo;
        this.deflatorRepo = deflatorRepo;
        this.priceIndexRepo = priceIndexRepo;
        this.sectorRepo = sectorRepo;
        this.baseYearRepo = baseYearRepo;
    }

    public DashboardResponse getSnapshot(String baseYear) {
        String effectiveBaseYear = (baseYear != null && !baseYear.isBlank()) ? baseYear : "2022-23";
        Optional<BaseYear> byOpt = baseYearRepo.findByYearLabel(effectiveBaseYear);
        UUID baseYearId = byOpt.map(BaseYear::getId).orElse(null);

        MetricCardDto realGdpCard = unavailableCard("Real GDP Growth (YoY)", "%", "Latest Quarter");
        MetricCardDto nominalGdpCard = unavailableCard("Nominal GDP Growth (YoY)", "%", "Latest Quarter");
        MetricCardDto gdpAbsoluteCard = unavailableCard("Nominal GDP Size", "INR Crore", "Latest FY");
        MetricCardDto gvaGrowthCard = unavailableCard("Real GVA Growth", "%", "Latest FY");
        MetricCardDto deflatorCard = unavailableCard("Implicit GDP Deflator", "%", "Latest FY");
        MetricCardDto cpiCard = unavailableCard("Headline CPI Inflation", "%", "Latest Month");
        MetricCardDto wpiCard = unavailableCard("WPI Inflation", "%", "Latest Month");

        List<MetricCardDto> topSectors = List.of();

        if (baseYearId != null) {
            // Real GDP
            Optional<GdpObservation> realGdpOpt = gdpRepo.findLatest(baseYearId, "constant");
            if (realGdpOpt.isPresent()) {
                GdpObservation o = realGdpOpt.get();
                realGdpCard = new MetricCardDto(
                        "Real GDP Growth (YoY)",
                        o.getGrowthRateYoy(),
                        "%",
                        o.getPeriodLabel(),
                        o.getStatus().name(),
                        new ProvenanceDto(
                                o.getSourceId().toString(),
                                "MoSPI National Accounts Statistics",
                                "https://mospi.gov.in/national-accounts-statistics",
                                o.getPublicationDate(),
                                o.getRetrievalTimestamp(),
                                effectiveBaseYear,
                                o.getMethodologyVersionId().toString(),
                                o.getStatus().name()
                        )
                );
            }

            // Nominal GDP & Absolute Size
            Optional<GdpObservation> nomGdpOpt = gdpRepo.findLatest(baseYearId, "current");
            if (nomGdpOpt.isPresent()) {
                GdpObservation o = nomGdpOpt.get();
                nominalGdpCard = new MetricCardDto(
                        "Nominal GDP Growth (YoY)",
                        o.getGrowthRateYoy(),
                        "%",
                        o.getPeriodLabel(),
                        o.getStatus().name(),
                        new ProvenanceDto(
                                o.getSourceId().toString(),
                                "MoSPI National Accounts Statistics",
                                "https://mospi.gov.in/national-accounts-statistics",
                                o.getPublicationDate(),
                                o.getRetrievalTimestamp(),
                                effectiveBaseYear,
                                o.getMethodologyVersionId().toString(),
                                o.getStatus().name()
                        )
                );
                gdpAbsoluteCard = new MetricCardDto(
                        "Nominal GDP Size",
                        o.getValueCrore(),
                        "INR Crore",
                        o.getPeriodLabel(),
                        o.getStatus().name(),
                        new ProvenanceDto(
                                o.getSourceId().toString(),
                                "MoSPI National Accounts Statistics",
                                "https://mospi.gov.in/national-accounts-statistics",
                                o.getPublicationDate(),
                                o.getRetrievalTimestamp(),
                                effectiveBaseYear,
                                o.getMethodologyVersionId().toString(),
                                o.getStatus().name()
                        )
                );
            }

            // Real GVA
            Optional<GvaObservation> gvaOpt = gvaRepo.findLatest(baseYearId, "constant");
            if (gvaOpt.isPresent()) {
                GvaObservation o = gvaOpt.get();
                gvaGrowthCard = new MetricCardDto(
                        "Real GVA Growth",
                        o.getGrowthRateYoy(),
                        "%",
                        o.getPeriodLabel(),
                        o.getStatus().name(),
                        new ProvenanceDto(
                                o.getSourceId().toString(),
                                "MoSPI National Accounts Statistics",
                                "https://mospi.gov.in/national-accounts-statistics",
                                o.getPublicationDate(),
                                o.getRetrievalTimestamp(),
                                effectiveBaseYear,
                                o.getMethodologyVersionId().toString(),
                                o.getStatus().name()
                        )
                );
            }

            // GDP Deflator
            List<DeflatorObservation> deflators = deflatorRepo.findByBaseYearIdOrderByPeriodLabelDesc(baseYearId);
            if (!deflators.isEmpty()) {
                DeflatorObservation o = deflators.get(0);
                deflatorCard = new MetricCardDto(
                        "Implicit GDP Deflator",
                        o.getDeflatorValue(),
                        "%",
                        o.getPeriodLabel(),
                        o.getStatus() != null ? o.getStatus() : "derived",
                        new ProvenanceDto(
                                o.getSourceId() != null ? o.getSourceId().toString() : "mospi-nas",
                                "Derived from MoSPI NAS (Nominal GDP / Real GDP)",
                                "https://mospi.gov.in/national-accounts-statistics",
                                o.getPublicationDate(),
                                o.getRetrievalTimestamp(),
                                effectiveBaseYear,
                                null,
                                o.getStatus() != null ? o.getStatus() : "derived"
                        )
                );
            }

            // Top Sectors
            List<SectorObservation> sectorList = sectorRepo.findTopSectorsByGrowth(baseYearId, "constant");
            topSectors = sectorList.stream().map(s -> new MetricCardDto(
                    s.getSectorName(),
                    s.getGrowthRateYoy(),
                    "% YoY",
                    s.getPeriodLabel(),
                    s.getStatus().name(),
                    null
            )).toList();
        }

        // CPI
        List<PriceIndex> cpiList = priceIndexRepo.findByIndexTypeOrderByPeriodLabelDesc("cpi");
        if (!cpiList.isEmpty()) {
            PriceIndex p = cpiList.get(0);
            cpiCard = new MetricCardDto(
                    "Headline CPI Inflation",
                    p.getYoyChangePct(),
                    "%",
                    p.getPeriodLabel(),
                    p.getStatus() != null ? p.getStatus() : "official",
                    new ProvenanceDto(
                            p.getSourceId() != null ? p.getSourceId().toString() : "rbi-cpi",
                            "MoSPI / RBI Consumer Price Index (Combined)",
                            "https://mospi.gov.in",
                            p.getPublicationDate(),
                            p.getRetrievalTimestamp(),
                            p.getBaseYear(),
                            null,
                            p.getStatus() != null ? p.getStatus() : "official"
                    )
            );
        }

        // WPI
        List<PriceIndex> wpiList = priceIndexRepo.findByIndexTypeOrderByPeriodLabelDesc("wpi");
        if (!wpiList.isEmpty()) {
            PriceIndex p = wpiList.get(0);
            wpiCard = new MetricCardDto(
                    "WPI Inflation",
                    p.getYoyChangePct(),
                    "%",
                    p.getPeriodLabel(),
                    p.getStatus() != null ? p.getStatus() : "official",
                    new ProvenanceDto(
                            p.getSourceId() != null ? p.getSourceId().toString() : "dpiit-wpi",
                            "Office of the Economic Adviser, DPIIT",
                            "https://eaindustry.nic.in",
                            p.getPublicationDate(),
                            p.getRetrievalTimestamp(),
                            p.getBaseYear(),
                            null,
                            p.getStatus() != null ? p.getStatus() : "official"
                    )
            );
        }

        return new DashboardResponse(
                OffsetDateTime.now(),
                effectiveBaseYear,
                realGdpCard,
                nominalGdpCard,
                gdpAbsoluteCard,
                gvaGrowthCard,
                deflatorCard,
                cpiCard,
                wpiCard,
                topSectors
        );
    }

    private MetricCardDto unavailableCard(String label, String unit, String period) {
        return new MetricCardDto(label, null, unit, period, "unavailable", null);
    }
}

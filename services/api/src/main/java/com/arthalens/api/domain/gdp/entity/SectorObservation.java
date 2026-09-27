package com.arthalens.api.domain.gdp.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.*;
import java.util.UUID;

@Entity
@Table(name = "sector_observations")
public class SectorObservation {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "sector_code", nullable = false)
    private String sectorCode;

    @Column(name = "sector_name", nullable = false)
    private String sectorName;

    @Column(name = "period_type", nullable = false, length = 4)
    private String periodType;

    @Column(name = "period_label", nullable = false)
    private String periodLabel;

    @Column(name = "value_crore", nullable = false, precision = 20, scale = 4)
    private BigDecimal valueCrore;

    @Column(name = "price_type", nullable = false, length = 10)
    private String priceType;

    @Column(name = "share_of_gva", precision = 6, scale = 2)
    private BigDecimal shareOfGva;

    @Column(name = "growth_rate_yoy", precision = 10, scale = 6)
    private BigDecimal growthRateYoy;

    @Column(name = "base_year_id", nullable = false)
    private UUID baseYearId;

    @Column(name = "methodology_version_id", nullable = false)
    private UUID methodologyVersionId;

    @Column(name = "source_id", nullable = false)
    private UUID sourceId;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private GdpObservation.ObservationStatus status = GdpObservation.ObservationStatus.official;

    @Column(name = "publication_date")
    private LocalDate publicationDate;

    @Column(name = "retrieval_timestamp", nullable = false)
    private OffsetDateTime retrievalTimestamp;

    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt = OffsetDateTime.now();

    public UUID getId() { return id; }
    public String getSectorCode() { return sectorCode; }
    public String getSectorName() { return sectorName; }
    public String getPeriodType() { return periodType; }
    public String getPeriodLabel() { return periodLabel; }
    public BigDecimal getValueCrore() { return valueCrore; }
    public String getPriceType() { return priceType; }
    public BigDecimal getShareOfGva() { return shareOfGva; }
    public BigDecimal getGrowthRateYoy() { return growthRateYoy; }
    public UUID getBaseYearId() { return baseYearId; }
    public UUID getMethodologyVersionId() { return methodologyVersionId; }
    public UUID getSourceId() { return sourceId; }
    public GdpObservation.ObservationStatus getStatus() { return status; }
    public LocalDate getPublicationDate() { return publicationDate; }
    public OffsetDateTime getRetrievalTimestamp() { return retrievalTimestamp; }
    public OffsetDateTime getCreatedAt() { return createdAt; }
}

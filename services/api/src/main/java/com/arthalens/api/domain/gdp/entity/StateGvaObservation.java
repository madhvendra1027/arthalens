package com.arthalens.api.domain.gdp.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "state_gva_observations")
public class StateGvaObservation {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "state_code", nullable = false)
    private String stateCode;

    @Column(name = "state_name", nullable = false)
    private String stateName;

    @Column(name = "period_type", nullable = false, length = 4)
    private String periodType;

    @Column(name = "period_label", nullable = false)
    private String periodLabel;

    @Column(name = "gsdp_crore", nullable = false, precision = 20, scale = 4)
    private BigDecimal gsdpCrore;

    @Column(name = "gva_crore", precision = 20, scale = 4)
    private BigDecimal gvaCrore;

    @Column(name = "growth_rate_yoy", precision = 10, scale = 6)
    private BigDecimal growthRateYoy;

    @Column(name = "share_of_national_gva", precision = 6, scale = 2)
    private BigDecimal shareOfNationalGva;

    @Column(name = "base_year_id")
    private UUID baseYearId;

    @Column(name = "source_id")
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
    public String getStateCode() { return stateCode; }
    public String getStateName() { return stateName; }
    public String getPeriodType() { return periodType; }
    public String getPeriodLabel() { return periodLabel; }
    public BigDecimal getGsdpCrore() { return gsdpCrore; }
    public BigDecimal getGvaCrore() { return gvaCrore; }
    public BigDecimal getGrowthRateYoy() { return growthRateYoy; }
    public BigDecimal getShareOfNationalGva() { return shareOfNationalGva; }
    public UUID getBaseYearId() { return baseYearId; }
    public UUID getSourceId() { return sourceId; }
    public GdpObservation.ObservationStatus getStatus() { return status; }
    public LocalDate getPublicationDate() { return publicationDate; }
    public OffsetDateTime getRetrievalTimestamp() { return retrievalTimestamp; }
    public OffsetDateTime getCreatedAt() { return createdAt; }
}

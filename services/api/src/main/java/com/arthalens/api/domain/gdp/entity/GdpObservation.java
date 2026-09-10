package com.arthalens.api.domain.gdp.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import java.math.BigDecimal;
import java.time.*;
import java.util.UUID;

@Entity
@Table(name = "gdp_observations")
public class GdpObservation {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "period_type", nullable = false, length = 4)
    private String periodType;

    @Column(name = "period_label", nullable = false)
    private String periodLabel;

    @Column(name = "period_start")
    private LocalDate periodStart;

    @Column(name = "period_end")
    private LocalDate periodEnd;

    @Column(name = "value_crore", nullable = false, precision = 20, scale = 4)
    private BigDecimal valueCrore;

    @Column(name = "price_type", nullable = false, length = 10)
    private String priceType;

    @Column(name = "growth_rate_yoy", precision = 10, scale = 6)
    private BigDecimal growthRateYoy;

    @Column(name = "base_year_id", nullable = false)
    private UUID baseYearId;

    @Column(name = "methodology_version_id", nullable = false)
    private UUID methodologyVersionId;

    @Column(name = "source_id", nullable = false)
    private UUID sourceId;

    @Column(name = "source_document_id")
    private UUID sourceDocumentId;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private ObservationStatus status = ObservationStatus.official;

    @Column(name = "publication_date")
    private LocalDate publicationDate;

    @Column(name = "retrieval_timestamp", nullable = false)
    private OffsetDateTime retrievalTimestamp;

    @Column(name = "ingestion_run_id")
    private UUID ingestionRunId;

    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt = OffsetDateTime.now();

    public enum ObservationStatus {
        official, provisional, revised, estimated, derived, forecast
    }

    // Getters
    public UUID getId() { return id; }
    public String getPeriodType() { return periodType; }
    public String getPeriodLabel() { return periodLabel; }
    public LocalDate getPeriodStart() { return periodStart; }
    public LocalDate getPeriodEnd() { return periodEnd; }
    public BigDecimal getValueCrore() { return valueCrore; }
    public String getPriceType() { return priceType; }
    public BigDecimal getGrowthRateYoy() { return growthRateYoy; }
    public UUID getBaseYearId() { return baseYearId; }
    public UUID getMethodologyVersionId() { return methodologyVersionId; }
    public UUID getSourceId() { return sourceId; }
    public UUID getSourceDocumentId() { return sourceDocumentId; }
    public ObservationStatus getStatus() { return status; }
    public LocalDate getPublicationDate() { return publicationDate; }
    public OffsetDateTime getRetrievalTimestamp() { return retrievalTimestamp; }
    public OffsetDateTime getCreatedAt() { return createdAt; }
}

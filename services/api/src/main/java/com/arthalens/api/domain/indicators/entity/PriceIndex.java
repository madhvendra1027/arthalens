package com.arthalens.api.domain.indicators.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.*;
import java.util.UUID;

@Entity
@Table(name = "price_indices")
public class PriceIndex {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "index_type", nullable = false)
    private String indexType;

    @Column(name = "series_name", nullable = false)
    private String seriesName;

    @Column(name = "base_year", nullable = false)
    private String baseYear;

    @Column(name = "period_type", nullable = false)
    private String periodType;

    @Column(name = "period_label", nullable = false)
    private String periodLabel;

    @Column(name = "index_value", nullable = false)
    private BigDecimal indexValue;

    @Column(name = "yoy_change_pct")
    private BigDecimal yoyChangePct;

    @Column(name = "source_id", nullable = false)
    private UUID sourceId;

    @Column(name = "status", nullable = false)
    private String status;

    @Column(name = "publication_date")
    private LocalDate publicationDate;

    @Column(name = "retrieval_timestamp", nullable = false)
    private OffsetDateTime retrievalTimestamp;

    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt = OffsetDateTime.now();

    public UUID getId() { return id; }
    public String getIndexType() { return indexType; }
    public String getSeriesName() { return seriesName; }
    public String getBaseYear() { return baseYear; }
    public String getPeriodType() { return periodType; }
    public String getPeriodLabel() { return periodLabel; }
    public BigDecimal getIndexValue() { return indexValue; }
    public BigDecimal getYoyChangePct() { return yoyChangePct; }
    public String getStatus() { return status; }
    public UUID getSourceId() { return sourceId; }
    public LocalDate getPublicationDate() { return publicationDate; }
    public OffsetDateTime getRetrievalTimestamp() { return retrievalTimestamp; }
}

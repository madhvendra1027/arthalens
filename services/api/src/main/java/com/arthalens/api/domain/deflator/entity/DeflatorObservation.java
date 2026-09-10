package com.arthalens.api.domain.deflator.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.*;
import java.util.UUID;

@Entity
@Table(name = "deflator_observations")
public class DeflatorObservation {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "deflator_type", nullable = false)
    private String deflatorType;

    @Column(name = "period_type", nullable = false)
    private String periodType;

    @Column(name = "period_label", nullable = false)
    private String periodLabel;

    @Column(name = "deflator_value", nullable = false)
    private BigDecimal deflatorValue;

    @Column(name = "base_year_id", nullable = false)
    private UUID baseYearId;

    @Column(name = "methodology_version_id")
    private UUID methodologyVersionId;

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
    public String getDeflatorType() { return deflatorType; }
    public String getPeriodType() { return periodType; }
    public String getPeriodLabel() { return periodLabel; }
    public BigDecimal getDeflatorValue() { return deflatorValue; }
    public UUID getBaseYearId() { return baseYearId; }
    public String getStatus() { return status; }
    public LocalDate getPublicationDate() { return publicationDate; }
    public OffsetDateTime getRetrievalTimestamp() { return retrievalTimestamp; }
}

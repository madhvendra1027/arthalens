package com.arthalens.api.domain.gdp.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "revisions")
public class Revision {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "entity_type", nullable = false)
    private String entityType;

    @Column(name = "entity_id", nullable = false)
    private UUID entityId;

    @Column(name = "revision_sequence", nullable = false)
    private Integer revisionSequence;

    @Column(name = "from_value", precision = 20, scale = 4)
    private BigDecimal fromValue;

    @Column(name = "to_value", precision = 20, scale = 4)
    private BigDecimal toValue;

    @Enumerated(EnumType.STRING)
    @Column(name = "from_status")
    private GdpObservation.ObservationStatus fromStatus;

    @Enumerated(EnumType.STRING)
    @Column(name = "to_status")
    private GdpObservation.ObservationStatus toStatus;

    @Column(name = "revision_date", nullable = false)
    private LocalDate revisionDate;

    @Column(name = "release_label")
    private String releaseLabel;

    @Column(name = "revision_reason")
    private String revisionReason;

    @Column(name = "source_id")
    private UUID sourceId;

    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt = OffsetDateTime.now();

    public UUID getId() { return id; }
    public String getEntityType() { return entityType; }
    public UUID getEntityId() { return entityId; }
    public Integer getRevisionSequence() { return revisionSequence; }
    public BigDecimal getFromValue() { return fromValue; }
    public BigDecimal getToValue() { return toValue; }
    public GdpObservation.ObservationStatus getFromStatus() { return fromStatus; }
    public GdpObservation.ObservationStatus getToStatus() { return toStatus; }
    public LocalDate getRevisionDate() { return revisionDate; }
    public String getReleaseLabel() { return releaseLabel; }
    public String getRevisionReason() { return revisionReason; }
    public UUID getSourceId() { return sourceId; }
    public OffsetDateTime getCreatedAt() { return createdAt; }
}

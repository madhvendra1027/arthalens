package com.arthalens.api.domain.ratings.entity;

import jakarta.persistence.*;
import java.time.*;
import java.util.UUID;

@Entity
@Table(name = "sovereign_ratings")
public class SovereignRating {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "country", nullable = false)
    private String country = "India";

    @Column(name = "agency", nullable = false)
    private String agency;

    @Column(name = "rating", nullable = false)
    private String rating;

    @Column(name = "outlook", nullable = false)
    private String outlook;

    @Column(name = "rating_date", nullable = false)
    private LocalDate ratingDate;

    @Column(name = "is_current", nullable = false)
    private boolean isCurrent;

    @Column(name = "source_id", nullable = false)
    private UUID sourceId;

    @Column(name = "retrieval_timestamp", nullable = false)
    private OffsetDateTime retrievalTimestamp;

    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt = OffsetDateTime.now();

    public UUID getId() { return id; }
    public String getCountry() { return country; }
    public String getAgency() { return agency; }
    public String getRating() { return rating; }
    public String getOutlook() { return outlook; }
    public LocalDate getRatingDate() { return ratingDate; }
    public boolean isCurrent() { return isCurrent; }
    public UUID getSourceId() { return sourceId; }
    public OffsetDateTime getRetrievalTimestamp() { return retrievalTimestamp; }
}

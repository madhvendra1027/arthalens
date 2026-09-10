package com.arthalens.api.domain.sources.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import java.time.*;
import java.util.UUID;

@Entity
@Table(name = "sources")
public class Source {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "authority", nullable = false)
    private String authority;

    @Column(name = "canonical_url", nullable = false)
    private String canonicalUrl;

    @Column(name = "update_frequency")
    private String updateFrequency;

    @Column(name = "last_successful_retrieval")
    private OffsetDateTime lastSuccessfulRetrieval;

    @Column(name = "last_observed_pub_date")
    private LocalDate lastObservedPubDate;

    @Column(name = "is_active", nullable = false)
    private boolean isActive = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt = OffsetDateTime.now();

    // Getters
    public UUID getId() { return id; }
    public String getName() { return name; }
    public String getAuthority() { return authority; }
    public String getCanonicalUrl() { return canonicalUrl; }
    public String getUpdateFrequency() { return updateFrequency; }
    public OffsetDateTime getLastSuccessfulRetrieval() { return lastSuccessfulRetrieval; }
    public LocalDate getLastObservedPubDate() { return lastObservedPubDate; }
    public boolean isActive() { return isActive; }
}

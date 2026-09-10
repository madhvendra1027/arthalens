package com.arthalens.api.domain.methodology.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "base_years")
public class BaseYear {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "year_label", nullable = false, unique = true)
    private String yearLabel;

    @Column(name = "description")
    private String description;

    @Column(name = "is_current", nullable = false)
    private boolean isCurrent;

    @Column(name = "effective_from")
    private LocalDate effectiveFrom;

    @Column(name = "deprecated_on")
    private LocalDate deprecatedOn;

    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt = OffsetDateTime.now();

    // Getters
    public UUID getId() { return id; }
    public String getYearLabel() { return yearLabel; }
    public String getDescription() { return description; }
    public boolean isCurrent() { return isCurrent; }
    public LocalDate getEffectiveFrom() { return effectiveFrom; }
    public LocalDate getDeprecatedOn() { return deprecatedOn; }
}

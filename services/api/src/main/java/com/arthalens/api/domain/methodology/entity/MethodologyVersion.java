package com.arthalens.api.domain.methodology.entity;

import jakarta.persistence.*;
import java.time.*;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "methodology_versions")
public class MethodologyVersion {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "base_year_id", nullable = false)
    private UUID baseYearId;

    @Column(name = "version_label", nullable = false)
    private String versionLabel;

    @Column(name = "deflation_method", nullable = false)
    private String deflationMethod;

    @ElementCollection
    @CollectionTable(name = "methodology_versions", joinColumns = @JoinColumn(name = "id"))
    @Column(name = "primary_data_sources")
    private List<String> primaryDataSources;

    @Column(name = "coverage_from")
    private String coverageFrom;

    @Column(name = "coverage_to")
    private String coverageTo;

    @ElementCollection
    @CollectionTable(name = "methodology_versions", joinColumns = @JoinColumn(name = "id"))
    @Column(name = "key_changes")
    private List<String> keyChanges;

    @Column(name = "release_date")
    private LocalDate releaseDate;

    @Column(name = "notes")
    private String notes;

    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt = OffsetDateTime.now();

    public UUID getId() { return id; }
    public UUID getBaseYearId() { return baseYearId; }
    public String getVersionLabel() { return versionLabel; }
    public String getDeflationMethod() { return deflationMethod; }
    public List<String> getPrimaryDataSources() { return primaryDataSources; }
    public String getCoverageFrom() { return coverageFrom; }
    public String getCoverageTo() { return coverageTo; }
    public List<String> getKeyChanges() { return keyChanges; }
    public LocalDate getReleaseDate() { return releaseDate; }
    public String getNotes() { return notes; }
}

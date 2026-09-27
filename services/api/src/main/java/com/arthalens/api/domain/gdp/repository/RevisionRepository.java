package com.arthalens.api.domain.gdp.repository;

import com.arthalens.api.domain.gdp.entity.Revision;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface RevisionRepository extends JpaRepository<Revision, UUID> {

    List<Revision> findByEntityTypeOrderByRevisionDateAscRevisionSequenceAsc(String entityType);

    List<Revision> findByEntityTypeAndEntityIdOrderByRevisionDateAscRevisionSequenceAsc(
            String entityType, UUID entityId);
}

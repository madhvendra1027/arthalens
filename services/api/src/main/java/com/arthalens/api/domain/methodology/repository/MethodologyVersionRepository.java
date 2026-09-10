package com.arthalens.api.domain.methodology.repository;

import com.arthalens.api.domain.methodology.entity.MethodologyVersion;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface MethodologyVersionRepository extends JpaRepository<MethodologyVersion, UUID> {
    List<MethodologyVersion> findByBaseYearIdOrderByReleaseDateDesc(UUID baseYearId);
}

package com.arthalens.api.domain.methodology.repository;

import com.arthalens.api.domain.methodology.entity.BaseYear;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface BaseYearRepository extends JpaRepository<BaseYear, UUID> {
    Optional<BaseYear> findByYearLabel(String yearLabel);
    Optional<BaseYear> findByIsCurrentTrue();
}

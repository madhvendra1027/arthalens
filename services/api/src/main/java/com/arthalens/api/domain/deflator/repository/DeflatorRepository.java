package com.arthalens.api.domain.deflator.repository;

import com.arthalens.api.domain.deflator.entity.DeflatorObservation;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface DeflatorRepository extends JpaRepository<DeflatorObservation, UUID> {
    List<DeflatorObservation> findByBaseYearIdOrderByPeriodLabelDesc(UUID baseYearId);
    List<DeflatorObservation> findByDeflatorTypeAndBaseYearIdOrderByPeriodLabelDesc(String type, UUID baseYearId);
}

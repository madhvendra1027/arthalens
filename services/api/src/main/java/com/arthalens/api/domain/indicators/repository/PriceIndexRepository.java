package com.arthalens.api.domain.indicators.repository;

import com.arthalens.api.domain.indicators.entity.PriceIndex;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface PriceIndexRepository extends JpaRepository<PriceIndex, UUID> {
    List<PriceIndex> findByIndexTypeOrderByPeriodLabelDesc(String indexType);
    List<PriceIndex> findAllByOrderByIndexTypeAscPeriodLabelDesc();
}

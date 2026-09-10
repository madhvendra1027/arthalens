package com.arthalens.api.domain.deflator.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record DeflatorDto(
    UUID id,
    String deflatorType,
    String periodLabel,
    BigDecimal deflatorValue,
    String baseYear,
    String status,
    LocalDate publicationDate
) {}

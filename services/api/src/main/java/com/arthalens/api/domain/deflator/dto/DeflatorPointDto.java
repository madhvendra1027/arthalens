package com.arthalens.api.domain.deflator.dto;

import java.math.BigDecimal;

public record DeflatorPointDto(
    String period,
    BigDecimal gdpDeflator,
    BigDecimal cpi,
    BigDecimal wpi
) {}

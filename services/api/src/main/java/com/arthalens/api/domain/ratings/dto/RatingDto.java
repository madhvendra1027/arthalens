package com.arthalens.api.domain.ratings.dto;

import java.time.LocalDate;
import java.util.UUID;

public record RatingDto(
    UUID id,
    String country,
    String agency,
    String rating,
    String outlook,
    LocalDate ratingDate,
    boolean isCurrent
) {}

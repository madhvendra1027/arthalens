package com.arthalens.api.domain.ratings.dto;

import java.util.List;

public record RatingsResponse(
    List<RatingDto> data,
    List<RatingDto> current,
    List<RatingDto> history,
    String note
) {
    public RatingsResponse(List<RatingDto> current, List<RatingDto> history, String note) {
        this(current, current, history, note);
    }
}


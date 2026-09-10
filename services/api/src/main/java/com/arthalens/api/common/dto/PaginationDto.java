package com.arthalens.api.common.dto;

public record PaginationDto(
    int page,
    int size,
    long totalElements,
    int totalPages
) {}

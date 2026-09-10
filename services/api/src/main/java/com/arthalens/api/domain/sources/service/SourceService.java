package com.arthalens.api.domain.sources.service;

import com.arthalens.api.common.exception.ResourceNotFoundException;
import com.arthalens.api.domain.sources.dto.SourceDto;
import com.arthalens.api.domain.sources.entity.Source;
import com.arthalens.api.domain.sources.repository.SourceRepository;
import org.springframework.stereotype.Service;
import java.util.UUID;

@Service
public class SourceService {

    private final SourceRepository repo;

    public SourceService(SourceRepository repo) {
        this.repo = repo;
    }

    public SourceDto getById(UUID id) {
        return repo.findById(id)
                .map(this::toDto)
                .orElseThrow(() -> new ResourceNotFoundException("Source", id.toString()));
    }

    private SourceDto toDto(Source s) {
        return new SourceDto(
                s.getId(), s.getName(), s.getAuthority(), s.getCanonicalUrl(),
                s.getUpdateFrequency(), s.getLastSuccessfulRetrieval(), s.getLastObservedPubDate());
    }
}

package com.pojong.code_challenge.service;



import com.pojong.code_challenge.controller.dto.MetadataDto;
import reactor.core.publisher.Mono;

public interface CodeChallengeService {
    Mono<Boolean> create(String query);

    Mono<MetadataDto> getMetadata(String query);

    Mono<byte[]> getImageData(String query);
}

package com.pojong.code_challenge.repository;

import com.pojong.code_challenge.repository.entity.Metadata;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import reactor.core.publisher.Mono;

public interface MetadataRepository extends R2dbcRepository<Metadata, Integer> {

    @Query("SELECT * FROM metadata WHERE query_string = :queryString")
    Mono<Metadata> findByQueryString(String queryString);

    @Query("SELECT CASE WHECT count(c)> 0 then true else false end from metadata c where c.query_string = :queryString")
    Mono<Boolean> existsQueryString(String queryString);
}

package com.pojong.code_challenge.repository;

import com.pojong.code_challenge.repository.entity.Images;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import reactor.core.publisher.Mono;

public interface ImagesRepository extends R2dbcRepository<Images, Integer> {

    @Query("SELECT * FROM images WHERE query_string = :queryString")
    Mono<Images> findByQueryString(String queryString);
}

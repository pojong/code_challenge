package com.pojong.code_challenge.repository.entity;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;


@Getter
@Setter
@Builder
@Table("metadata")
public class Metadata {
    @Id
    Integer id;

    String queryString;
    String metadataName;
    String artistName;
    String albumName;
    String albumId;
    Boolean isExplicit;
    Long playBackSeconds;
}

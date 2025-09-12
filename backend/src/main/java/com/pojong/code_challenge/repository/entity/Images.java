package com.pojong.code_challenge.repository.entity;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

@Getter
@Setter
@Builder
@Table("images")
public class Images {

    @Id
    Integer id;
    String queryString;
    byte[] image;
}

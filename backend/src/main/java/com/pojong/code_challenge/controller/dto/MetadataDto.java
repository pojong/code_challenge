package com.pojong.code_challenge.controller.dto;

public record MetadataDto(String queryString, String name, String artistName, String albumName, String albumId, Boolean isExplicit, Long playBackSeconds) {
}

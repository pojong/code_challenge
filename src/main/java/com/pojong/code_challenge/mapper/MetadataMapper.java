package com.pojong.code_challenge.mapper;


import com.pojong.code_challenge.controller.dto.MetadataDto;
import com.pojong.code_challenge.repository.entity.ImageRecord;
import com.pojong.code_challenge.repository.entity.Metadata;
import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import se.michaelthelin.spotify.model_objects.specification.AlbumSimplified;
import se.michaelthelin.spotify.model_objects.specification.Image;
import se.michaelthelin.spotify.model_objects.specification.Track;

import java.util.Arrays;
import java.util.Collection;
import java.util.LinkedHashSet;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface MetadataMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "metadataName", source = "name")
    @Mapping(target = "isExplicit", source = "isExplicit")
    @Mapping(target = "playBackSeconds", source = "durationMs")
    Metadata toModel(Track track);


    @Mapping(target = "name", source = "metadataName")
    @Mapping(target = "artistName", source = "artistName")
    @Mapping(target = "albumName", source = "albumName")
    @Mapping(target = "albumId", source = "albumId")
    @Mapping(target = "isExplicit", source = "isExplicit")
    @Mapping(target = "playBackSeconds", source = "playBackSeconds")
    MetadataDto toDto(Metadata metadata);

    @AfterMapping
    default void afterMapping(Track track, @MappingTarget Metadata metadata) {
        metadata.setArtistName(track.getArtists()[0].getName());
        metadata.setAlbumName(track.getAlbum().getName());
        metadata.setAlbumId(track.getAlbum().getId());
    }

    default Collection<ImageRecord> toImageRecord(AlbumSimplified albumId) {
        if(albumId.getImages() == null) {
            return new LinkedHashSet<>();
        }
        Collection<Image> imageIds = Arrays.asList(albumId.getImages());
        return imageIds.stream()
                .map(tag -> new ImageRecord(tag.getUrl(),tag.getHeight(),tag.getWidth()))
                .collect(Collectors.toSet());
    }
}

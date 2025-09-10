package com.pojong.code_challenge.service.impl;

import com.pojong.code_challenge.controller.dto.MetadataDto;
import com.pojong.code_challenge.exception.MetadataNotFoundException;
import com.pojong.code_challenge.repository.entity.ImageRecord;
import com.pojong.code_challenge.mapper.MetadataMapper;
import com.pojong.code_challenge.repository.ImagesRepository;
import com.pojong.code_challenge.repository.MetadataRepository;
import com.pojong.code_challenge.repository.entity.Images;
import com.pojong.code_challenge.repository.entity.Metadata;
import com.pojong.code_challenge.service.CodeChallengeService;
import com.pojong.code_challenge.utils.ImageDownloader;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.apache.hc.core5.http.ParseException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Mono;
import se.michaelthelin.spotify.SpotifyApi;
import se.michaelthelin.spotify.exceptions.SpotifyWebApiException;
import se.michaelthelin.spotify.model_objects.specification.Paging;
import se.michaelthelin.spotify.model_objects.specification.Track;
import se.michaelthelin.spotify.requests.data.search.simplified.SearchTracksRequest;

import java.io.IOException;
import java.util.Collection;
import java.util.Iterator;

@Service
@RequiredArgsConstructor
public class CodeChallengeImpl implements CodeChallengeService {
    private static final Logger logger = LoggerFactory.getLogger(CodeChallengeImpl.class);

    private final SpotifyApi spotifyApi;
    private final MetadataMapper metadataMapper;
    private final ImagesRepository imagesRepository;
    private final MetadataRepository metadataRepository;

    @Override
    public Mono<Boolean> create(String query) {
        Metadata metadata = searchApi(query);
        if(metadata != null) {
            metadataRepository.save(metadata).subscribe();
        }
        return Mono.just(true);
    }

    @Override
    public Mono<MetadataDto> getMetadata(String query) {
        return metadataRepository.findByQueryString(query).map(metadataMapper::toDto);
    }

    @Override
    public Mono<byte[]> getImageData(String query) {
        return imagesRepository.findByQueryString(query).map(Images::getImage);
    }

    private Metadata searchApi(String query) {
        Metadata metadata = null;
        try {
            SearchTracksRequest searchItemRequest = spotifyApi.searchTracks(query)
                    .limit(10)
                    .build();
            Paging<Track> searchResult = searchItemRequest.execute();
            logger.info("Total tracks: " + searchResult.getTotal());
            Track track = searchResult.getItems()[0];
            if(track != null) {
                metadata = metadataMapper.toModel(track);
                Collection<ImageRecord> imageRecords = metadataMapper.toImageRecord(track.getAlbum());
                downloadImage(imageRecords, query);
                metadata.setQueryString(query);
            }
        } catch (IOException | SpotifyWebApiException | ParseException e) {
            logger.error("Error searching for tracks by ISRC: " + query, e);
        }
        return metadata;
    }

    private void downloadImage(Collection<ImageRecord> imageRecords, String query) {
        Iterator<ImageRecord> iterator = imageRecords.iterator();
        while(iterator.hasNext()) {
            ImageRecord imageRecord = iterator.next();
            if(!imageRecord.url().isEmpty() && imageRecord.height() > 500 && imageRecord.width() > 500) {
                try {
                    byte[] downloadeded = ImageDownloader.downloadImage(imageRecord.url());
                    imagesRepository.save(Images.builder()
                                    .image(downloadeded)
                                    .queryString(query)
                                    .build())
                            .subscribe();
                } catch (IOException e) {
                    logger.error("Error downloading image: " + imageRecord.url(), e);
                }
            }

        }
    }

    private Mono<Boolean> verifyExistence(String query) {
        return metadataRepository.existsQueryString(query).handle((exists, sink) -> {
            if (Boolean.FALSE.equals(exists)) {
                sink.error(new MetadataNotFoundException("queryString not found"));
            } else {
                sink.next(exists);
            }
        });
    }
}

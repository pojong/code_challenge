package com.pojong.code_challenge.controller;

import com.pojong.code_challenge.controller.dto.MetadataDto;
import com.pojong.code_challenge.service.CodeChallengeService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import static org.springframework.util.MimeTypeUtils.APPLICATION_JSON_VALUE;

@RestController
@RequestMapping(value = "/code_challenge")
@RequiredArgsConstructor
public class CodeChallengeController {

    private final CodeChallengeService codeChallengeService;

    @PostMapping
    public Mono<Boolean> create(String query) {
        return codeChallengeService.create(query);
    }

    @GetMapping("/getTrackMetadata")
    public Mono<MetadataDto> getTrackMetadata(@RequestParam(value = "src", required = true, defaultValue = "USMC18620549") String src) {
        return codeChallengeService.getMetadata(src);
    }

    @GetMapping("/getCover")
    public Mono<ResponseEntity<Resource>> getCover(@RequestParam(value = "src", required = true, defaultValue = "USMC18620549") String src) {
        return codeChallengeService.getImageData(src)
                .map(imageData -> {
                    ByteArrayResource resource = new ByteArrayResource(imageData);
                    return ResponseEntity.ok()
                            .contentType(MediaType.IMAGE_JPEG) // Adjust based on actual image type
                            .body(resource);
                });
    }

}

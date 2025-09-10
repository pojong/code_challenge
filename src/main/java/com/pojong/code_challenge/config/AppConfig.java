package com.pojong.code_challenge.config;

import org.apache.hc.core5.http.ParseException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import se.michaelthelin.spotify.SpotifyApi;
import se.michaelthelin.spotify.SpotifyHttpManager;
import se.michaelthelin.spotify.exceptions.SpotifyWebApiException;
import se.michaelthelin.spotify.model_objects.credentials.ClientCredentials;
import se.michaelthelin.spotify.requests.authorization.client_credentials.ClientCredentialsRequest;

import java.io.IOException;
import java.net.URI;
import java.time.Instant;

@Configuration
public class AppConfig {
    private static final Logger logger = LoggerFactory.getLogger(AppConfig.class);

    @Value("${spotify.client-id}")
    private String clientId;

    @Value("${spotify.client-secret}")
    private String clientSecret;

    @Value("${spotify.redirect-uri}")
    private String redirect;

    // A simple POJO to hold token + expiry if you later want to refresh proactively.
    static class TokenState {
        String accessToken;
        Instant expiresAt;
    }

    @Bean
    public SpotifyApi spotifyApi(){
        final URI redirectUri = SpotifyHttpManager.makeUri(redirect);
        SpotifyApi api = new SpotifyApi.Builder()
                .setClientId(clientId)
                .setClientSecret(clientSecret)
                .setRedirectUri(redirectUri)
                .build();

        try {
            ClientCredentialsRequest clientCredentialsRequest = api.clientCredentials()
                    .build();

            ClientCredentials clientCredentials = clientCredentialsRequest.execute();
            String accessToken = clientCredentials.getAccessToken();
            api.setAccessToken(accessToken);

            // Optional: store token expiry if you want to refresh proactively
            TokenState state = new TokenState();
            state.accessToken = accessToken;
            if (clientCredentials.getExpiresIn() != null) {
                state.expiresAt = Instant.now().plusSeconds(clientCredentials.getExpiresIn());
                logger.info("Obtained Spotify client credentials token, expires at {}", state.expiresAt);
            } else {
                logger.info("Obtained Spotify client credentials token");
            }

        } catch (IOException | SpotifyWebApiException | ParseException e) {
            logger.error("Error initializing Spotify web client using Client Credentials flow", e);
            // Consider rethrowing a RuntimeException here to prevent the app from starting in a broken state:
            // throw new IllegalStateException("Failed to initialize Spotify API client", e);
        }
        return api;
    }

}
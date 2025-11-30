package com.example.analyster.service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
public class TokenService {

	private final JwtEncoder jwtEncoder;
	private final String issuer;
	private final long accessTokenTtlSeconds;

	public TokenService(JwtEncoder jwtEncoder,
			@Value("${analyster.jwt.issuer:analyster}") String issuer,
			@Value("${analyster.jwt.access-ttl-seconds:14400}") long accessTokenTtlSeconds) {
		this.jwtEncoder = jwtEncoder;
		this.issuer = issuer;
		this.accessTokenTtlSeconds = accessTokenTtlSeconds;
	}

	public String generateAccessToken(String subject) {
		if (!StringUtils.hasText(subject)) {
			throw new IllegalArgumentException("subject is required");
		}
		var now = Instant.now();
		JwtClaimsSet claims = JwtClaimsSet.builder()
				.issuer(issuer)
				.issuedAt(now)
				.expiresAt(now.plus(accessTokenTtlSeconds, ChronoUnit.SECONDS))
				.subject(subject)
				.claim("scope", "api")
				.build();
		JwsHeader headers = JwsHeader.with(() -> "HS256").build();
		JwtEncoderParameters params = JwtEncoderParameters.from(headers, claims);
		return jwtEncoder.encode(params).getTokenValue();
	}

	public long getAccessTokenTtlSeconds() {
		return accessTokenTtlSeconds;
	}
}

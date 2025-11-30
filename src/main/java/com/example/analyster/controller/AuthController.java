package com.example.analyster.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.example.analyster.model.User;
import com.example.analyster.repository.UserRepository;
import com.example.analyster.service.TokenService;

@RestController
@RequestMapping("/auth")
public class AuthController {

	private final TokenService tokenService;
	private final UserRepository userRepository;

	public AuthController(TokenService tokenService, UserRepository userRepository) {
		this.tokenService = tokenService;
		this.userRepository = userRepository;
	}

	@PostMapping("/login")
	@ResponseStatus(HttpStatus.OK)
	public TokenResponse login(@RequestBody LoginRequest request) {
		if (request == null || request.username() == null || request.username().isBlank()) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "username is required");
		}
		var user = userRepository.findAll().stream()
				.filter(u -> request.username().equalsIgnoreCase(u.getUsername()))
				.findFirst()
				.orElseGet(() -> createUser(request.username(), request.displayName()));

		var token = tokenService.generateAccessToken(user.getUsername());
		return new TokenResponse("Bearer", token, tokenService.getAccessTokenTtlSeconds());
	}

	private User createUser(String username, String displayName) {
		var user = new User();
		user.setUsername(username);
		user.setDisplayName(displayName != null && !displayName.isBlank() ? displayName : username);
		return userRepository.save(user);
	}

	public record LoginRequest(String username, String displayName) {
	}

	public record TokenResponse(String tokenType, String accessToken, long expiresInSeconds) {
	}
}

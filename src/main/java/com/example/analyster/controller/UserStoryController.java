package com.example.analyster.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.example.analyster.model.UserStory;
import com.example.analyster.repository.UserStoryRepository;

@RestController
@RequestMapping("/api/user-stories")
public class UserStoryController {

	private final UserStoryRepository userStoryRepository;

	public UserStoryController(UserStoryRepository userStoryRepository) {
		this.userStoryRepository = userStoryRepository;
	}

	@GetMapping
	public List<UserStory> list() {
		return userStoryRepository.findAll();
	}

	@GetMapping("/{id}")
	public UserStory get(@PathVariable Long id) {
		return userStoryRepository.findById(id)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
	}

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	public UserStory create(@RequestBody UserStory userStory) {
		userStory.setId(null);
		return userStoryRepository.save(userStory);
	}

	@PutMapping("/{id}")
	public UserStory update(@PathVariable Long id, @RequestBody UserStory userStory) {
		if (!userStoryRepository.existsById(id)) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND);
		}
		userStory.setId(id);
		return userStoryRepository.save(userStory);
	}

	@DeleteMapping("/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void delete(@PathVariable Long id) {
		if (!userStoryRepository.existsById(id)) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND);
		}
		userStoryRepository.deleteById(id);
	}
}

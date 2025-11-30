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

import com.example.analyster.model.Requirement;
import com.example.analyster.repository.RequirementRepository;

@RestController
@RequestMapping("/api/requirements")
public class RequirementController {

	private final RequirementRepository requirementRepository;

	public RequirementController(RequirementRepository requirementRepository) {
		this.requirementRepository = requirementRepository;
	}

	@GetMapping
	public List<Requirement> list() {
		return requirementRepository.findAll();
	}

	@GetMapping("/{id}")
	public Requirement get(@PathVariable Long id) {
		return requirementRepository.findById(id)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
	}

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	public Requirement create(@RequestBody Requirement requirement) {
		requirement.setId(null);
		return requirementRepository.save(requirement);
	}

	@PutMapping("/{id}")
	public Requirement update(@PathVariable Long id, @RequestBody Requirement requirement) {
		if (!requirementRepository.existsById(id)) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND);
		}
		requirement.setId(id);
		return requirementRepository.save(requirement);
	}

	@DeleteMapping("/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void delete(@PathVariable Long id) {
		if (!requirementRepository.existsById(id)) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND);
		}
		requirementRepository.deleteById(id);
	}
}

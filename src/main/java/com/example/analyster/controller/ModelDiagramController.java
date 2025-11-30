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

import com.example.analyster.model.ModelDiagram;
import com.example.analyster.repository.ModelDiagramRepository;

@RestController
@RequestMapping("/api/models")
public class ModelDiagramController {

	private final ModelDiagramRepository modelDiagramRepository;

	public ModelDiagramController(ModelDiagramRepository modelDiagramRepository) {
		this.modelDiagramRepository = modelDiagramRepository;
	}

	@GetMapping
	public List<ModelDiagram> list() {
		return modelDiagramRepository.findAll();
	}

	@GetMapping("/{id}")
	public ModelDiagram get(@PathVariable Long id) {
		return modelDiagramRepository.findById(id)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
	}

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	public ModelDiagram create(@RequestBody ModelDiagram modelDiagram) {
		modelDiagram.setId(null);
		return modelDiagramRepository.save(modelDiagram);
	}

	@PutMapping("/{id}")
	public ModelDiagram update(@PathVariable Long id, @RequestBody ModelDiagram modelDiagram) {
		if (!modelDiagramRepository.existsById(id)) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND);
		}
		modelDiagram.setId(id);
		return modelDiagramRepository.save(modelDiagram);
	}

	@DeleteMapping("/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void delete(@PathVariable Long id) {
		if (!modelDiagramRepository.existsById(id)) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND);
		}
		modelDiagramRepository.deleteById(id);
	}
}

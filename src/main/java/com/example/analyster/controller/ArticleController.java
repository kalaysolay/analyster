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

import com.example.analyster.model.Article;
import com.example.analyster.repository.ArticleRepository;

@RestController
@RequestMapping("/api/articles")
public class ArticleController {

	private final ArticleRepository articleRepository;

	public ArticleController(ArticleRepository articleRepository) {
		this.articleRepository = articleRepository;
	}

	@GetMapping
	public List<Article> list() {
		return articleRepository.findAll();
	}

	@GetMapping("/{id}")
	public Article get(@PathVariable Long id) {
		return articleRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
	}

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	public Article create(@RequestBody Article article) {
		article.setId(null);
		return articleRepository.save(article);
	}

	@PutMapping("/{id}")
	public Article update(@PathVariable Long id, @RequestBody Article article) {
		if (!articleRepository.existsById(id)) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND);
		}
		article.setId(id);
		return articleRepository.save(article);
	}

	@DeleteMapping("/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void delete(@PathVariable Long id) {
		if (!articleRepository.existsById(id)) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND);
		}
		articleRepository.deleteById(id);
	}
}

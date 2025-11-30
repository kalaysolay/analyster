package com.example.analyster.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.analyster.model.Article;

public interface ArticleRepository extends JpaRepository<Article, Long> {
}

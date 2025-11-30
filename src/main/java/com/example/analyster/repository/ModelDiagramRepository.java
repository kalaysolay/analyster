package com.example.analyster.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.analyster.model.ModelDiagram;

public interface ModelDiagramRepository extends JpaRepository<ModelDiagram, Long> {
}

package com.example.analyster.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.analyster.model.Project;

public interface ProjectRepository extends JpaRepository<Project, Long> {
}

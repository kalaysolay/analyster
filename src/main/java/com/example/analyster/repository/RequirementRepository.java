package com.example.analyster.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.analyster.model.Requirement;

public interface RequirementRepository extends JpaRepository<Requirement, Long> {
}

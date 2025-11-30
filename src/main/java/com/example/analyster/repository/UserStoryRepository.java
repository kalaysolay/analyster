package com.example.analyster.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.analyster.model.UserStory;

public interface UserStoryRepository extends JpaRepository<UserStory, Long> {
}

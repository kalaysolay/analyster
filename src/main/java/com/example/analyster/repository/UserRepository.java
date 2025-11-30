package com.example.analyster.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.analyster.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
}

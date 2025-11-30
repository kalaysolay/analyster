package com.example.analyster;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class AnalysterApplication {

	public static void main(String[] args) {
		SpringApplication.run(AnalysterApplication.class, args);
	}

}

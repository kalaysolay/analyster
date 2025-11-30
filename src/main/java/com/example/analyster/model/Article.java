package com.example.analyster.model;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;

@Entity
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class Article extends BaseEntity {

	@Column(nullable = false)
	private String title;

	@Column(nullable = false, length = 10000)
	private String body;

	@ManyToOne
	private User author;

	private String type;

	private String category;

	@ManyToOne
	private Project project;

	public String getTitle() {
		return title;
	}

	public String getBody() {
		return body;
	}

	public User getAuthor() {
		return author;
	}

	public String getType() {
		return type;
	}

	public String getCategory() {
		return category;
	}

	public Project getProject() {
		return project;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public void setBody(String body) {
		this.body = body;
	}

	public void setAuthor(User author) {
		this.author = author;
	}

	public void setType(String type) {
		this.type = type;
	}

	public void setCategory(String category) {
		this.category = category;
	}

	public void setProject(Project project) {
		this.project = project;
	}
}

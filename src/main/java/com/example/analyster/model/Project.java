package com.example.analyster.model;

import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;

@Entity
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class Project extends BaseEntity {

	@Column(nullable = false)
	private String name;

	@Column
	private String gitUrl;

	@Column(length = 4000)
	private String description;

	@Column(nullable = false)
	private String authorName;

	@OneToMany(mappedBy = "project")
	private Set<UserStory> userStories = new HashSet<>();

	@OneToMany(mappedBy = "project")
	private Set<Requirement> requirements = new HashSet<>();

	@OneToMany(mappedBy = "project")
	private Set<Article> articles = new HashSet<>();

	@OneToMany(mappedBy = "project")
	private Set<ModelDiagram> models = new HashSet<>();

	public String getName() {
		return name;
	}

	public String getGitUrl() {
		return gitUrl;
	}

	public String getDescription() {
		return description;
	}

	public String getAuthorName() {
		return authorName;
	}

	public Set<UserStory> getUserStories() {
		return userStories;
	}

	public Set<Requirement> getRequirements() {
		return requirements;
	}

	public Set<Article> getArticles() {
		return articles;
	}

	public Set<ModelDiagram> getModels() {
		return models;
	}

	public void setName(String name) {
		this.name = name;
	}

	public void setGitUrl(String gitUrl) {
		this.gitUrl = gitUrl;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public void setAuthorName(String authorName) {
		this.authorName = authorName;
	}

	public void setUserStories(Set<UserStory> userStories) {
		this.userStories = userStories;
	}

	public void setRequirements(Set<Requirement> requirements) {
		this.requirements = requirements;
	}

	public void setArticles(Set<Article> articles) {
		this.articles = articles;
	}

	public void setModels(Set<ModelDiagram> models) {
		this.models = models;
	}
}

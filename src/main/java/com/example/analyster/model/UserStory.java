package com.example.analyster.model;

import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;

@Entity
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class UserStory extends BaseEntity {

	@Column(nullable = false, length = 4000)
	private String statement;

	@Column(nullable = false)
	private String owner;

	@Enumerated(EnumType.STRING)
	private Priority priority = Priority.MEDIUM;

	@ManyToMany
	@JoinTable(name = "user_story_requirements",
			joinColumns = @JoinColumn(name = "user_story_id"),
			inverseJoinColumns = @JoinColumn(name = "requirement_id"))
	private Set<Requirement> requirements = new HashSet<>();

	@ManyToOne
	private Project project;

	@ElementCollection
	private Set<String> tags = new HashSet<>();

	public String getStatement() {
		return statement;
	}

	public String getOwner() {
		return owner;
	}

	public Priority getPriority() {
		return priority;
	}

	public Set<Requirement> getRequirements() {
		return requirements;
	}

	public Project getProject() {
		return project;
	}

	public Set<String> getTags() {
		return tags;
	}

	public void setStatement(String statement) {
		this.statement = statement;
	}

	public void setOwner(String owner) {
		this.owner = owner;
	}

	public void setPriority(Priority priority) {
		this.priority = priority;
	}

	public void setRequirements(Set<Requirement> requirements) {
		this.requirements = requirements;
	}

	public void setProject(Project project) {
		this.project = project;
	}

	public void setTags(Set<String> tags) {
		this.tags = tags;
	}
}

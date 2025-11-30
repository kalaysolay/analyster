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
public class Requirement extends BaseEntity {

	@Column(nullable = false, length = 4000)
	private String description;

	@Column(nullable = false)
	private String title;

	@Enumerated(EnumType.STRING)
	private RequirementType type = RequirementType.FUNCTIONAL;

	@ManyToMany(mappedBy = "requirements")
	private Set<UserStory> userStories = new HashSet<>();

	@ManyToMany
	@JoinTable(name = "requirement_trace",
			joinColumns = @JoinColumn(name = "requirement_id"),
			inverseJoinColumns = @JoinColumn(name = "related_requirement_id"))
	private Set<Requirement> relatedRequirements = new HashSet<>();

	@ManyToMany(mappedBy = "relatedRequirements")
	private Set<Requirement> tracingBack = new HashSet<>();

	@Enumerated(EnumType.STRING)
	private RequirementStatus status = RequirementStatus.DRAFT;

	@Column(length = 1000)
	private String source;

	@ManyToOne
	private User owner;

	@Column(nullable = false)
	private Integer version = 1;

	@ManyToOne
	private Project project;

	@ElementCollection
	private Set<String> tags = new HashSet<>();

	public String getDescription() {
		return description;
	}

	public String getTitle() {
		return title;
	}

	public RequirementType getType() {
		return type;
	}

	public Set<UserStory> getUserStories() {
		return userStories;
	}

	public Set<Requirement> getRelatedRequirements() {
		return relatedRequirements;
	}

	public Set<Requirement> getTracingBack() {
		return tracingBack;
	}

	public RequirementStatus getStatus() {
		return status;
	}

	public String getSource() {
		return source;
	}

	public User getOwner() {
		return owner;
	}

	public Integer getVersion() {
		return version;
	}

	public Project getProject() {
		return project;
	}

	public Set<String> getTags() {
		return tags;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public void setType(RequirementType type) {
		this.type = type;
	}

	public void setUserStories(Set<UserStory> userStories) {
		this.userStories = userStories;
	}

	public void setRelatedRequirements(Set<Requirement> relatedRequirements) {
		this.relatedRequirements = relatedRequirements;
	}

	public void setTracingBack(Set<Requirement> tracingBack) {
		this.tracingBack = tracingBack;
	}

	public void setStatus(RequirementStatus status) {
		this.status = status;
	}

	public void setSource(String source) {
		this.source = source;
	}

	public void setOwner(User owner) {
		this.owner = owner;
	}

	public void setVersion(Integer version) {
		this.version = version;
	}

	public void setProject(Project project) {
		this.project = project;
	}

	public void setTags(Set<String> tags) {
		this.tags = tags;
	}
}

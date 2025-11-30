package com.example.analyster.model;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;

@Entity
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class ModelDiagram extends BaseEntity {

	@Column(nullable = false)
	private String name;

	@ElementCollection
	private List<String> attachments = new ArrayList<>();

	@Column(nullable = false, length = 8000)
	private String plantUmlSource;

	@Column(nullable = false)
	private Integer version = 1;

	@ManyToOne
	private Project project;

	public String getName() {
		return name;
	}

	public List<String> getAttachments() {
		return attachments;
	}

	public String getPlantUmlSource() {
		return plantUmlSource;
	}

	public Integer getVersion() {
		return version;
	}

	public Project getProject() {
		return project;
	}

	public void setName(String name) {
		this.name = name;
	}

	public void setAttachments(List<String> attachments) {
		this.attachments = attachments;
	}

	public void setPlantUmlSource(String plantUmlSource) {
		this.plantUmlSource = plantUmlSource;
	}

	public void setVersion(Integer version) {
		this.version = version;
	}

	public void setProject(Project project) {
		this.project = project;
	}
}

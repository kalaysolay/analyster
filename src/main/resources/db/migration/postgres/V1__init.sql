-- Users
CREATE TABLE app_user (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    username VARCHAR(255) NOT NULL UNIQUE,
    display_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL
);

-- Projects
CREATE TABLE project (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    name VARCHAR(255) NOT NULL,
    git_url VARCHAR(1024),
    description TEXT,
    author_name VARCHAR(255) NOT NULL
);

-- Articles
CREATE TABLE article (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    title VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    author_id BIGINT REFERENCES app_user(id),
    type VARCHAR(255),
    category VARCHAR(255),
    project_id BIGINT REFERENCES project(id)
);

-- Requirements
CREATE TABLE requirement (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    description TEXT NOT NULL,
    title VARCHAR(255) NOT NULL,
    type VARCHAR(50),
    status VARCHAR(50),
    source VARCHAR(1000),
    owner_id BIGINT REFERENCES app_user(id),
    version INTEGER NOT NULL,
    project_id BIGINT REFERENCES project(id)
);

CREATE TABLE requirement_trace (
    requirement_id BIGINT NOT NULL REFERENCES requirement(id),
    related_requirement_id BIGINT NOT NULL REFERENCES requirement(id),
    PRIMARY KEY (requirement_id, related_requirement_id)
);

CREATE TABLE requirement_tags (
    requirement_id BIGINT NOT NULL REFERENCES requirement(id),
    tags VARCHAR(255) NOT NULL
);

-- User stories
CREATE TABLE user_story (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    statement TEXT NOT NULL,
    owner VARCHAR(255) NOT NULL,
    priority VARCHAR(50),
    project_id BIGINT REFERENCES project(id)
);

CREATE TABLE user_story_requirements (
    user_story_id BIGINT NOT NULL REFERENCES user_story(id),
    requirement_id BIGINT NOT NULL REFERENCES requirement(id),
    PRIMARY KEY (user_story_id, requirement_id)
);

CREATE TABLE user_story_tags (
    user_story_id BIGINT NOT NULL REFERENCES user_story(id),
    tags VARCHAR(255) NOT NULL
);

-- Model diagrams
CREATE TABLE model_diagram (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    name VARCHAR(255) NOT NULL,
    plant_uml_source TEXT NOT NULL,
    version INTEGER NOT NULL,
    project_id BIGINT REFERENCES project(id)
);

CREATE TABLE model_diagram_attachments (
    model_diagram_id BIGINT NOT NULL REFERENCES model_diagram(id),
    attachments VARCHAR(1024) NOT NULL
);

-- Seed demo user
INSERT INTO app_user (username, display_name, role)
VALUES ('demo', 'Demo User', 'ANALYST')
ON CONFLICT (username) DO NOTHING;

(() => {
  const loginForm = document.getElementById('loginForm');
  const authOverlay = document.getElementById('authOverlay');
  const tokenInput = document.getElementById('tokenInput');
  const usernameInput = document.getElementById('usernameInput');
  const displayNameInput = document.getElementById('displayNameInput');
  const logoutBtn = document.getElementById('logoutBtn');
  const navButtons = document.querySelectorAll('.nav-btn');

  const userStoriesTableBody = document.getElementById('userStoriesTableBody');
  const userStoryDetail = document.getElementById('userStoryDetail');
  const userStoryDetailTitle = document.getElementById('userStoryDetailTitle');
  const userStoryStatement = document.getElementById('userStoryStatement');
  const userStoryOwner = document.getElementById('userStoryOwner');
  const userStoryProject = document.getElementById('userStoryProject');
  const userStoryPriority = document.getElementById('userStoryPriority');
  const userStoryRequirementsTable = document.getElementById('userStoryRequirementsTable');
  const addUserStoryBtn = document.getElementById('addUserStoryBtn');

  const userStoryForm = document.getElementById('userStoryForm');
  const userStoryModalTitle = document.getElementById('userStoryModalTitle');
  const usStatementInput = document.getElementById('usStatementInput');
  const usOwnerInput = document.getElementById('usOwnerInput');
  const usPriorityInput = document.getElementById('usPriorityInput');
  const usProjectInput = document.getElementById('usProjectInput');
  const userStoryCancelBtn = document.getElementById('userStoryCancelBtn');
  const userStorySubmitBtn = document.getElementById('userStorySubmitBtn');

  const requirementsTableBody = document.getElementById('requirementsTableBody');
  const requirementsCounter = document.getElementById('requirementsCounter');
  const requirementDetailCard = document.getElementById('requirementDetail');

  const projectsTableBody = document.getElementById('projectsTableBody');
  const projectForm = document.getElementById('projectForm');
  const projectFormTitle = document.getElementById('projectFormTitle');
  const projectSubmitBtn = document.getElementById('projectSubmitBtn');
  const projectNameInput = document.getElementById('projectNameInput');
  const projectAuthorInput = document.getElementById('projectAuthorInput');
  const projectGitInput = document.getElementById('projectGitInput');
  const projectDescriptionInput = document.getElementById('projectDescriptionInput');
  const projectCancelEditBtn = document.getElementById('projectCancelEditBtn');
  const resetProjectFormBtn = document.getElementById('resetProjectFormBtn');
  const refreshProjectsBtn = document.getElementById('refreshProjectsBtn');

  const reqTitle = document.getElementById('reqTitle');
  const reqType = document.getElementById('reqType');
  const reqDescription = document.getElementById('reqDescription');
  const reqUserStories = document.getElementById('reqUserStories');
  const reqStatus = document.getElementById('reqStatus');
  const reqSource = document.getElementById('reqSource');
  const reqOwner = document.getElementById('reqOwner');
  const reqVersion = document.getElementById('reqVersion');
  const requirementDetailTitle = document.getElementById('requirementDetailTitle');
  const traceTableBody = document.getElementById('traceTableBody');
  const addTraceBtn = document.getElementById('addTraceBtn');
  const addRequirementBtn = document.getElementById('addRequirementBtn');

  const refreshRequirementsBtn = document.getElementById('refreshRequirementsBtn');
  const refreshUserStoriesBtn = document.getElementById('refreshUserStoriesBtn');
  const refreshArticlesBtn = document.getElementById('refreshArticlesBtn');
  const prevPageBtn = document.getElementById('prevPageBtn');
  const nextPageBtn = document.getElementById('nextPageBtn');

  const articlesTableBody = document.getElementById('articlesTableBody');
  const articleDetail = document.getElementById('articleDetail');
  const articleTitle = document.getElementById('articleTitle');
  const articleUpdated = document.getElementById('articleUpdated');
  const articleContent = document.getElementById('articleContent');

  const addArticleBtn = document.getElementById('addArticleBtn');
  const articleModal = new bootstrap.Modal(document.getElementById('articleModal'));
  const articleModalTitle = document.getElementById('articleModalTitle');
  const articleForm = document.getElementById('articleForm');
  const articleTitleInput = document.getElementById('articleTitleInput');
  const articleProjectInput = document.getElementById('articleProjectInput');
  const articleEditor = document.getElementById('articleEditor');
  const articleCancelBtn = document.getElementById('articleCancelBtn');
  const articleSubmitBtn = document.getElementById('articleSubmitBtn');
  const insertCodeBtn = document.getElementById('insertCodeBtn');
  const editorButtons = document.querySelectorAll('.js-editor-btn');

  const requirementFormModal = new bootstrap.Modal(document.getElementById('requirementFormModal'));
  const requirementFormTitle = document.getElementById('requirementFormTitle');
  const requirementForm = document.getElementById('requirementForm');
  const reqTitleInput = document.getElementById('reqTitleInput');
  const reqDescriptionInput = document.getElementById('reqDescriptionInput');
  const reqTypeInput = document.getElementById('reqTypeInput');
  const reqStatusInput = document.getElementById('reqStatusInput');
  const reqVersionInput = document.getElementById('reqVersionInput');
  const reqSourceInput = document.getElementById('reqSourceInput');
  const reqProjectInput = document.getElementById('reqProjectInput');
  const reqCancelBtn = document.getElementById('reqCancelBtn');
  const reqSubmitBtn = document.getElementById('reqSubmitBtn');

  const userStoryModal = new bootstrap.Modal(document.getElementById('userStoryModal'));
  const requirementModal = new bootstrap.Modal(document.getElementById('requirementModal'));
  const addLinkModal = new bootstrap.Modal(document.getElementById('addLinkModal'));

  let state = {
    token: localStorage.getItem('authToken') || '',
    userStories: [],
    requirements: [],
    projects: [],
    articles: [],
    currentRequirement: null,
    currentUserStory: null,
    currentProject: null,
    currentArticle: null,
    reqPage: 1,
    pageSize: 10,
  };

  tokenInput.value = state.token;
  usernameInput.value = localStorage.getItem('username') || '';
  displayNameInput.value = localStorage.getItem('displayName') || '';
  toggleAuthOverlay();

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const manualToken = tokenInput.value.trim();
    if (manualToken) {
      state.token = manualToken;
      localStorage.setItem('authToken', state.token);
      toggleAuthOverlay();
      bootstrapToast('Токен сохранен. Обновляю данные...');
      refreshAll();
      return;
    }

    const username = usernameInput.value.trim();
    const displayName = displayNameInput.value.trim();
    if (!username) {
      bootstrapToast('Введите имя пользователя или токен');
      return;
    }
    try {
      const res = await fetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, displayName }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Ошибка ${res.status}`);
      }
      const data = await res.json();
      state.token = data.accessToken;
      localStorage.setItem('authToken', state.token);
      localStorage.setItem('username', username);
      localStorage.setItem('displayName', displayName);
      toggleAuthOverlay();
      bootstrapToast('Вход выполнен');
      refreshAll();
    } catch (err) {
      bootstrapToast(err.message || 'Ошибка входа');
    }
  });

  logoutBtn.addEventListener('click', () => {
    state.token = '';
    localStorage.removeItem('authToken');
    toggleAuthOverlay(true);
  });

  navButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      navButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      switchView(btn.dataset.target);
    });
  });

  document.getElementById('app').addEventListener('click', (e) => {
    const editProjectBtn = e.target.closest('.js-edit-project');
    if (editProjectBtn) {
      openProjectForm(editProjectBtn.dataset.id);
      return;
    }

    const deleteProjectBtn = e.target.closest('.js-delete-project');
    if (deleteProjectBtn) {
      deleteProject(deleteProjectBtn.dataset.id);
      return;
    }

    const editRequirementBtn = e.target.closest('.js-edit-requirement');
    if (editRequirementBtn) {
      openRequirementForm(editRequirementBtn.dataset.id);
      return;
    }

    const deleteRequirementBtn = e.target.closest('.js-delete-requirement');
    if (deleteRequirementBtn) {
      deleteRequirement(deleteRequirementBtn.dataset.id);
      return;
    }

    const editArticleBtn = e.target.closest('.js-edit-article');
    if (editArticleBtn) {
      openArticleForm(editArticleBtn.dataset.id);
      return;
    }

    const deleteArticleBtn = e.target.closest('.js-delete-article');
    if (deleteArticleBtn) {
      deleteArticle(deleteArticleBtn.dataset.id);
      return;
    }

    const openArticleBtn = e.target.closest('.js-open-article');
    if (openArticleBtn) {
      openArticleDetail(openArticleBtn.dataset.id);
      return;
    }

    const editUserStoryBtn = e.target.closest('.js-edit-user-story');
    if (editUserStoryBtn) {
      openUserStoryForm(editUserStoryBtn.dataset.id);
      return;
    }

    const deleteUserStoryBtn = e.target.closest('.js-delete-user-story');
    if (deleteUserStoryBtn) {
      deleteUserStory(deleteUserStoryBtn.dataset.id);
      return;
    }

    if (e.target.classList.contains('js-open-requirement')) {
      const id = e.target.dataset.id;
      openRequirementDetail(id);
    }
    if (e.target.classList.contains('js-open-requirement-modal')) {
      const id = e.target.dataset.id;
      const req = state.requirements.find((r) => `${r.id}` === id);
      if (req) openRequirementModal(req);
    }
    if (e.target.classList.contains('js-open-user-story')) {
      const id = e.target.dataset.id;
      openUserStoryDetail(id);
    }
    if (e.target.classList.contains('js-add-trace')) {
      const id = e.target.dataset.id;
      addTraceToCurrent(id);
    }
  });

  addTraceBtn.addEventListener('click', renderAddTraceModal);
  refreshRequirementsBtn.addEventListener('click', loadRequirements);
  refreshUserStoriesBtn.addEventListener('click', loadUserStories);
  refreshProjectsBtn.addEventListener('click', loadProjects);
  refreshArticlesBtn.addEventListener('click', loadArticles);
  addRequirementBtn.addEventListener('click', () => openRequirementForm(null));
  addUserStoryBtn.addEventListener('click', () => openUserStoryForm(null));
  userStoryForm.addEventListener('submit', onUserStoryFormSubmit);
  userStoryCancelBtn.addEventListener('click', onUserStoryCancel);
  requirementForm.addEventListener('submit', onRequirementFormSubmit);
  reqCancelBtn.addEventListener('click', onRequirementCancel);
  addArticleBtn.addEventListener('click', () => openArticleForm(null));
  articleForm.addEventListener('submit', onArticleFormSubmit);
  articleCancelBtn.addEventListener('click', onArticleCancel);
  editorButtons.forEach((btn) => btn.addEventListener('click', () => applyEditorCommand(btn.dataset.cmd)));
  insertCodeBtn.addEventListener('click', insertCodeBlock);
  projectForm.addEventListener('submit', onProjectFormSubmit);
  projectCancelEditBtn.addEventListener('click', resetProjectForm);
  resetProjectFormBtn.addEventListener('click', resetProjectForm);
  [projectNameInput, projectAuthorInput, projectGitInput].forEach((el) =>
    el.addEventListener('input', clearProjectValidation)
  );
  [usStatementInput, usOwnerInput, usPriorityInput].forEach((el) =>
    el.addEventListener('input', () => el.classList.remove('is-invalid'))
  );
  prevPageBtn.addEventListener('click', () => changePage(-1));
  nextPageBtn.addEventListener('click', () => changePage(1));

  async function apiRequest(method, url, body) {
    if (!state.token) {
      toggleAuthOverlay(true);
      throw new Error('Нет токена');
    }
    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${state.token}`,
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (res.status === 401 || res.status === 403) {
      toggleAuthOverlay(true);
      throw new Error('Не авторизовано');
    }
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || `Ошибка ${res.status}`);
    }
    return res.status === 204 ? null : res.json();
  }

  async function loadUserStories() {
    setLoading(userStoriesTableBody, 5);
    try {
      state.userStories = await apiRequest('GET', '/api/user-stories');
      renderUserStories();
    } catch (e) {
      showError(userStoriesTableBody, e, 5);
    }
  }

  async function loadRequirements() {
    setLoading(requirementsTableBody, 5);
    try {
      state.requirements = await apiRequest('GET', '/api/requirements');
      state.reqPage = 1;
      renderRequirements();
      if (state.currentRequirement) {
        await openRequirementDetail(state.currentRequirement.id);
      }
    } catch (e) {
      showError(requirementsTableBody, e, 5);
    }
  }

  async function loadProjects() {
    setLoading(projectsTableBody, 4);
    try {
      state.projects = await apiRequest('GET', '/api/projects');
      renderProjects();
      populateUserStoryProjects();
      populateArticleProjects();
    } catch (e) {
      showError(projectsTableBody, e, 4);
      bootstrapToast(e.message || 'Не удалось загрузить проекты');
    }
  }

  async function loadArticles() {
    setLoading(articlesTableBody, 4);
    try {
      state.articles = await apiRequest('GET', '/api/articles');
      renderArticles();
    } catch (e) {
      showError(articlesTableBody, e, 4);
      bootstrapToast(e.message || 'Не удалось загрузить статьи');
    }
  }

  function renderUserStories() {
    if (!state.userStories.length) {
      userStoriesTableBody.innerHTML = `<tr><td colspan="5" class="text-center text-muted">Нет записей</td></tr>`;
      return;
    }
    userStoriesTableBody.innerHTML = state.userStories.map((us) => `
      <tr>
        <td class="small">${escapeHtml(us.statement ?? '')}</td>
        <td>${escapeHtml(us.owner ?? '-')}</td>
        <td><span class="badge bg-outline border text-uppercase">${escapeHtml(formatPriority(us.priority))}</span></td>
        <td>${escapeHtml(us.project?.name ?? '-')}</td>
        <td class="text-end">
          <div class="btn-group">
            <button class="btn btn-sm btn-primary js-open-user-story" data-id="${us.id}">Открыть</button>
            <button class="btn btn-sm btn-outline-secondary js-edit-user-story" data-id="${us.id}">Редактировать</button>
            <button class="btn btn-sm btn-outline-danger js-delete-user-story" data-id="${us.id}">Удалить</button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  function renderRequirements() {
    const total = state.requirements.length;
    const start = (state.reqPage - 1) * state.pageSize;
    const slice = state.requirements.slice(start, start + state.pageSize);

    requirementsCounter.textContent = total
      ? `Показаны ${start + 1}–${Math.min(start + state.pageSize, total)} из ${total}`
      : 'Нет данных';

    if (!slice.length) {
      requirementsTableBody.innerHTML = `<tr><td colspan="5" class="text-center text-muted">Нет записей</td></tr>`;
      return;
    }

    requirementsTableBody.innerHTML = slice.map((req) => `
      <tr>
        <td>${escapeHtml(req.title ?? '')}</td>
        <td>${escapeHtml(req.type ?? '')}</td>
        <td><span class="badge bg-info text-dark">${escapeHtml(req.status ?? '')}</span></td>
        <td><span class="badge bg-secondary">${req.version ?? '-'}</span></td>
        <td class="text-end">
          <div class="btn-group">
            <button class="btn btn-sm btn-primary js-open-requirement" data-id="${req.id}">Открыть</button>
            <button class="btn btn-sm btn-outline-secondary js-edit-requirement" data-id="${req.id}">Редактировать</button>
            <button class="btn btn-sm btn-outline-danger js-delete-requirement" data-id="${req.id}">Удалить</button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  function renderProjects() {
    if (!state.projects.length) {
      projectsTableBody.innerHTML = `<tr><td colspan="4" class="text-center text-muted">Нет проектов</td></tr>`;
      return;
    }

    projectsTableBody.innerHTML = state.projects.map((project) => {
      const desc = project.description ? shorten(project.description, 90) : 'Нет описания';
      const gitLink = project.gitUrl
        ? `<a href="${escapeHtml(project.gitUrl)}" target="_blank" rel="noopener" class="link-primary">${escapeHtml(project.gitUrl)}</a>`
        : '<span class="text-muted">—</span>';
      return `
        <tr>
          <td>
            <div class="fw-semibold">${escapeHtml(project.name ?? '')}</div>
            <div class="text-muted small">${escapeHtml(desc)}</div>
          </td>
          <td>${escapeHtml(project.authorName ?? '—')}</td>
          <td>${gitLink}</td>
          <td class="text-end">
            <div class="btn-group">
              <button class="btn btn-sm btn-primary js-edit-project" data-id="${project.id}">Редактировать</button>
              <button class="btn btn-sm btn-outline-danger js-delete-project" data-id="${project.id}">Удалить</button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  function populateUserStoryProjects() {
    const current = usProjectInput.value;
    const options = [
      '<option value="">Без проекта</option>',
      ...state.projects.map((p) => `<option value="${p.id}">${escapeHtml(p.name ?? '')}</option>`),
    ];
    usProjectInput.innerHTML = options.join('');
    if (current) {
      usProjectInput.value = current;
    }
  }

  function populateArticleProjects() {
    const current = articleProjectInput.value;
    const options = [
      '<option value="">Без проекта</option>',
      ...state.projects.map((p) => `<option value="${p.id}">${escapeHtml(p.name ?? '')}</option>`),
    ];
    articleProjectInput.innerHTML = options.join('');
    if (current) {
      articleProjectInput.value = current;
    }
  }

  function populateRequirementProjects() {
    const current = reqProjectInput.value;
    const options = [
      '<option value="">Без проекта</option>',
      ...state.projects.map((p) => `<option value="${p.id}">${escapeHtml(p.name ?? '')}</option>`),
    ];
    reqProjectInput.innerHTML = options.join('');
    if (current) {
      reqProjectInput.value = current;
    }
  }

  function openProjectForm(id) {
    const project = state.projects.find((p) => `${p.id}` === `${id}`);
    if (!project) return;
    setProjectFormMode(project);
  }

  function resetProjectForm() {
    setProjectFormMode(null);
  }

  function setProjectFormMode(project) {
    clearProjectValidation();
    state.currentProject = project || null;
    if (project) {
      projectFormTitle.textContent = `Редактирование проекта #${project.id}`;
      projectSubmitBtn.textContent = 'Сохранить';
      projectNameInput.value = project.name ?? '';
      projectAuthorInput.value = project.authorName ?? '';
      projectGitInput.value = project.gitUrl ?? '';
      projectDescriptionInput.value = project.description ?? '';
    } else {
      projectFormTitle.textContent = 'Новый проект';
      projectSubmitBtn.textContent = 'Создать';
      projectForm.reset();
    }
  }

  function clearProjectValidation() {
    [projectNameInput, projectAuthorInput, projectGitInput].forEach((el) => {
      el.classList.remove('is-invalid');
    });
  }

  async function onProjectFormSubmit(e) {
    e.preventDefault();
    clearProjectValidation();
    const name = projectNameInput.value.trim();
    const authorName = projectAuthorInput.value.trim();
    const gitUrl = projectGitInput.value.trim();
    const description = projectDescriptionInput.value.trim();

    if (!name) {
      projectNameInput.classList.add('is-invalid');
      bootstrapToast('Введите название проекта');
      projectNameInput.focus();
      return;
    }
    if (!authorName) {
      projectAuthorInput.classList.add('is-invalid');
      bootstrapToast('Укажите автора проекта');
      projectAuthorInput.focus();
      return;
    }
    if (gitUrl && !isValidUrl(gitUrl)) {
      projectGitInput.classList.add('is-invalid');
      bootstrapToast('Укажите корректный Git URL');
      projectGitInput.focus();
      return;
    }

    const payload = {
      name,
      authorName,
      gitUrl: gitUrl || null,
      description,
    };
    const method = state.currentProject ? 'PUT' : 'POST';
    const url = state.currentProject ? `/api/projects/${state.currentProject.id}` : '/api/projects';

    try {
      await apiRequest(method, url, payload);
      bootstrapToast(state.currentProject ? 'Проект обновлен' : 'Проект создан');
      setProjectFormMode(null);
      await loadProjects();
    } catch (err) {
      bootstrapToast(err.message || 'Не удалось сохранить проект');
    }
  }

  async function deleteProject(id) {
    const project = state.projects.find((p) => `${p.id}` === `${id}`);
    const name = project?.name ? `«${project.name}»` : `#${id}`;
    if (!confirm(`Удалить проект ${name}?`)) return;
    try {
      await apiRequest('DELETE', `/api/projects/${id}`);
      bootstrapToast('Проект удален');
      if (state.currentProject && `${state.currentProject.id}` === `${id}`) {
        setProjectFormMode(null);
      }
      await loadProjects();
    } catch (err) {
      bootstrapToast(err.message || 'Не удалось удалить проект');
    }
  }

  function openUserStoryForm(id) {
    const story = id ? state.userStories.find((s) => `${s.id}` === `${id}`) : null;
    state.currentUserStory = story || null;
    clearUserStoryValidation();
    populateUserStoryProjects();

    if (story) {
      userStoryModalTitle.textContent = `Редактирование User story #${story.id}`;
      userStorySubmitBtn.textContent = 'Сохранить';
      usStatementInput.value = story.statement ?? '';
      usOwnerInput.value = story.owner ?? '';
      usPriorityInput.value = story.priority ?? '';
      usProjectInput.value = story.project?.id ?? '';
    } else {
      userStoryModalTitle.textContent = 'Новая User story';
      userStorySubmitBtn.textContent = 'Добавить';
      userStoryForm.reset();
      usPriorityInput.value = 'MEDIUM';
    }
    userStoryModal.show();
  }

  function clearUserStoryValidation() {
    [usStatementInput, usOwnerInput, usPriorityInput].forEach((el) => el.classList.remove('is-invalid'));
  }

  async function onUserStoryFormSubmit(e) {
    e.preventDefault();
    clearUserStoryValidation();
    const statement = usStatementInput.value.trim();
    const owner = usOwnerInput.value.trim();
    const priority = usPriorityInput.value;
    const projectId = usProjectInput.value;

    if (!statement) {
      usStatementInput.classList.add('is-invalid');
      bootstrapToast('Заполните формулировку');
      usStatementInput.focus();
      return;
    }
    if (!owner) {
      usOwnerInput.classList.add('is-invalid');
      bootstrapToast('Укажите автора');
      usOwnerInput.focus();
      return;
    }
    if (!priority) {
      usPriorityInput.classList.add('is-invalid');
      bootstrapToast('Выберите приоритет');
      usPriorityInput.focus();
      return;
    }

    const payload = {
      statement,
      owner,
      priority,
      project: projectId ? { id: Number(projectId) } : null,
      requirements: [],
      tags: [],
    };

    const isEdit = Boolean(state.currentUserStory);
    const method = isEdit ? 'PUT' : 'POST';
    const url = isEdit ? `/api/user-stories/${state.currentUserStory.id}` : '/api/user-stories';

    try {
      await apiRequest(method, url, payload);
      bootstrapToast(isEdit ? 'User story обновлена' : 'User story добавлена');
      userStoryModal.hide();
      state.currentUserStory = null;
      await loadUserStories();
    } catch (err) {
      bootstrapToast(err.message || 'Не удалось сохранить User story');
    }
  }

  function onUserStoryCancel() {
    if (confirm('Отменить изменения?')) {
      state.currentUserStory = null;
      userStoryModal.hide();
    }
  }

  async function deleteUserStory(id) {
    const story = state.userStories.find((s) => `${s.id}` === `${id}`);
    const name = story?.statement ? shorten(story.statement, 40) : `#${id}`;
    if (!confirm(`Удалить User story "${name}"?`)) return;
    try {
      await apiRequest('DELETE', `/api/user-stories/${id}`);
      bootstrapToast('User story удалена');
      if (state.currentUserStory && `${state.currentUserStory.id}` === `${id}`) {
        state.currentUserStory = null;
        userStoryModal.hide();
      }
      await loadUserStories();
    } catch (err) {
      bootstrapToast(err.message || 'Не удалось удалить User story');
    }
  }

  async function openUserStoryDetail(id) {
    const story = state.userStories.find((u) => `${u.id}` === `${id}`);
    if (!story) return;
    state.currentUserStory = story;
    userStoryDetail.classList.remove('d-none');
    userStoryDetailTitle.textContent = `User Story #${story.id}`;
    userStoryStatement.textContent = story.statement ?? '';
    userStoryOwner.textContent = story.owner ?? '—';
    userStoryProject.textContent = story.project?.name ?? '—';
    userStoryPriority.textContent = story.priority ?? '';

    const linkedRequirements = state.requirements.filter((r) =>
      (r.userStories || []).some((us) => `${us.id}` === `${story.id}`)
    );
    if (!linkedRequirements.length) {
      userStoryRequirementsTable.innerHTML = `<tr><td colspan="3" class="text-center text-muted">Нет связанных требований</td></tr>`;
    } else {
      userStoryRequirementsTable.innerHTML = linkedRequirements.map((req) => `
        <tr class="js-open-requirement-modal" data-id="${req.id}" style="cursor:pointer">
          <td>${escapeHtml(req.title ?? '')}</td>
          <td>${escapeHtml(req.type ?? '')}</td>
          <td><span class="badge bg-info text-dark">${escapeHtml(req.status ?? '')}</span></td>
        </tr>
      `).join('');
    }
  }

  async function openRequirementDetail(id) {
    try {
      const data = await apiRequest('GET', `/api/requirements/${id}`);
      state.currentRequirement = data;
      requirementDetailCard.classList.remove('d-none');
      requirementDetailTitle.textContent = `${data.title ?? 'Требование'} (#${data.id})`;
      reqTitle.textContent = data.title ?? '';
      reqType.textContent = data.type ?? '';
      reqDescription.textContent = data.description ?? '';
      reqStatus.textContent = data.status ?? '';
      reqSource.textContent = data.source ?? '—';
      reqOwner.textContent = data.owner?.displayName ?? data.owner?.username ?? '—';
      reqVersion.textContent = data.version ?? '—';

      if (data.userStories?.length) {
        reqUserStories.innerHTML = data.userStories.map((us) =>
          `<span class="badge bg-light text-dark me-1 mb-1">${escapeHtml(us.statement ?? 'US')} (#${us.id})</span>`
        ).join('');
      } else {
        reqUserStories.innerHTML = `<span class="text-muted">Связей нет</span>`;
      }

      renderTraceTable(data);
    } catch (e) {
      bootstrapToast(e.message || 'Ошибка загрузки');
    }
  }

  function renderTraceTable(req) {
    const list = req.relatedRequirements || [];
    if (!list.length) {
      traceTableBody.innerHTML = `<tr><td colspan="3" class="text-center text-muted">Связей нет</td></tr>`;
      return;
    }
    traceTableBody.innerHTML = list.map((item) => `
      <tr class="js-open-requirement-modal" data-id="${item.id}" style="cursor:pointer">
        <td>${escapeHtml(item.title ?? '')}</td>
        <td>${escapeHtml(item.type ?? '')}</td>
        <td><span class="badge bg-info text-dark">${escapeHtml(item.status ?? '')}</span></td>
      </tr>
    `).join('');
  }

  function renderArticles() {
    if (!state.articles.length) {
      articlesTableBody.innerHTML = `<tr><td colspan="4" class="text-center text-muted">Нет статей</td></tr>`;
      articleDetail.classList.add('d-none');
      return;
    }

    articlesTableBody.innerHTML = state.articles.map((article) => {
      const project = article.project?.name ?? 'Без проекта';
      const updated = article.updatedAt ? new Date(article.updatedAt).toLocaleString() : '-';
      return `
        <tr class="js-open-article" data-id="${article.id}" style="cursor:pointer">
          <td>${escapeHtml(article.title ?? '')}</td>
          <td>${escapeHtml(project)}</td>
          <td class="small text-muted">${escapeHtml(updated)}</td>
          <td class="text-end">
            <div class="btn-group">
              <button class="btn btn-sm btn-outline-secondary js-edit-article" data-id="${article.id}">Редактировать</button>
              <button class="btn btn-sm btn-outline-danger js-delete-article" data-id="${article.id}">Удалить</button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  function openArticleForm(id) {
    const article = id ? state.articles.find((a) => `${a.id}` === `${id}`) : null;
    state.currentArticle = article || null;
    populateArticleProjects();
    clearArticleValidation();
    if (article) {
      articleModalTitle.textContent = `Редактирование статьи #${article.id}`;
      articleSubmitBtn.textContent = 'Сохранить';
      articleTitleInput.value = article.title ?? '';
      articleProjectInput.value = article.project?.id ?? '';
      articleEditor.innerHTML = article.body ?? '';
    } else {
      articleModalTitle.textContent = 'Новая статья';
      articleSubmitBtn.textContent = 'Создать';
      articleTitleInput.value = '';
      articleProjectInput.value = '';
      articleEditor.innerHTML = '';
    }
    articleModal.show();
    articleForm.dataset.initialHash = hashArticleForm();
  }

  function hashArticleForm() {
    return [
      articleTitleInput.value.trim(),
      articleProjectInput.value,
      articleEditor.innerHTML.trim(),
    ].join('||');
  }

  function isArticleDirty() {
    return hashArticleForm() !== (articleForm.dataset.initialHash || '');
  }

  function clearArticleValidation() {
    articleTitleInput.classList.remove('is-invalid');
  }

  async function onArticleFormSubmit(e) {
    e.preventDefault();
    clearArticleValidation();
    const title = articleTitleInput.value.trim();
    const projectId = articleProjectInput.value;
    const body = articleEditor.innerHTML.trim();

    if (!title) {
      articleTitleInput.classList.add('is-invalid');
      bootstrapToast('Введите заголовок статьи');
      articleTitleInput.focus();
      return;
    }
    if (!body) {
      bootstrapToast('Заполните содержание статьи');
      articleEditor.focus();
      return;
    }

    const payload = {
      title,
      body,
      project: projectId ? { id: Number(projectId) } : null,
    };
    const isEdit = Boolean(state.currentArticle);
    const method = isEdit ? 'PUT' : 'POST';
    const url = isEdit ? `/api/articles/${state.currentArticle.id}` : '/api/articles';

    try {
      await apiRequest(method, url, payload);
      bootstrapToast(isEdit ? 'Статья обновлена' : 'Статья добавлена');
      state.currentArticle = null;
      articleModal.hide();
      await loadArticles();
    } catch (err) {
      bootstrapToast(err.message || 'Не удалось сохранить статью');
    }
  }

  function onArticleCancel() {
    if (!isArticleDirty() || confirm('Изменения не будут сохранены. Продолжить?')) {
      state.currentArticle = null;
      articleModal.hide();
    }
  }

  async function deleteArticle(id) {
    const article = state.articles.find((a) => `${a.id}` === `${id}`);
    const title = article?.title ? shorten(article.title, 50) : `#${id}`;
    if (!confirm(`Удалить статью "${title}"?`)) return;
    try {
      await apiRequest('DELETE', `/api/articles/${id}`);
      bootstrapToast('Статья удалена');
      if (state.currentArticle && `${state.currentArticle.id}` === `${id}`) {
        state.currentArticle = null;
        articleModal.hide();
      }
      await loadArticles();
      articleDetail.classList.add('d-none');
    } catch (err) {
      bootstrapToast(err.message || 'Не удалось удалить статью');
    }
  }

  function openArticleDetail(id) {
    const article = state.articles.find((a) => `${a.id}` === `${id}`);
    if (!article) return;
    articleDetail.classList.remove('d-none');
    articleTitle.textContent = article.title ?? '';
    articleUpdated.textContent = article.updatedAt ? new Date(article.updatedAt).toLocaleString() : '';
    articleContent.innerHTML = article.body ?? '';
    window.scrollTo({ top: articleDetail.offsetTop - 60, behavior: 'smooth' });
  }

  function renderAddTraceModal() {
    if (!state.currentRequirement) return;
    const excluded = new Set([state.currentRequirement.id, ...(state.currentRequirement.relatedRequirements || []).map((r) => r.id)]);
    const candidates = state.requirements.filter((r) => !excluded.has(r.id));
    if (!candidates.length) {
      document.getElementById('addLinkTableBody').innerHTML = `<tr><td colspan="4" class="text-center text-muted">Нет доступных требований для связи</td></tr>`;
    } else {
      document.getElementById('addLinkTableBody').innerHTML = candidates.map((req) => `
        <tr>
          <td>${escapeHtml(req.title ?? '')}</td>
          <td>${escapeHtml(req.type ?? '')}</td>
          <td><span class="badge bg-info text-dark">${escapeHtml(req.status ?? '')}</span></td>
          <td class="text-end">
            <button class="btn btn-sm btn-primary js-add-trace" data-id="${req.id}">Связать</button>
          </td>
        </tr>
      `).join('');
    }
    addLinkModal.show();
  }

  async function addTraceToCurrent(targetId) {
    if (!state.currentRequirement) return;
    try {
      const updated = new Set((state.currentRequirement.relatedRequirements || []).map((r) => r.id));
      updated.add(Number(targetId));
      await updateRequirementRelations(state.currentRequirement, Array.from(updated));
      addLinkModal.hide();
      bootstrapToast('Связь добавлена');
      await loadRequirements();
      await openRequirementDetail(state.currentRequirement.id);
    } catch (e) {
      bootstrapToast(e.message || 'Ошибка добавления связи');
    }
  }

  async function updateRequirementRelations(req, relatedIds) {
    const payload = {
      id: req.id,
      title: req.title,
      description: req.description,
      type: req.type,
      status: req.status,
      source: req.source,
      version: req.version,
      owner: req.owner ? { id: req.owner.id } : null,
      project: req.project ? { id: req.project.id } : null,
      userStories: (req.userStories || []).map((us) => ({ id: us.id })),
      relatedRequirements: relatedIds.map((id) => ({ id })),
      tags: req.tags || [],
    };
    await apiRequest('PUT', `/api/requirements/${req.id}`, payload);
  }

  async function openRequirementForm(id) {
    let requirement = null;
    if (id) {
      requirement = await apiRequest('GET', `/api/requirements/${id}`);
    }
    state.currentRequirement = requirement || null;
    populateRequirementProjects();
    clearRequirementValidation();

    if (requirement) {
      requirementFormTitle.textContent = `Редактирование требования #${requirement.id}`;
      reqSubmitBtn.textContent = 'Сохранить';
      reqTitleInput.value = requirement.title ?? '';
      reqDescriptionInput.value = requirement.description ?? '';
      reqTypeInput.value = requirement.type ?? 'FUNCTIONAL';
      reqStatusInput.value = requirement.status ?? 'DRAFT';
      reqVersionInput.value = requirement.version ?? 1;
      reqSourceInput.value = requirement.source ?? '';
      reqProjectInput.value = requirement.project?.id ?? '';
      requirementForm.dataset.userStories = JSON.stringify((requirement.userStories || []).map((u) => ({ id: u.id })));
      requirementForm.dataset.related = JSON.stringify((requirement.relatedRequirements || []).map((r) => ({ id: r.id })));
      requirementForm.dataset.tags = JSON.stringify(requirement.tags || []);
    } else {
      requirementFormTitle.textContent = 'Новое требование';
      reqSubmitBtn.textContent = 'Создать';
      requirementForm.reset();
      reqTypeInput.value = 'FUNCTIONAL';
      reqStatusInput.value = 'DRAFT';
      reqVersionInput.value = 1;
      requirementForm.dataset.userStories = JSON.stringify([]);
      requirementForm.dataset.related = JSON.stringify([]);
      requirementForm.dataset.tags = JSON.stringify([]);
      state.currentRequirement = null;
    }
    requirementForm.dataset.initialHash = hashRequirementForm();
    requirementFormModal.show();
  }

  function hashRequirementForm() {
    return [
      reqTitleInput.value.trim(),
      reqDescriptionInput.value.trim(),
      reqTypeInput.value,
      reqStatusInput.value,
      reqVersionInput.value,
      reqSourceInput.value.trim(),
      reqProjectInput.value,
    ].join('||');
  }

  function isRequirementDirty() {
    return hashRequirementForm() !== (requirementForm.dataset.initialHash || '');
  }

  function clearRequirementValidation() {
    [reqTitleInput, reqDescriptionInput, reqVersionInput].forEach((el) => el.classList.remove('is-invalid'));
  }

  async function onRequirementFormSubmit(e) {
    e.preventDefault();
    clearRequirementValidation();
    const title = reqTitleInput.value.trim();
    const description = reqDescriptionInput.value.trim();
    const type = reqTypeInput.value;
    const status = reqStatusInput.value;
    const version = Number(reqVersionInput.value);
    const source = reqSourceInput.value.trim();
    const projectId = reqProjectInput.value;

    if (!title) {
      reqTitleInput.classList.add('is-invalid');
      bootstrapToast('Введите название требования');
      reqTitleInput.focus();
      return;
    }
    if (!description) {
      reqDescriptionInput.classList.add('is-invalid');
      bootstrapToast('Заполните описание требования');
      reqDescriptionInput.focus();
      return;
    }
    if (!version || version < 1) {
      reqVersionInput.classList.add('is-invalid');
      bootstrapToast('Версия должна быть положительным числом');
      reqVersionInput.focus();
      return;
    }

    const payload = {
      title,
      description,
      type,
      status,
      version,
      source: source || null,
      project: projectId ? { id: Number(projectId) } : null,
      owner: state.currentRequirement?.owner ? { id: state.currentRequirement.owner.id } : null,
      userStories: JSON.parse(requirementForm.dataset.userStories || '[]'),
      relatedRequirements: JSON.parse(requirementForm.dataset.related || '[]'),
      tags: JSON.parse(requirementForm.dataset.tags || '[]'),
    };

    const isEdit = Boolean(state.currentRequirement);
    const method = isEdit ? 'PUT' : 'POST';
    const url = isEdit ? `/api/requirements/${state.currentRequirement.id}` : '/api/requirements';

    try {
      await apiRequest(method, url, payload);
      bootstrapToast(isEdit ? 'Требование обновлено' : 'Требование создано');
      requirementFormModal.hide();
      await loadRequirements();
    } catch (err) {
      bootstrapToast(err.message || 'Не удалось сохранить требование');
    }
  }

  function onRequirementCancel() {
    if (!isRequirementDirty() || confirm('Изменения не будут сохранены. Продолжить?')) {
      state.currentRequirement = null;
      requirementFormModal.hide();
    }
  }

  async function deleteRequirement(id) {
    if (!confirm('Удалить требование?')) return;
    try {
      await apiRequest('DELETE', `/api/requirements/${id}`);
      bootstrapToast('Требование удалено');
      if (state.currentRequirement && `${state.currentRequirement.id}` === `${id}`) {
        state.currentRequirement = null;
        requirementDetailCard.classList.add('d-none');
      }
      await loadRequirements();
    } catch (err) {
      bootstrapToast(err.message || 'Не удалось удалить требование');
    }
  }


  function applyEditorCommand(cmd) {
    document.execCommand(cmd, false, null);
    articleEditor.focus();
  }

  function insertCodeBlock() {
    const code = prompt('Вставьте код:');
    if (!code) return;
    const escaped = escapeHtml(code);
    const html = `<pre><code>${escaped}</code></pre><p></p>`;
    articleEditor.focus();
    document.execCommand('insertHTML', false, html);
  }

  function switchView(targetId) {
    document.querySelectorAll('.view').forEach((view) => view.classList.add('d-none'));
    document.getElementById(targetId).classList.remove('d-none');
    if (targetId === 'userStoriesView') {
      loadUserStories();
    } else if (targetId === 'requirementsView') {
      loadRequirements();
    } else if (targetId === 'projectsView') {
      loadProjects();
    } else if (targetId === 'articlesView') {
      loadArticles();
    }
  }

  function changePage(delta) {
    const maxPage = Math.max(1, Math.ceil(state.requirements.length / state.pageSize));
    state.reqPage = Math.min(maxPage, Math.max(1, state.reqPage + delta));
    renderRequirements();
  }

  function toggleAuthOverlay(forceShow) {
    const shouldShow = forceShow || !state.token;
    authOverlay.style.display = shouldShow ? 'flex' : 'none';
  }

  function setLoading(tbody, cols) {
    tbody.innerHTML = `<tr><td colspan="${cols}" class="text-center text-muted">Загрузка...</td></tr>`;
  }

  function showError(tbody, err, cols = 5) {
    tbody.innerHTML = `<tr><td colspan="${cols}" class="text-center text-danger">${escapeHtml(err.message || 'Ошибка')}</td></tr>`;
  }

  function openRequirementModal(req) {
    document.getElementById('modalRequirementTitle').textContent = req.title ?? `Требование #${req.id}`;
    document.getElementById('modalReqType').textContent = req.type ?? '';
    document.getElementById('modalReqStatus').textContent = req.status ?? '';
    document.getElementById('modalReqDescription').textContent = req.description ?? '';
    document.getElementById('modalReqSource').textContent = req.source ?? '—';
    document.getElementById('modalReqVersion').textContent = req.version ?? '—';
    document.getElementById('modalReqOwner').textContent = req.owner?.displayName ?? req.owner?.username ?? '—';
    requirementModal.show();
  }

  function escapeHtml(str) {
    return (str ?? '').toString()
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function bootstrapToast(message) {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
      <div class="toast align-items-center text-bg-dark border-0" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="d-flex">
          <div class="toast-body">${escapeHtml(message)}</div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
      </div>`;
    const toastEl = wrapper.firstElementChild;
    document.body.appendChild(toastEl);
    const toast = new bootstrap.Toast(toastEl, { delay: 2500 });
    toast.show();
    toastEl.addEventListener('hidden.bs.toast', () => toastEl.remove());
  }

  function isValidUrl(value) {
    try {
      const url = new URL(value);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (e) {
      return false;
    }
  }

  function shorten(text, limit = 80) {
    if (!text) return '';
    const clean = text.trim();
    if (clean.length <= limit) return clean;
    return `${clean.slice(0, limit - 3)}...`;
  }

  function formatPriority(value) {
    switch ((value || '').toUpperCase()) {
      case 'LOW':
        return 'LOW';
      case 'HIGH':
        return 'HIGH';
      case 'MEDIUM':
      default:
        return 'MEDIUM';
    }
  }

  function refreshAll() {
    loadUserStories();
    loadRequirements();
    loadProjects();
    loadArticles();
  }

  if (state.token) {
    refreshAll();
  }
})();

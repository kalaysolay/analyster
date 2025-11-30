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

  const requirementsTableBody = document.getElementById('requirementsTableBody');
  const requirementsCounter = document.getElementById('requirementsCounter');
  const requirementDetailCard = document.getElementById('requirementDetail');

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

  const refreshRequirementsBtn = document.getElementById('refreshRequirementsBtn');
  const refreshUserStoriesBtn = document.getElementById('refreshUserStoriesBtn');
  const prevPageBtn = document.getElementById('prevPageBtn');
  const nextPageBtn = document.getElementById('nextPageBtn');

  const requirementModal = new bootstrap.Modal(document.getElementById('requirementModal'));
  const addLinkModal = new bootstrap.Modal(document.getElementById('addLinkModal'));

  let state = {
    token: localStorage.getItem('authToken') || '',
    userStories: [],
    requirements: [],
    currentRequirement: null,
    currentUserStory: null,
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
      bootstrapToast('Токен сохранён. Обновляю данные...');
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
      throw new Error('Неавторизовано');
    }
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Ошибка ${res.status}: ${text}`);
    }
    return res.status === 204 ? null : res.json();
  }

  async function loadUserStories() {
    setLoading(userStoriesTableBody, 4);
    try {
      state.userStories = await apiRequest('GET', '/api/user-stories');
      renderUserStories();
    } catch (e) {
      showError(userStoriesTableBody, e);
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
      showError(requirementsTableBody, e);
    }
  }

  function renderUserStories() {
    if (!state.userStories.length) {
      userStoriesTableBody.innerHTML = `<tr><td colspan="4" class="text-center text-muted">Нет записей</td></tr>`;
      return;
    }
    userStoriesTableBody.innerHTML = state.userStories.map((us) => `
      <tr>
        <td class="small">${escapeHtml(us.statement ?? '')}</td>
        <td>${escapeHtml(us.owner ?? '-')}</td>
        <td><span class="badge bg-outline border text-uppercase">${escapeHtml(us.priority ?? '')}</span></td>
        <td class="text-end">
          <button class="btn btn-sm btn-primary js-open-user-story" data-id="${us.id}">Открыть</button>
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
          <button class="btn btn-sm btn-primary js-open-requirement" data-id="${req.id}">Открыть</button>
        </td>
      </tr>
    `).join('');
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

  function renderAddTraceModal() {
    if (!state.currentRequirement) return;
    const excluded = new Set([state.currentRequirement.id, ...(state.currentRequirement.relatedRequirements || []).map(r => r.id)]);
    const candidates = state.requirements.filter(r => !excluded.has(r.id));
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
      const updated = new Set((state.currentRequirement.relatedRequirements || []).map(r => r.id));
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
      userStories: (req.userStories || []).map(us => ({ id: us.id })),
      relatedRequirements: relatedIds.map(id => ({ id })),
      tags: req.tags || [],
    };
    await apiRequest('PUT', `/api/requirements/${req.id}`, payload);
  }

  function switchView(targetId) {
    document.querySelectorAll('.view').forEach((view) => view.classList.add('d-none'));
    document.getElementById(targetId).classList.remove('d-none');
    if (targetId === 'userStoriesView') {
      loadUserStories();
    } else if (targetId === 'requirementsView') {
      loadRequirements();
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

  function showError(tbody, err) {
    tbody.innerHTML = `<tr><td colspan="5" class="text-center text-danger">${escapeHtml(err.message || 'Ошибка')}</td></tr>`;
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

  function refreshAll() {
    loadUserStories();
    loadRequirements();
  }

  if (state.token) {
    refreshAll();
  }
})();

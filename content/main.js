(function () {
  'use strict';

  const STORAGE_KEY = 'nektoExtPanelV1';

  const THEME_IDS = {
    default: { id: 'default', dot: '#666' },
    graphite: { id: 'graphite', dot: '#8b949e' },
    mica: { id: 'mica', dot: '#6b7280' },
    ocean: { id: 'ocean', dot: '#14b8a6' },
    forest: { id: 'forest', dot: '#22c55e' },
    lavender: { id: 'lavender', dot: '#8b5cf6' },
    amber: { id: 'amber', dot: '#f59e0b' },
    aurora: { id: 'aurora', dot: '#6366f1' },
  };

  const SECTION_LABELS = {
    settings: 'Настройки',
    themes: 'Тема',
    stats: 'Статистика',
  };

  const ICONS = {
    settings: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
    themes: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor" stroke="none"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor" stroke="none"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor" stroke="none"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>`,
    stats: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg>`,
    chevronRight: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>`,
  };

  const defaultState = () => ({
    autoSkip: true,
    theme: 'default',
    stats: {
      conversations: 0,
      skips: 0,
      totalSeconds: 0,
      longestSeconds: 0,
      searchesStarted: 0,
      lastSessionDay: '',
      todayConversations: 0,
    },
  });

  let state = defaultState();
  let openSection = null;
  let convStartTs = 0;
  let convActive = false;

  function loadState() {
    return new Promise((resolve) => {
      chrome.storage.local.get([STORAGE_KEY], (r) => {
        const raw = r[STORAGE_KEY];
        if (raw && typeof raw === 'object') {
          const d = defaultState();
          state = {
            ...d,
            ...raw,
            stats: { ...d.stats, ...(raw.stats || {}) },
          };
          if (state.theme && !THEME_IDS[state.theme]) state.theme = 'graphite';
        }
        resolve();
      });
    });
  }

  function saveState() {
    chrome.storage.local.set({ [STORAGE_KEY]: state });
  }

  function removeThemeLinks() {
    document.querySelectorAll('link[id^="nekto-ext-theme-"]').forEach((el) => el.remove());
  }

  function checkAndClickButton() {
    if (!state.autoSkip) return;
    const button = document.querySelector('.callScreen__findBtn.btn.green.filled');
    if (button) button.click();
  }

  function skipConversation() {
    const stopButton = document.querySelector(
      '.callScreen__cancelCallBtn.btn.danger2.cancelCallBtnNoMess'
    );
    if (stopButton) {
      stopButton.click();
      setTimeout(() => {
        const confirmButton = document.querySelector('.swal2-confirm.swal2-styled');
        if (confirmButton) confirmButton.click();
      }, 500);
    }
  }

  function startAutoSkipObserver() {
    const observer = new MutationObserver(() => {
      checkAndClickButton();
    });
    observer.observe(document.body, { childList: true, subtree: true });
    checkAndClickButton();
  }

  function watchFindButtonForSearchCount() {
    const findBtn = document.querySelector('.callScreen__findBtn.btn.green.filled');
    if (!findBtn || findBtn.dataset.nektoExtBound) return;
    findBtn.dataset.nektoExtBound = '1';
    findBtn.addEventListener(
      'click',
      () => {
        state.stats.searchesStarted += 1;
        saveState();
        renderStats();
      },
      true
    );
  }

  function padDay(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  function rollDaily() {
    const today = padDay(new Date());
    if (state.stats.lastSessionDay !== today) {
      state.stats.lastSessionDay = today;
      state.stats.todayConversations = 0;
    }
  }

  function recordConversationEnd(durationSec) {
    if (durationSec < 2) return;
    rollDaily();
    state.stats.conversations += 1;
    state.stats.todayConversations += 1;
    state.stats.totalSeconds += durationSec;
    if (durationSec > state.stats.longestSeconds) state.stats.longestSeconds = durationSec;
    saveState();
    renderStats();
  }

  function pollAudioConversation() {
    const audio = document.querySelector('audio#audioStream');
    const stream = audio && audio.srcObject;
    const tracks = stream && stream.getAudioTracks ? stream.getAudioTracks() : [];
    const live = tracks.some((t) => t.readyState === 'live');

    if (live && !convActive) {
      convActive = true;
      convStartTs = Date.now();
    } else if (!live && convActive) {
      const d = Math.floor((Date.now() - convStartTs) / 1000);
      recordConversationEnd(d);
      convActive = false;
      convStartTs = 0;
    }

    watchFindButtonForSearchCount();
  }

  function formatDuration(sec) {
    if (sec < 60) return `${sec} с`;
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    if (m < 60) return `${m} мин ${s} с`;
    const h = Math.floor(m / 60);
    const mm = m % 60;
    return `${h} ч ${mm} мин`;
  }

  function isLightSiteThemeButton(btn) {
    const t = (btn.textContent || '').trim().toLowerCase();
    return (
      t.includes('светл') ||
      t.includes('light') ||
      /^светлая$/i.test((btn.textContent || '').trim())
    );
  }

  function isDarkSiteThemeButton(btn) {
    const t = (btn.textContent || '').trim().toLowerCase();
    return (
      t.includes('тёмн') ||
      t.includes('темн') ||
      t.includes('dark') ||
      t.includes('night') ||
      /^тёмная$/i.test((btn.textContent || '').trim()) ||
      /^темная$/i.test((btn.textContent || '').trim())
    );
  }

  /** Только тёмная схема nekto: класс night_theme, скрыта «Светлая», включена «Тёмная». */
  function enforceSiteDarkMode() {
    document.body.classList.add('night_theme');
    const panel = document.querySelector('.theme-filter-panel');
    if (!panel) return;
    panel.querySelectorAll('.btn-default').forEach((btn) => {
      if (isLightSiteThemeButton(btn)) {
        btn.classList.add('nekto-ext-site-light-hidden');
        btn.setAttribute('aria-hidden', 'true');
      }
      if (isDarkSiteThemeButton(btn) && !btn.classList.contains('checked')) {
        btn.click();
      }
    });
  }

  let siteThemeObserver;
  let siteThemeEnforceTimer;
  function scheduleEnforceSiteDark() {
    clearTimeout(siteThemeEnforceTimer);
    siteThemeEnforceTimer = setTimeout(() => enforceSiteDarkMode(), 60);
  }

  function startSiteThemeLock() {
    enforceSiteDarkMode();
    if (siteThemeObserver) siteThemeObserver.disconnect();
    siteThemeObserver = new MutationObserver(() => scheduleEnforceSiteDark());
    siteThemeObserver.observe(document.body, { childList: true, subtree: true });
  }

  function ensureSiteLayoutCss() {
    let el = document.getElementById('nekto-ext-site-tweaks');
    if (!el) {
      el = document.createElement('link');
      el.id = 'nekto-ext-site-tweaks';
      el.rel = 'stylesheet';
      el.href = chrome.runtime.getURL('themes/site-tweaks.css');
    }
    document.head.appendChild(el);
  }

  function applyTheme(themeId) {
    document.documentElement.classList.remove('nekto-ext-theme');
    removeThemeLinks();

    state.theme = themeId;
    saveState();

    enforceSiteDarkMode();

    if (themeId === 'default' || !THEME_IDS[themeId]) {
      updateThemeButtons();
      ensureSiteLayoutCss();
      return;
    }

    const hideAds = document.createElement('link');
    hideAds.id = 'nekto-ext-theme-hide-ads';
    hideAds.rel = 'stylesheet';
    hideAds.href = chrome.runtime.getURL('themes/hide-ads.css');
    document.head.appendChild(hideAds);

    const main = document.createElement('link');
    main.id = 'nekto-ext-theme-main';
    main.rel = 'stylesheet';
    main.href = chrome.runtime.getURL(`themes/${themeId}.css`);
    document.head.appendChild(main);

    updateThemeButtons();
    ensureSiteLayoutCss();
  }

  let rootEl;
  let sections = {};
  let statEls = {};
  let flyoutHeadEl;

  function setNavActive() {
    if (!rootEl) return;
    rootEl.querySelectorAll('.nekto-ext__icon-btn[data-tab]').forEach((btn) => {
      const tab = btn.dataset.tab;
      btn.setAttribute('data-active', openSection === tab ? 'true' : 'false');
    });
  }

  function closeFlyout() {
    openSection = null;
    setFlyoutOpen(false);
    setNavActive();
  }

  function setFlyoutOpen(on) {
    if (!rootEl) return;
    rootEl.classList.toggle('nekto-ext--open', on);
    const fly = rootEl.querySelector('.nekto-ext__flyout');
    if (fly) fly.setAttribute('aria-hidden', on ? 'false' : 'true');
  }

  function showSection(id) {
    Object.keys(sections).forEach((k) => {
      sections[k].setAttribute('data-visible', k === id ? 'true' : 'false');
    });
    if (flyoutHeadEl) flyoutHeadEl.textContent = SECTION_LABELS[id] || '';
  }

  function toggleSection(id) {
    if (openSection === id) {
      closeFlyout();
      return;
    }
    openSection = id;
    showSection(id);
    setFlyoutOpen(true);
    setNavActive();
  }

  function onDocPointerDown(e) {
    if (!rootEl || !openSection) return;
    if (rootEl.contains(e.target)) return;
    closeFlyout();
  }

  function renderStats() {
    if (!statEls.conversations) return;
    statEls.conversations.textContent = String(state.stats.conversations);
    statEls.longest.textContent = formatDuration(state.stats.longestSeconds);
    statEls.today.textContent = String(state.stats.todayConversations);
  }

  function updateThemeButtons() {
    if (!rootEl) return;
    rootEl.querySelectorAll('.nekto-ext__theme').forEach((btn) => {
      btn.setAttribute('data-active', btn.dataset.theme === state.theme ? 'true' : 'false');
    });
  }

  function updateAutoSkipToggle(input) {
    if (input) input.checked = state.autoSkip;
  }

  function buildPanel() {
    rootEl = document.createElement('div');
    rootEl.id = 'nekto-ext-root';

    rootEl.innerHTML = `
      <div class="nekto-ext__dock">
        <div class="nekto-ext__flyout" aria-hidden="true">
          <div class="nekto-ext__flyout-inner">
            <div class="nekto-ext__flyout-head" id="nekto-ext-flyout-head"></div>
            <div class="nekto-ext__flyout-body">
              <section class="nekto-ext__section" data-section="settings" data-visible="false">
                <div class="nekto-ext__row">
                  <span class="nekto-ext__label">Авто-скип</span>
                  <label class="nekto-ext__switch">
                    <input type="checkbox" id="nekto-ext-autoskip" />
                    <span></span>
                  </label>
                </div>
                <button type="button" class="nekto-ext__btn nekto-ext__btn--danger" id="nekto-ext-skip-now">Скипнуть сейчас</button>
              </section>
              <section class="nekto-ext__section" data-section="themes" data-visible="false">
                <div class="nekto-ext__theme-list" id="nekto-ext-theme-list"></div>
              </section>
              <section class="nekto-ext__section" data-section="stats" data-visible="false">
                <div class="nekto-ext__stat-grid">
                  <div class="nekto-ext__stat"><b id="nekto-stat-conv">0</b><span>Разговоров всего</span></div>
                  <div class="nekto-ext__stat"><b id="nekto-stat-today">0</b><span>Сегодня</span></div>
                  <div class="nekto-ext__stat"><b id="nekto-stat-long">0</b><span>Самый длинный звонок</span></div>
                </div>
              </section>
            </div>
          </div>
        </div>
        <div class="nekto-ext__launcher" role="toolbar">
          <button type="button" class="nekto-ext__icon-btn" data-tab="settings">${ICONS.settings}</button>
          <button type="button" class="nekto-ext__icon-btn" data-tab="themes">${ICONS.themes}</button>
          <button type="button" class="nekto-ext__icon-btn" data-tab="stats">${ICONS.stats}</button>
        </div>
      </div>
    `;

    document.body.appendChild(rootEl);

    flyoutHeadEl = rootEl.querySelector('#nekto-ext-flyout-head');
    sections.settings = rootEl.querySelector('[data-section="settings"]');
    sections.themes = rootEl.querySelector('[data-section="themes"]');
    sections.stats = rootEl.querySelector('[data-section="stats"]');

    statEls.conversations = rootEl.querySelector('#nekto-stat-conv');
    statEls.today = rootEl.querySelector('#nekto-stat-today');
    statEls.longest = rootEl.querySelector('#nekto-stat-long');

    const themeList = rootEl.querySelector('#nekto-ext-theme-list');
    Object.values(THEME_IDS).forEach((t) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'nekto-ext__theme';
      b.dataset.theme = t.id;
      b.innerHTML = `<span class="nekto-ext__theme-dot" style="background:${t.dot}"></span><span class="nekto-ext__theme-arrow">${ICONS.chevronRight}</span>`;
      b.addEventListener('click', () => applyTheme(t.id));
      themeList.appendChild(b);
    });

    rootEl.querySelectorAll('.nekto-ext__icon-btn[data-tab]').forEach((btn) => {
      btn.addEventListener('click', (ev) => {
        ev.stopPropagation();
        toggleSection(btn.dataset.tab);
      });
    });

    const autoInput = rootEl.querySelector('#nekto-ext-autoskip');
    autoInput.addEventListener('change', () => {
      state.autoSkip = autoInput.checked;
      saveState();
      if (state.autoSkip) checkAndClickButton();
    });

    rootEl.querySelector('#nekto-ext-skip-now').addEventListener('click', () => skipConversation());

    document.addEventListener('pointerdown', onDocPointerDown, true);

    document.body.addEventListener(
      'click',
      (e) => {
        const el =
          e.target.closest &&
          e.target.closest('.callScreen__cancelCallBtn.btn.danger2.cancelCallBtnNoMess');
        if (el) {
          state.stats.skips += 1;
          saveState();
          renderStats();
        }
      },
      true
    );

    updateAutoSkipToggle(autoInput);
    updateThemeButtons();
    renderStats();
  }

  function init() {
    loadState().then(() => {
      rollDaily();
      buildPanel();
      ensureSiteLayoutCss();
      startSiteThemeLock();
      applyTheme(state.theme);
      startAutoSkipObserver();
      window.setInterval(pollAudioConversation, 400);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

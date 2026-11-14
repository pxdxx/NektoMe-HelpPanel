(function () {
  'use strict';

  const STORAGE_KEY = 'nektoExtPanelV1';

  const THEMES = {
    default: { id: 'default', name: 'Как на сайте', dot: '#4d657f' },
    graphite: { id: 'graphite', name: 'Graphite', dot: '#9aa3b5' },
    mica: { id: 'mica', name: 'Mica', dot: '#8c8c88' },
    ocean: { id: 'ocean', name: 'Ocean', dot: '#7fb3b0' },
    forest: { id: 'forest', name: 'Forest', dot: '#93ad8c' },
    lavender: { id: 'lavender', name: 'Lavender', dot: '#a99cc4' },
    amber: { id: 'amber', name: 'Amber', dot: '#c9a46e' },
    aurora: { id: 'aurora', name: 'Aurora', dot: '#8fa3c9' },
    crimson: { id: 'crimson', name: 'Crimson', dot: '#b86b6e' },
  };

  /* Декоративный фон страницы — рисует content/backdrop.js цветами активной темы */
  const BACKGROUNDS = {
    none: {
      id: 'none',
      name: 'Без фона',
      icon: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="8"/><path d="m6.5 17.5 11-11"/></svg>',
    },
    stars: {
      id: 'stars',
      name: 'Звёзды',
      icon: '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M10 3.5 11.3 8.2 16 9.5l-4.7 1.3L10 15.5 8.7 10.8 4 9.5l4.7-1.3z"/><circle cx="18" cy="16.5" r="1.3"/><circle cx="6" cy="18.5" r=".9"/><circle cx="18.5" cy="5" r=".9"/></svg>',
    },
    constellations: {
      id: 'constellations',
      name: 'Созвездия',
      icon: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M5 17 9.5 9l5.5 3.5L19 6M9.5 9 8 4"/><g fill="currentColor" stroke="none"><circle cx="5" cy="17" r="1.6"/><circle cx="9.5" cy="9" r="1.6"/><circle cx="15" cy="12.5" r="1.6"/><circle cx="19" cy="6" r="1.6"/><circle cx="8" cy="4" r="1.2"/></g></svg>',
    },
    fireflies: {
      id: 'fireflies',
      name: 'Светлячки',
      icon: '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><circle cx="8" cy="9" r="2.2"/><circle cx="8" cy="9" r="4.5" opacity=".25"/><circle cx="16.5" cy="15.5" r="1.8"/><circle cx="16.5" cy="15.5" r="3.8" opacity=".25"/><circle cx="17" cy="5.5" r="1"/><circle cx="6" cy="18" r=".9"/></svg>',
    },
    nebula: {
      id: 'nebula',
      name: 'Туманность',
      icon: '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><ellipse cx="10" cy="12" rx="7.5" ry="5" opacity=".35"/><ellipse cx="14.5" cy="10.5" rx="5.5" ry="4" opacity=".45"/><circle cx="18.5" cy="17" r="1"/><circle cx="5" cy="6" r=".9"/><circle cx="12" cy="11" r="1.3"/></svg>',
    },
    rain: {
      id: 'rain',
      name: 'Дождь',
      icon: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M7 3.5 5.5 9M13 3.5 11.5 9M19 3.5 17.5 9" opacity=".45"/><path d="M9 13.5c0 1.7-1.2 3-2.5 3S4 15.2 4 13.5C4 12 6.5 9.5 6.5 9.5S9 12 9 13.5ZM20 16c0 1.4-1 2.5-2 2.5s-2-1.1-2-2.5c0-1.2 2-3.2 2-3.2s2 2 2 3.2Z" fill="currentColor" stroke="none"/></svg>',
    },
    snow: {
      id: 'snow',
      name: 'Снег',
      icon: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><path d="M9 3v10M5 5.5l8 5M13 5.5l-8 5"/><g fill="currentColor" stroke="none"><circle cx="18" cy="8" r="1.4"/><circle cx="16" cy="17" r="1.8"/><circle cx="7" cy="19" r="1.1"/></g></svg>',
    },
    city: {
      id: 'city',
      name: 'Ночной город',
      icon: '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M2 21V12h4V8h4v13h1V5h5v16h1v-8h5v8z" opacity=".5"/><g><rect x="12.5" y="7.5" width="1.2" height="1.6"/><rect x="14.3" y="11" width="1.2" height="1.6"/><rect x="7" y="11" width="1.2" height="1.6"/><rect x="18.8" y="15" width="1.2" height="1.6"/></g><circle cx="20" cy="4" r=".9"/></svg>',
    },
    moon: {
      id: 'moon',
      name: 'Луна',
      icon: '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M15.5 3.5a7.5 7.5 0 1 0 5 12.6A6.2 6.2 0 0 1 15.5 3.5Z"/><ellipse cx="9" cy="18" rx="7" ry="1.3" opacity=".35"/><circle cx="5" cy="6" r=".9"/></svg>',
    },
  };

  const SECTION_LABELS = {
    settings: 'Настройки',
    sound: 'Звук',
    themes: 'Тема',
    background: 'Фон',
    stats: 'Статистика',
  };

  /* Селекторы сайта (новый экран звонка callScreen) */
  const SEL = {
    findBtn: '.callScreen__findBtn',
    cancelCallBtn: '.callScreen__cancelCallBtn',
    callScreen: '.callScreen',
    closeDialogConfirm: '.closeDialogPopup .swal2-confirm',
    reportConfirm: '.reportConfirm .swal2-confirm',
    searchStartBtns: '.callScreen__findBtn, .audio-chat .scan-button, .audio-chat .go-scan-button',
    siteThemePanel: '.theme-filter-panel',
    siteAudio: 'audio#audioStream',
  };

  /* Ключи localStorage, которые читает content/page-hook.js в контексте страницы */
  const PAGE_MIC_KEY = 'nxExtMicId';
  const PAGE_OUTPUT_KEY = 'nxExtOutputId';
  const PAGE_MUTE_SITE_SOUNDS_KEY = 'nxExtMuteSiteSounds';

  /* Пауза между нажатиями «Начать поиск». Нажатие повторяется, пока кнопка на экране:
     сайт игнорирует клики, пока подбирает полноэкранную рекламу между звонками */
  const AUTO_SKIP_COOLDOWN_MS = 2000;
  const MIN_CONVERSATION_SEC = 2;

  const ICONS = {
    settings: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
    themes: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor" stroke="none"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor" stroke="none"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor" stroke="none"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>`,
    stats: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg>`,
    sound: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/></svg>`,
    chevron: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>`,
    background: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9.5 3.5 11 8l4.5 1.5L11 11l-1.5 4.5L8 11 3.5 9.5 8 8z"/><path d="M18 13.5l.9 2.6 2.6.9-2.6.9-.9 2.6-.9-2.6-2.6-.9 2.6-.9z"/></svg>`,
    check: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>`,
  };

  const defaultState = () => ({
    // на вкладке «Настройки» по умолчанию включён только авто-скип
    autoSkip: true,
    hideAds: false,
    animations: false,
    showPing: false,
    compactPanel: false,
    showClock: false,
    theme: 'default',
    background: 'none',
    bgBrightness: 100,
    bgDensity: 100,
    bgParallax: false,
    bgImage: 'none', // картинка на фоне: 'none' | 'wall:<id>' | 'custom'
    bgImageDim: 55, // картинка: затемнение, %
    bgImageBlur: 6, // картинка: размытие, px
    cardTransparency: 0, // прозрачность окна чата, % (0 — непрозрачное)
    audio: {
      micId: '',
      outputId: '',
      monitorVolume: 100,
    },
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
  let lastAutoClickTs = 0;
  let searchCountedFor = null; // кнопка, нажатие которой уже учтено в «Поисках»
  let selfEndedAt = 0; // когда мы сами подтвердили «Завершить» (вручную или авто)
  const SELF_END_WINDOW_MS = 4000;

  /* ───────── Хранилище ───────── */

  function loadState() {
    return new Promise((resolve) => {
      chrome.storage.local.get([STORAGE_KEY], (r) => {
        const raw = r && r[STORAGE_KEY];
        if (raw && typeof raw === 'object') {
          const d = defaultState();
          // поля от удалённых тетриса и стеклянной карточки
          const { game, glass, glassTint, glassBlur, glassShine, sfxPeerSkip, sfxVolume, siteSounds, ...rest } = raw;
          state = {
            ...d,
            ...rest,
            stats: { ...d.stats, ...(raw.stats || {}) },
            audio: { ...d.audio, ...(raw.audio || {}) },
          };
          if (!THEMES[state.theme]) state.theme = 'graphite';
          if (!BACKGROUNDS[state.background]) state.background = 'none';
          if (!('bgImage' in raw)) state.bgImage = 'legacy';
        }
        resolve();
      });
    });
  }

  function saveState() {
    try {
      chrome.storage.local.set({ [STORAGE_KEY]: state });
    } catch (_) {
      /* контекст расширения потерян после его перезагрузки — страница обновится сама */
    }
  }

  /* ───────── Авто-скип и ручной скип ───────── */

  /* «Стоп» в мини-окне: разговор завершён, но авто-поиск ждёт, пока поиск не запустят вручную */
  let autoSkipHold = false;

  function isVisible(el) {
    return !!el && el.getClientRects().length > 0;
  }

  /* Видимая кнопка начала поиска: на экране звонка — «Начать поиск собеседника»,
     на экране параметров — «Начать разговор» */
  function findSearchButton() {
    const candidates = document.querySelectorAll(SEL.searchStartBtns);
    for (const el of candidates) {
      if (isVisible(el) && !el.disabled && !el.classList.contains('disabled')) return el;
    }
    return null;
  }

  function checkAndClickButton() {
    if (!state.autoSkip || autoSkipHold) return;
    const now = Date.now();
    if (now - lastAutoClickTs < AUTO_SKIP_COOLDOWN_MS) return;
    const button = document.querySelector(SEL.findBtn); // авто-скип — только с экрана звонка
    if (!isVisible(button) || button.disabled || button.classList.contains('disabled')) return;
    lastAutoClickTs = now;
    button.click();
  }

  function setAutoSkip(on) {
    state.autoSkip = !!on;
    saveState();
    const input = rootEl && rootEl.querySelector('#nekto-ext-autoskip');
    if (input) input.checked = state.autoSkip;
    if (state.autoSkip) checkAndClickButton();
  }

  let autoSkipTimer;
  function scheduleAutoSkip() {
    clearTimeout(autoSkipTimer);
    autoSkipTimer = setTimeout(checkAndClickButton, 250);
  }

  function waitFor(selector, timeoutMs) {
    return new Promise((resolve) => {
      const started = Date.now();
      (function tick() {
        const el = document.querySelector(selector);
        if (el) return resolve(el);
        if (Date.now() - started >= timeoutMs) return resolve(null);
        setTimeout(tick, 80);
      })();
    });
  }

  async function skipConversation() {
    const stopButton = document.querySelector(SEL.cancelCallBtn);
    if (!stopButton) {
      flashButton('#nekto-ext-skip-now', 'Нет активного разговора');
      return;
    }
    stopButton.click();
    const confirmButton = await waitFor(SEL.closeDialogConfirm, 2000);
    if (confirmButton) confirmButton.click();
  }

  function flashButton(selector, text) {
    const btn = rootEl && rootEl.querySelector(selector);
    if (!btn) return;
    const original = btn.dataset.label || btn.textContent;
    btn.dataset.label = original;
    btn.textContent = text;
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = original;
      btn.disabled = false;
    }, 1400);
  }

  /* Подтверждение «Завершить разговор» — считаем как скип (и ручной, и авто) */
  function isEndCallConfirm(target) {
    if (target.closest(SEL.reportConfirm)) return true;
    const confirm = target.closest(SEL.closeDialogConfirm);
    if (!confirm) return false;
    const popup = confirm.closest('.swal2-popup');
    const title = popup && popup.querySelector('.swal2-title');
    return !title || /разговор/i.test(title.textContent || '');
  }

  function onDocClickCapture(e) {
    const target = e.target;
    if (!(target instanceof Element)) return;
    if (rootEl && rootEl.contains(target)) return;

    if (isEndCallConfirm(target)) {
      selfEndedAt = Date.now();
      playPeerSkipSound(); // скипнул ты
      state.stats.skips += 1;
      saveState();
      renderStats();
      return;
    }
    const searchBtn = target.closest(SEL.searchStartBtns);
    if (searchBtn && searchBtn !== searchCountedFor) {
      // повторные нажатия той же кнопки (ручные или авто, пока сайт их игнорирует) — один поиск
      searchCountedFor = searchBtn;
      state.stats.searchesStarted += 1;
      saveState();
      renderStats();
    }
  }

  /* ───────── Учёт разговоров ───────── */

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
    if (durationSec < MIN_CONVERSATION_SEC) return;
    rollDaily();
    state.stats.conversations += 1;
    state.stats.todayConversations += 1;
    state.stats.totalSeconds += durationSec;
    if (durationSec > state.stats.longestSeconds) state.stats.longestSeconds = durationSec;
    saveState();
    renderStats();
  }

  function isAudioLive() {
    const audio = document.querySelector('audio#audioStream');
    const stream = audio && audio.srcObject;
    const tracks = stream && stream.getAudioTracks ? stream.getAudioTracks() : [];
    return tracks.some((t) => t.readyState === 'live');
  }

  /* Кнопка «Завершить» на callScreen рендерится только при активном соединении */
  function isConversationActive() {
    if (document.querySelector(SEL.callScreen)) return !!document.querySelector(SEL.cancelCallBtn);
    return isAudioLive();
  }

  function finishActiveConversation() {
    if (!convActive) return;
    recordConversationEnd(Math.floor((Date.now() - convStartTs) / 1000));
    convActive = false;
    convStartTs = 0;
  }

  function pollConversation() {
    const live = isConversationActive();
    if (live && !convActive) {
      convActive = true;
      convStartTs = Date.now();
      autoSkipHold = false; // начался новый разговор — пауза после «Стоп» больше не нужна
    } else if (!live && convActive) {
      const peerEnded = Date.now() - selfEndedAt > SELF_END_WINDOW_MS;
      finishActiveConversation();
      if (peerEnded) playPeerSkipSound(); // скипнули тебя (свой скип уже прозвучал при подтверждении)
      findCheckSince = Date.now(); // теперь должна появиться кнопка поиска
    }
    runLiveChecks();
    applyOutputToSiteAudio();
    renderPing();
    const phase = currentChatPhase();
    if (phase !== 'idle') searchCountedFor = null; // поиск начался — следующий счёт заново
    if (phase === 'search') autoSkipHold = false; // новый поиск запустили — пауза авто-поиска снята
    checkAndClickButton(); // страховка: если сайт проигнорировал клик и страница не меняется
    const b = backdrop();
    if (b) b.setPhase(currentChatPhase());
  }

  function formatDuration(sec) {
    sec = Math.max(0, Math.round(sec));
    if (sec < 60) return `${sec} с`;
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    if (m < 60) return `${m} мин ${s} с`;
    const h = Math.floor(m / 60);
    const mm = m % 60;
    return `${h} ч ${mm} мин`;
  }

  /* ───────── Пинг до собеседника (замеряет content/page-hook.js) ───────── */

  let currentPing = null;

  function pingLevel(ms) {
    if (ms <= 100) return 'good';
    if (ms <= 250) return 'ok';
    return 'bad';
  }

  /* Плашка под таймером звонка; сайт пересоздаёт разметку, поэтому вызывается и из опроса */
  function renderPing() {
    let el = document.getElementById('nekto-ext-ping-badge');
    const host = document.querySelector('.callScreen__topMainText');
    const noLink = isLinkLost(); // разговор идёт, а замера нет — связь прервалась
    if (!state.showPing || !host || (currentPing === null && !noLink)) {
      if (el) el.remove();
      return;
    }
    if (!el) {
      el = document.createElement('div');
      el.id = 'nekto-ext-ping-badge';
      el.innerHTML = '<span class="nekto-ext-ping__dot"></span><span class="nekto-ext-ping__text"></span>';
    }
    if (el.parentNode !== host) host.appendChild(el);
    el.dataset.level = noLink ? 'bad' : pingLevel(currentPing);
    const text = noLink ? 'Нет связи' : `Пинг ${currentPing} мс`;
    const textEl = el.querySelector('.nekto-ext-ping__text');
    if (textEl.textContent !== text) textEl.textContent = text;
  }

  /* Разговор идёт дольше 4 с, а пинга нет — соединение потеряно (в первые секунды замер ещё не готов) */
  function isLinkLost() {
    return convActive && currentPing === null && Date.now() - convStartTs > 4000;
  }

  /* Предупреждение сайта на экране звонка («Возможно у вашего собеседника проблемы…») */
  function siteCallError() {
    const el = document.querySelector('.callScreen__topErrors, .audio-chat .peer-problem-label');
    const text = el && isVisible(el) ? (el.innerText || el.textContent || '').replace(/\s+/g, ' ').trim() : '';
    return text;
  }

  function onPing(e) {
    const ms = typeof e.detail === 'number' ? e.detail : -1;
    currentPing = ms >= 0 ? ms : null;
    renderPing();
  }

  /* ───────── Часы вверху страницы (время компьютера) ───────── */

  let clockEl = null;
  let clockTimer = 0;

  function renderClock() {
    if (!clockEl) return;
    const now = new Date();
    const set = (sel, value) => {
      const el = clockEl.querySelector(sel);
      if (el.textContent !== value) el.textContent = value; // меняем только на смене минуты
    };
    set('.nekto-ext-clock__h', String(now.getHours()).padStart(2, '0'));
    set('.nekto-ext-clock__m', String(now.getMinutes()).padStart(2, '0'));
  }

  /* Часы привязаны к карточке чата: сразу под её шапкой и ровно по её центру */
  const CLOCK_GAP = 10;
  const CLOCK_FALLBACK_TOP = 14;
  function positionClock() {
    if (!clockEl || !clockEl.isConnected) return;
    const header = document.querySelector('.audio-chat > .header, .audio-chat .header.header_chat');
    const rect = header && header.getBoundingClientRect();
    const attached = rect && rect.height > 0 && rect.width > 0;
    const top = attached ? `${Math.max(CLOCK_FALLBACK_TOP, Math.round(rect.bottom + CLOCK_GAP))}px` : `${CLOCK_FALLBACK_TOP}px`;
    const left = attached ? `${Math.round(rect.left + rect.width / 2)}px` : '50%'; // без карточки — по центру окна
    if (clockEl.style.top !== top) clockEl.style.top = top;
    if (clockEl.style.left !== left) clockEl.style.left = left;
  }

  let clockPositionFrame = 0;
  function schedulePositionClock() {
    if (clockPositionFrame || !state.showClock) return;
    clockPositionFrame = requestAnimationFrame(() => {
      clockPositionFrame = 0;
      positionClock();
    });
  }

  function applyClock() {
    clearTimeout(clockTimer);
    if (!state.showClock) {
      if (clockEl) clockEl.remove();
      return;
    }
    if (!clockEl) {
      clockEl = document.createElement('div');
      clockEl.id = 'nekto-ext-clock-badge';
      clockEl.setAttribute('aria-hidden', 'true');
      clockEl.innerHTML =
        '<span class="nekto-ext-clock__h"></span><span class="nekto-ext-clock__sep">:</span><span class="nekto-ext-clock__m"></span>';
    }
    if (!clockEl.isConnected) document.body.appendChild(clockEl);
    renderClock();
    positionClock();
    // следующее обновление — ровно на смене секунды, чтобы минута менялась вовремя
    const tick = () => {
      renderClock();
      positionClock(); // шапка могла сдвинуться (смена экрана, звонок)
      clockTimer = setTimeout(tick, 1000 - (Date.now() % 1000) + 5);
    };
    clockTimer = setTimeout(tick, 1000 - (Date.now() % 1000) + 5);
  }

  /* ───────── Звуки событий: скип (свой и собеседника) ───────── */

  /*
   * Играет первый найденный файл из sounds/: ender.mp3, затем skipped.(ogg|mp3|wav).
   * Если файлов нет — синтезированный «телепорт»: дрожащий тон вниз-вверх, шипение и эхо.
   */
  const PEER_SKIP_FILES = ['sounds/ender.mp3', 'sounds/skipped.ogg', 'sounds/skipped.mp3', 'sounds/skipped.wav'];
  let peerSkipFile; // undefined — ещё не искали, null — своего файла нет
  let sfxCtx = null;

  async function findPeerSkipFile() {
    if (peerSkipFile !== undefined) return peerSkipFile;
    peerSkipFile = null;
    for (const file of PEER_SKIP_FILES) {
      try {
        const res = await fetch(chrome.runtime.getURL(file));
        if (res.ok) {
          peerSkipFile = chrome.runtime.getURL(file);
          break;
        }
      } catch (_) {
        /* файла нет — пробуем следующий */
      }
    }
    return peerSkipFile;
  }

  async function playFileSound(url, volume) {
    const el = new Audio(url);
    el.volume = volume;
    await applySinkId(el).catch(() => {});
    await el.play();
  }

  async function playTeleportSynth(volume) {
    sfxCtx = sfxCtx || new AudioContext({ latencyHint: 'interactive' });
    await sfxCtx.resume().catch(() => {});
    if (typeof sfxCtx.setSinkId === 'function' && (sfxCtx.sinkId || '') !== (state.audio.outputId || '')) {
      await sfxCtx.setSinkId(state.audio.outputId || '').catch(() => {});
    }
    const ctx = sfxCtx;
    const t = ctx.currentTime + 0.01;
    const dur = 0.8;

    // общая громкость: быстрая атака, плавное затухание
    const out = ctx.createGain();
    out.gain.setValueAtTime(0.0001, t);
    out.gain.exponentialRampToValueAtTime(volume, t + 0.02);
    out.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    out.connect(ctx.destination);

    // короткое эхо с обратной связью — «звон портала»
    const delay = ctx.createDelay(0.5);
    delay.delayTime.value = 0.055;
    const feedback = ctx.createGain();
    feedback.gain.value = 0.38;
    const wet = ctx.createGain();
    wet.gain.value = 0.45;
    out.connect(delay);
    delay.connect(feedback);
    feedback.connect(delay);
    delay.connect(wet);
    wet.connect(ctx.destination);

    // тон: два расстроенных «пилообразных» голоса через полосовой фильтр
    const tone = ctx.createBiquadFilter();
    tone.type = 'bandpass';
    tone.Q.value = 3.5;
    tone.frequency.setValueAtTime(1900, t);
    tone.frequency.exponentialRampToValueAtTime(520, t + 0.3);
    tone.frequency.exponentialRampToValueAtTime(1500, t + dur);
    tone.connect(out);

    // быстрое «дрожание» высоты — характерный потусторонний перелив
    const wobble = ctx.createOscillator();
    wobble.frequency.setValueAtTime(32, t);
    wobble.frequency.linearRampToValueAtTime(18, t + dur);
    const wobbleDepth = ctx.createGain();
    wobbleDepth.gain.value = 70;
    wobble.connect(wobbleDepth);

    const voices = [-9, 9].map((detune) => {
      const o = ctx.createOscillator();
      o.type = 'sawtooth';
      o.frequency.setValueAtTime(880, t);
      o.frequency.exponentialRampToValueAtTime(210, t + 0.28); // вниз…
      o.frequency.exponentialRampToValueAtTime(560, t + dur); // …и обратно вверх
      o.detune.value = detune * 10;
      wobbleDepth.connect(o.frequency);
      o.connect(tone);
      return o;
    });

    // шипение: шум, проходящий через «свистящий» фильтр
    const noiseBuf = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * dur), ctx.sampleRate);
    const data = noiseBuf.getChannelData(0);
    for (let i = 0; i < data.length; i += 1) data[i] = Math.random() * 2 - 1;
    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuf;
    const hiss = ctx.createBiquadFilter();
    hiss.type = 'bandpass';
    hiss.Q.value = 6;
    hiss.frequency.setValueAtTime(3200, t);
    hiss.frequency.exponentialRampToValueAtTime(900, t + dur);
    const hissGain = ctx.createGain();
    hissGain.gain.value = 0.35;
    noise.connect(hiss);
    hiss.connect(hissGain);
    hissGain.connect(out);

    [wobble, noise, ...voices].forEach((node) => {
      node.start(t);
      node.stop(t + dur + 0.05);
    });

    // разорвать петлю эха после затухания, иначе узлы не освободятся
    setTimeout(() => {
      [out, delay, feedback, wet, tone, wobbleDepth, hiss, hissGain].forEach((n) => n.disconnect());
    }, (dur + 2) * 1000);
  }

  const SKIP_SOUND_VOLUME = 0.6;

  async function playPeerSkipSound() {
    const volume = SKIP_SOUND_VOLUME;
    try {
      const file = await findPeerSkipFile();
      if (file) await playFileSound(file, volume);
      else await playTeleportSynth(volume);
    } catch (_) {
      /* браузер не дал воспроизвести (нет взаимодействия со страницей) — пропускаем */
    }
  }

  /* ───────── Самопроверка: на месте ли элементы сайта, на которые опирается расширение ───────── */

  /*
   * Сайт уже однажды обновлялся и ломал темы. Расширение следит за ключевыми элементами
   * и тихо предупреждает в панели (точка на «Настройках» + список на вкладке), если их нет.
   */
  const healthIssues = new Map();
  let findCheckSince = 0; // когда закончился разговор и должна появиться кнопка поиска
  let cancelMissingSince = 0; // с какого момента идёт звук, а кнопки «Завершить» нет

  function setHealthIssue(key, text) {
    const had = healthIssues.get(key);
    if (text) healthIssues.set(key, text);
    else healthIssues.delete(key);
    if (had !== text) renderHealth();
  }

  function renderHealth() {
    if (!rootEl) return;
    const box = rootEl.querySelector('#nekto-ext-health');
    const list = rootEl.querySelector('#nekto-ext-health-list');
    const tab = rootEl.querySelector('.nekto-ext__icon-btn[data-tab="settings"]');
    const has = healthIssues.size > 0;
    if (tab) tab.dataset.warn = has ? 'true' : 'false';
    if (!box || !list) return;
    box.hidden = !has;
    list.textContent = '';
    healthIssues.forEach((text) => {
      const li = document.createElement('li');
      li.textContent = text;
      list.appendChild(li);
    });
  }

  /* Через 15 с после загрузки: каркас чата, шапка, звук собеседника */
  function runStartupChecks() {
    setHealthIssue(
      'card',
      document.querySelector('.chat_container .audio-chat') ? null : 'Не найдено окно чата — темы и прозрачность окна могут не работать'
    );
    setHealthIssue(
      'screens',
      document.querySelector('.callScreen, .audio-chat .chat-step') ? null : 'Не найдены экраны поиска и звонка — авто-скип может не работать'
    );
    setHealthIssue(
      'header',
      document.querySelector('.audio-chat > .header, .audio-chat .header.header_chat') ? null : 'Не найдена шапка окна — подпись и часы могут встать не на место'
    );
    setHealthIssue(
      'audio',
      document.querySelector(SEL.siteAudio) ? null : 'Не найден звук собеседника — пинг, громкость и наушники могут не работать'
    );
  }

  /* В каждом опросе: после разговора должна появиться кнопка поиска; в разговоре — кнопка «Завершить» */
  function runLiveChecks() {
    if (document.querySelector(SEL.findBtn)) {
      findCheckSince = 0;
      setHealthIssue('find', null);
    } else if (findCheckSince && Date.now() - findCheckSince > 10000) {
      const popupOpen = !!document.querySelector('.swal2-container');
      if (currentChatPhase() === 'idle' && !popupOpen && document.querySelector('.callScreen')) {
        setHealthIssue('find', 'После разговора не найдена кнопка «Начать поиск» — авто-скип может не работать');
      }
      findCheckSince = 0;
    }

    const audioLive = isAudioLive();
    const cancelFound = !!document.querySelector(SEL.cancelCallBtn);
    if (cancelFound) {
      cancelMissingSince = 0;
      setHealthIssue('cancel', null);
    } else if (audioLive && !document.querySelector(SEL.callScreen)) {
      // звук идёт, а экрана звонка нет; короткие моменты при смене экрана не считаем
      if (!cancelMissingSince) cancelMissingSince = Date.now();
      else if (Date.now() - cancelMissingSince > 10000) {
        setHealthIssue('cancel', 'В разговоре не найдена кнопка «Завершить» — скип и статистика могут не работать');
      }
    } else {
      cancelMissingSince = 0;
    }
  }

  /* ───────── Мини-окно поверх всех программ (Document Picture-in-Picture) ───────── */

  /*
   * Отдельное окошко «картинка в картинке» с таймером, пингом и кнопками «Скип»/«Микро».
   * Окно PiP всегда поверх других программ. Открыть его браузер разрешает только по клику,
   * поэтому переключатель не запоминается между перезагрузками страницы.
   */
  const canPip = typeof window.documentPictureInPicture !== 'undefined';
  const PIP_WIDTH = 320;
  const PIP_HEIGHT = 150;
  let pipWin = null;
  let pipTimer = 0;

  function pipColors() {
    const cs = getComputedStyle(document.documentElement);
    const v = (name, fallback) => cs.getPropertyValue(name).trim() || fallback;
    return {
      bg: v('--nx-surface', '#15181d'),
      control: v('--nx-surface-3', '#252a31'),
      border: v('--nx-border-strong', 'rgba(255, 255, 255, 0.14)'),
      text: v('--nx-text', '#e2e3e7'),
      muted: v('--nx-text-muted', '#8c96a0'),
      accent: v('--nx-accent', '#8fa6bf'),
      strong: v('--nx-accent-strong', '#3a4a5c'),
      hover: v('--nx-accent-hover', '#4a5a6e'),
      onAccent: v('--nx-on-accent', '#ffffff'),
      danger: v('--nx-danger', '#c46c6c'),
    };
  }

  function pipCss(c) {
    /*
     * Спокойный стиль: фон темнее темы, текст приглушён, кнопки без рамок.
     * Пока курсор не над окном, управление притухает — окно не отвлекает от игры.
     */
    const bg = `color-mix(in srgb, ${c.bg} 72%, #000)`;
    const soft = `color-mix(in srgb, ${c.text} 82%, ${c.bg})`;
    const faint = `color-mix(in srgb, ${c.muted} 70%, ${c.bg})`;
    const track = `color-mix(in srgb, ${c.text} 10%, transparent)`;
    const font = (file, range) => `@font-face { font-family: "NxNunito"; font-weight: 200 1000; font-display: swap;
        src: url("${chrome.runtime.getURL(`fonts/${file}`)}") format("woff2"); unicode-range: ${range}; }`;
    return `
      ${font('nunito-cyrillic.woff2', 'U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116')}
      ${font('nunito-latin.woff2', 'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD')}
      * { box-sizing: border-box; }
      html, body { margin: 0; height: 100%; background: ${bg}; color: ${soft};
        font: 600 13px "NxNunito", "Nunito", "Segoe UI", system-ui, sans-serif; overflow: hidden;
        -webkit-font-smoothing: antialiased; }
      .pip { height: 100%; display: flex; flex-direction: column; gap: 10px; padding: 12px 14px 10px; }

      /* таймер слева · индикатор голоса ровно по центру · авто-скип справа */
      .pip__mid { display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: 10px; }
      .pip__mid .pip__time { justify-self: start; }
      .pip__mid .pip__auto { justify-self: end; }
      .pip__time { font-size: 28px; font-weight: 800; letter-spacing: 0.02em; line-height: 1; font-variant-numeric: tabular-nums;
        transition: color .4s; }
      .pip[data-phase="idle"] .pip__time, .pip[data-phase="search"] .pip__time { color: ${faint}; }

      .pip__voice { display: inline-flex; align-items: center; justify-content: center; gap: 3px; height: 22px; }
      .pip__voice i { display: block; width: 3px; height: 4px; border-radius: 99px; background: ${c.muted}; opacity: .3;
        transition: height .1s ease-out, background .3s, opacity .3s; }
      .pip__voice[data-speaking="true"] i { background: ${c.accent}; opacity: .85; }

      .pip__auto { display: inline-flex; align-items: center; gap: 6px; color: ${faint}; font-size: 11px; cursor: pointer;
        user-select: none; transition: color .2s; }
      .pip__auto:hover { color: ${c.muted}; }
      .pip__auto input { position: absolute; opacity: 0; pointer-events: none; }
      .pip__switch { position: relative; width: 24px; height: 14px; border-radius: 99px; background: ${track};
        transition: background .2s; }
      .pip__switch::after { content: ""; position: absolute; top: 3px; left: 3px; width: 8px; height: 8px; border-radius: 50%;
        background: ${c.muted}; transition: transform .2s, background .2s; }
      .pip__auto input:checked + .pip__switch { background: color-mix(in srgb, ${c.accent} 30%, transparent); }
      .pip__auto input:checked + .pip__switch::after { transform: translateX(10px); background: ${c.accent}; }
      .pip__auto input:focus-visible + .pip__switch { outline: 1px solid ${c.accent}; outline-offset: 2px; }

      /* громкость на всю ширину, под ней — кнопки по центру свободного места */
      .pip__controls { flex: 1; min-height: 0; display: flex; flex-direction: column; gap: 6px; }
      .pip__vol { min-width: 0; display: flex; align-items: center; gap: 8px; color: ${faint}; font-size: 11px; }
      .pip__vol svg { flex: none; display: block; }
      .pip__vol input { --v: 50%; flex: 1; min-width: 0; height: 3px; margin: 0; -webkit-appearance: none; appearance: none;
        border-radius: 99px; outline: none; cursor: pointer;
        background: linear-gradient(to right, ${c.muted} var(--v), ${track} var(--v)); }
      .pip__vol input::-webkit-slider-thumb { -webkit-appearance: none; width: 10px; height: 10px; border-radius: 50%;
        background: ${soft}; border: none; opacity: 0; transition: opacity .2s; }
      .pip__vol:hover input::-webkit-slider-thumb, .pip__vol input:active::-webkit-slider-thumb { opacity: 1; }
      .pip__vol input:disabled { opacity: .35; cursor: default; }
      .pip__vol span { min-width: 28px; text-align: right; font-variant-numeric: tabular-nums; }

      .pip__buttons { flex: 1; display: flex; align-items: center; justify-content: center; gap: 14px; }
      .pip__btn { width: 40px; height: 34px; display: inline-flex; align-items: center; justify-content: center; padding: 0;
        border-radius: 10px; border: none; background: transparent; color: ${c.muted}; cursor: pointer;
        transition: background .2s, color .2s, opacity .2s; }
      .pip__btn svg { display: block; pointer-events: none; }
      .pip__btn:hover:not(:disabled) { background: ${track}; color: ${soft}; }
      .pip__btn:focus-visible { outline: 1px solid ${c.accent}; outline-offset: 1px; }
      .pip__btn:disabled { opacity: .3; cursor: default; }
      .pip__btn--main { color: ${c.accent}; }
      .pip__btn--main:hover:not(:disabled) { color: ${c.accent}; background: color-mix(in srgb, ${c.accent} 14%, transparent); }
      .pip__btn--stop:hover:not(:disabled) { color: ${c.danger}; background: color-mix(in srgb, ${c.danger} 12%, transparent); }
      .pip__btn[data-muted="true"] { color: ${c.danger}; background: color-mix(in srgb, ${c.danger} 12%, transparent); }

      /* без курсора над окном управление притухает */
      .pip__controls, .pip__auto { opacity: .6; transition: opacity .4s, color .2s; }
      body:hover .pip__controls, body:hover .pip__auto { opacity: 1; }

      /* нижняя строка: состояние (точка + текст) или предупреждение сайта + пинг */
      .pip__footer { display: flex; align-items: flex-end; justify-content: space-between; gap: 10px;
        color: ${faint}; font-size: 11px; line-height: 14px; }
      .pip__status { min-width: 0; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; overflow: hidden; }
      .pip__status::before { content: ""; display: inline-block; width: 6px; height: 6px; margin: 0 7px 1px 0; border-radius: 50%;
        background: ${c.muted}; opacity: .5; vertical-align: middle; }
      .pip[data-phase="talk"] .pip__status::before { background: ${c.accent}; opacity: .9; }
      .pip[data-phase="search"] .pip__status::before { background: ${c.accent}; animation: pip-pulse 1.6s ease-in-out infinite; }
      .pip__status[data-error="true"] { color: color-mix(in srgb, ${c.danger} 80%, ${c.bg}); }
      .pip__status[data-error="true"]::before { background: ${c.danger}; opacity: .9; animation: none; }
      .pip__ping { font-variant-numeric: tabular-nums; white-space: nowrap; }
      .pip__ping[data-bad="true"] { color: color-mix(in srgb, ${c.danger} 80%, ${c.bg}); }
      @keyframes pip-pulse { 0%, 100% { opacity: .25; } 50% { opacity: .9; } }
    `;
  }

  function refreshPipStyle() {
    if (!pipWin) return;
    const style = pipWin.document.getElementById('nx-pip-style');
    if (style) style.textContent = pipCss(pipColors());
  }

  function formatClock(sec) {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = String(sec % 60).padStart(2, '0');
    return h ? `${h}:${String(m).padStart(2, '0')}:${s}` : `${m}:${s}`;
  }

  function setText(el, value) {
    if (el.textContent !== value) el.textContent = value;
  }

  function renderPip() {
    if (!pipWin) return;
    const d = pipWin.document;
    const root = d.querySelector('.pip');
    if (!root) return;
    const phase = currentChatPhase();
    root.dataset.phase = phase;

    let status = phase === 'talk' ? 'Разговор' : phase === 'search' ? 'Поиск собеседника…' : 'Ожидание';
    if (phase === 'idle' && autoSkipHold && state.autoSkip) status = 'Авто-поиск на паузе';
    const siteError = convActive ? siteCallError() : '';
    const statusEl = d.getElementById('status');
    setText(statusEl, siteError || status); // предупреждение сайта важнее обычного состояния
    statusEl.dataset.error = siteError ? 'true' : 'false';
    setText(d.getElementById('time'), convActive ? formatClock(Math.floor((Date.now() - convStartTs) / 1000)) : '0:00');
    const ping = d.getElementById('ping');
    const noLink = isLinkLost();
    let pingText = '';
    if (noLink) pingText = 'нет связи';
    else if (convActive && currentPing !== null) pingText = `пинг ${currentPing} мс`;
    setText(ping, pingText);
    ping.dataset.bad = noLink ? 'true' : 'false';

    const vol = d.getElementById('vol');
    const audio = document.querySelector(SEL.siteAudio);
    vol.disabled = !audio;
    if (audio && !pipVolumeDragging) {
      const v = String(Math.round(audio.volume * 100));
      if (vol.value !== v) vol.value = v;
      setText(d.getElementById('vol-value'), `${v}%`);
    }
    vol.style.setProperty('--v', `${vol.value}%`); // заполненная часть полоски

    const auto = d.getElementById('auto');
    if (auto.checked !== state.autoSkip) auto.checked = state.autoSkip;

    const skip = d.getElementById('skip');
    if (convActive) setPipIcon(skip, 'skip', 'Скип');
    else setPipIcon(skip, 'find', 'Найти собеседника');
    skip.disabled = !convActive && !findSearchButton();
    d.getElementById('stop').disabled = !convActive;

    const mic = d.getElementById('mic');
    const micBtn = document.querySelector('.callScreen__microBtn');
    const muted = !!micBtn && micBtn.classList.contains('filled');
    mic.disabled = !micBtn;
    mic.dataset.muted = muted ? 'true' : 'false';
    if (muted) setPipIcon(mic, 'micOff', 'Включить микрофон');
    else setPipIcon(mic, 'mic', 'Выключить микрофон');
  }

  /* Иконки кнопок мини-окна; меняются по состоянию */
  const PIP_ICON_ATTRS = 'xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"';
  const PIP_ICONS = {
    find: `<svg ${PIP_ICON_ATTRS}><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>`,
    skip: `<svg ${PIP_ICON_ATTRS}><path d="M5 4.5v15l11-7.5z" fill="currentColor"/><path d="M19 5v14"/></svg>`,
    stop: `<svg ${PIP_ICON_ATTRS}><rect x="6.5" y="6.5" width="11" height="11" rx="2.5" fill="currentColor"/></svg>`,
    volume: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M15.5 9a4 4 0 0 1 0 6"/></svg>`,
    mic: `<svg ${PIP_ICON_ATTRS}><rect x="9" y="2.5" width="6" height="12" rx="3"/><path d="M5 10.5a7 7 0 0 0 14 0"/><path d="M12 17.5V21"/></svg>`,
    micOff: `<svg ${PIP_ICON_ATTRS}><path d="M15 9.3V5.5a3 3 0 0 0-5.7-1.3"/><path d="M9 9v2.5a3 3 0 0 0 5.1 2.1"/><path d="M5 10.5a7 7 0 0 0 11.8 5.1M19 10.5a7 7 0 0 1-.4 2.3"/><path d="M12 17.5V21"/><path d="M3 3l18 18"/></svg>`,
  };

  /* Меняет иконку и подпись (для экранных дикторов, без всплывающих подсказок) только при смене */
  function setPipIcon(btn, icon, label) {
    if (btn.dataset.icon === icon) return;
    btn.dataset.icon = icon;
    btn.innerHTML = PIP_ICONS[icon];
    btn.setAttribute('aria-label', label);
  }

  /* Уровень голоса собеседника: анализатор на его аудиопоток, звук при этом не меняется */
  let pipVolumeDragging = false;
  const peerMeter = { ctx: null, stream: null, source: null, analyser: null, buf: null, level: 0 };

  function dropPeerMeter() {
    if (peerMeter.source) peerMeter.source.disconnect();
    peerMeter.source = peerMeter.analyser = peerMeter.stream = null;
    peerMeter.level = 0;
  }

  function ensurePeerMeter() {
    const el = document.querySelector(SEL.siteAudio);
    const stream = el && el.srcObject;
    if (!stream || !stream.getAudioTracks || !stream.getAudioTracks().length) {
      dropPeerMeter();
      return null;
    }
    if (peerMeter.stream === stream && peerMeter.analyser) return peerMeter;
    dropPeerMeter();
    try {
      peerMeter.ctx = peerMeter.ctx || new AudioContext();
      peerMeter.ctx.resume().catch(() => {});
      peerMeter.source = peerMeter.ctx.createMediaStreamSource(stream);
      peerMeter.analyser = peerMeter.ctx.createAnalyser();
      peerMeter.analyser.fftSize = 512;
      peerMeter.source.connect(peerMeter.analyser); // в анализатор, не в динамики — звук не удваивается
      peerMeter.buf = new Float32Array(peerMeter.analyser.fftSize);
      peerMeter.stream = stream;
    } catch (_) {
      dropPeerMeter();
      return null;
    }
    return peerMeter;
  }

  function peerVoiceLevel() {
    if (!convActive) {
      dropPeerMeter();
      return 0;
    }
    const m = ensurePeerMeter();
    if (!m) return 0;
    m.analyser.getFloatTimeDomainData(m.buf);
    let sum = 0;
    for (let i = 0; i < m.buf.length; i += 1) sum += m.buf[i] * m.buf[i];
    const db = 20 * Math.log10(Math.sqrt(sum / m.buf.length) || 1e-8);
    const level = Math.max(0, Math.min(1, (db + 58) / 40)); // −58 дБ … −18 дБ
    m.level = level > m.level ? level : m.level * 0.82 + level * 0.18; // быстро вверх, плавно вниз
    return m.level;
  }

  const VOICE_BAR_SHAPE = [0.55, 1, 0.8, 0.45];
  let pipVoiceLast = 0;
  function pipVoiceLoop(time) {
    if (!pipWin) return;
    pipWin.requestAnimationFrame(pipVoiceLoop);
    if (time - pipVoiceLast < 50) return; // ~20 кадров/с хватает
    pipVoiceLast = time;
    const voice = pipWin.document.getElementById('voice');
    if (!voice) return;
    const level = peerVoiceLevel();
    voice.dataset.speaking = level > 0.12 ? 'true' : 'false';
    voice.querySelectorAll('i').forEach((bar, i) => {
      bar.style.height = `${Math.round(4 + level * VOICE_BAR_SHAPE[i] * 18)}px`;
    });
  }

  function onPipSkip() {
    if (document.querySelector(SEL.cancelCallBtn)) {
      skipConversation();
      return;
    }
    autoSkipHold = false;
    const find = findSearchButton();
    if (find) find.click();
  }

  /* Завершить разговор без нового поиска: авто-скип ждёт, пока поиск не запустят вручную */
  function onPipStop() {
    if (!document.querySelector(SEL.cancelCallBtn)) return;
    autoSkipHold = true;
    skipConversation();
    renderPip();
  }

  function onPipMic() {
    const micBtn = document.querySelector('.callScreen__microBtn');
    if (micBtn) micBtn.click(); // в первую минуту нажатие перехватит page-hook.js
    setTimeout(renderPip, 50);
  }

  function setPipToggle(on) {
    const input = rootEl && rootEl.querySelector('#nekto-ext-pip');
    if (input) input.checked = on;
  }

  async function openPip() {
    if (!canPip || pipWin) return;
    try {
      pipWin = await window.documentPictureInPicture.requestWindow({ width: PIP_WIDTH, height: PIP_HEIGHT });
    } catch (_) {
      pipWin = null;
      setPipToggle(false);
      return;
    }
    const d = pipWin.document;
    d.title = 'Nekto';
    const style = d.createElement('style');
    style.id = 'nx-pip-style';
    style.textContent = pipCss(pipColors());
    d.head.appendChild(style);
    d.body.innerHTML = `
      <div class="pip" data-phase="idle">
        <div class="pip__mid">
          <div class="pip__time" id="time"></div>
          <div class="pip__voice" id="voice" data-speaking="false"><i></i><i></i><i></i><i></i></div>
          <label class="pip__auto"><input type="checkbox" id="auto" /><span class="pip__switch"></span>Авто-скип</label>
        </div>
        <div class="pip__controls">
          <div class="pip__vol">${PIP_ICONS.volume}<input type="range" id="vol" min="0" max="100" step="1" aria-label="Громкость собеседника" /><span id="vol-value"></span></div>
          <div class="pip__buttons">
            <button type="button" class="pip__btn pip__btn--main" id="skip"></button>
            <button type="button" class="pip__btn pip__btn--stop" id="stop" aria-label="Завершить без нового поиска">${PIP_ICONS.stop}</button>
            <button type="button" class="pip__btn" id="mic"></button>
          </div>
        </div>
        <div class="pip__footer"><span class="pip__status" id="status"></span><span class="pip__ping" id="ping"></span></div>
      </div>`;
    d.getElementById('skip').addEventListener('click', onPipSkip);
    d.getElementById('stop').addEventListener('click', onPipStop);
    d.getElementById('mic').addEventListener('click', onPipMic);
    d.getElementById('auto').addEventListener('change', (e) => {
      setAutoSkip(e.target.checked);
      renderPip();
    });
    const vol = d.getElementById('vol');
    vol.addEventListener('pointerdown', () => {
      pipVolumeDragging = true;
    });
    pipWin.addEventListener('pointerup', () => {
      pipVolumeDragging = false;
    });
    vol.addEventListener('input', () => {
      setText(d.getElementById('vol-value'), `${vol.value}%`);
      vol.style.setProperty('--v', `${vol.value}%`);
      document.dispatchEvent(new CustomEvent('nx-ext:set-volume', { detail: Number(vol.value) }));
    });
    pipWin.addEventListener('pagehide', () => {
      pipWin = null;
      clearInterval(pipTimer);
      dropPeerMeter();
      setPipToggle(false);
    });
    pipWin.requestAnimationFrame(pipVoiceLoop);
    renderPip();
    clearInterval(pipTimer);
    pipTimer = setInterval(guarded(renderPip), 500);
  }

  function closePip() {
    if (pipWin) pipWin.close();
  }

  /* ───────── Картинка на фоне: готовые обои или своя ───────── */

  /*
   * state.bgImage: 'none' | 'wall:<id>' (обои из папки wallpaper/) | 'custom' (своя картинка).
   * Своя картинка уменьшается до 2560 px и хранится в chrome.storage отдельно от настроек.
   * Картинка рисуется под эффектами фона (звёзды и т.п. можно совместить), затемнённой и размытой.
   */
  const WALLPAPERS = [
    { id: 'wal1', name: 'Незабудки', thumb: 'wallpaper/thumbs/wal1.jpg', full: 'wallpaper/wal1.jpg' },
    { id: 'wal2', name: 'Силуэт', thumb: 'wallpaper/thumbs/wal2.jpg', full: 'wallpaper/wal2.jpg' },
    { id: 'wal3', name: 'Море', thumb: 'wallpaper/thumbs/wal3.jpg', full: 'wallpaper/wal3.jpg' },
    { id: 'wal4', name: 'Хром', thumb: 'wallpaper/thumbs/wal4.jpg', full: 'wallpaper/wal4.jpg' },
    { id: 'wal5', name: 'Пальмы', thumb: 'wallpaper/thumbs/wal5.jpg', full: 'wallpaper/display/wal5.jpg' }, // оригинал 8K — облегчённая копия
    { id: 'wal6', name: 'Чёрная дыра', thumb: 'wallpaper/thumbs/wal6.jpg', full: 'wallpaper/wal6.jpg' },
    { id: 'wal7', name: 'Маки', thumb: 'wallpaper/thumbs/wal7.jpg', full: 'wallpaper/wal7.jpg' },
    { id: 'wal8', name: 'Кот', thumb: 'wallpaper/thumbs/wal8.jpg', full: 'wallpaper/wal8.jpg' },
    { id: 'wal9', name: 'Собор', thumb: 'wallpaper/thumbs/wal9.jpg', full: 'wallpaper/wal9.jpg' },
  ];

  const BG_IMAGE_KEY = 'nektoExtBgImageV1';
  const BG_IMAGE_MAX_SIDE = 2560;
  const BG_IMAGE_MAX_CHARS = 4.5 * 1024 * 1024; // запас под лимит chrome.storage (10 МБ)
  let bgImageUrl = null; // своя картинка (data URL)
  let bgImageEl = null;

  function loadBgImage() {
    return new Promise((resolve) => {
      chrome.storage.local.get([BG_IMAGE_KEY], (r) => {
        bgImageUrl = (r && r[BG_IMAGE_KEY]) || null;
        resolve();
      });
    });
  }

  function currentBgImageSrc() {
    if (state.bgImage === 'custom') return bgImageUrl;
    if (state.bgImage && state.bgImage.startsWith('wall:')) {
      const w = WALLPAPERS.find((x) => `wall:${x.id}` === state.bgImage);
      return w ? chrome.runtime.getURL(w.full) : null;
    }
    return null;
  }

  function applyBgImage() {
    const src = currentBgImageSrc();
    if (!src) {
      if (bgImageEl) bgImageEl.remove();
      updateBgImageUi();
      return;
    }
    if (!bgImageEl) {
      bgImageEl = document.createElement('div');
      bgImageEl.id = 'nekto-ext-bg-image';
      bgImageEl.setAttribute('aria-hidden', 'true');
    }
    if (!bgImageEl.isConnected) document.body.prepend(bgImageEl);
    const css = `url("${src}")`;
    if (bgImageEl.style.backgroundImage !== css) bgImageEl.style.backgroundImage = css;
    bgImageEl.style.setProperty('--nx-bgimg-blur', `${state.bgImageBlur}px`);
    bgImageEl.style.setProperty('--nx-bgimg-light', String(1 - state.bgImageDim / 100));
    updateBgImageUi();
  }

  function selectBgImage(value) {
    state.bgImage = value;
    saveState();
    applyBgImage();
  }

  function setBgImageStatus(text) {
    const el = rootEl && rootEl.querySelector('#nekto-ext-bgimg-status');
    if (!el) return;
    el.textContent = text || '';
    el.hidden = !text;
  }

  /* Сетка плиток: «Нет», готовые обои, «Своя» */
  function renderWallGrid() {
    const grid = rootEl && rootEl.querySelector('#nekto-ext-wall-grid');
    if (!grid) return;
    grid.textContent = '';

    const tile = (value, label, thumbUrl, extraClass) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = `nekto-ext__wall${extraClass ? ` ${extraClass}` : ''}`;
      b.dataset.value = value;
      b.setAttribute('role', 'radio');
      if (thumbUrl) b.style.backgroundImage = `url("${thumbUrl}")`;
      const name = document.createElement('span');
      name.className = 'nekto-ext__wall-name';
      name.textContent = label;
      b.appendChild(name);
      grid.appendChild(b);
      return b;
    };

    tile('none', 'Нет', null, 'nekto-ext__wall--none').addEventListener('click', () => selectBgImage('none'));

    WALLPAPERS.forEach((w) => {
      tile(`wall:${w.id}`, w.name, chrome.runtime.getURL(w.thumb)).addEventListener('click', () => selectBgImage(`wall:${w.id}`));
    });

    // «Своя»: пусто — открыть выбор файла; есть — выбрать; уже выбрана — заменить файл
    const custom = tile('custom', bgImageUrl ? 'Своя' : '+ Своя', bgImageUrl, bgImageUrl ? '' : 'nekto-ext__wall--add');
    custom.addEventListener('click', () => {
      if (!bgImageUrl || state.bgImage === 'custom') pickBgImageFile();
      else selectBgImage('custom');
    });
    if (bgImageUrl) {
      const del = document.createElement('span');
      del.className = 'nekto-ext__wall-del';
      del.setAttribute('role', 'button');
      del.setAttribute('aria-label', 'Удалить свою картинку');
      del.textContent = '×';
      del.addEventListener('click', (e) => {
        e.stopPropagation();
        removeBgImage();
      });
      custom.appendChild(del);
    }
    updateBgImageUi();
  }

  function updateBgImageUi() {
    if (!rootEl) return;
    rootEl.querySelectorAll('.nekto-ext__wall').forEach((b) => {
      const active = b.dataset.value === (state.bgImage || 'none');
      b.dataset.active = active ? 'true' : 'false';
      b.setAttribute('aria-checked', active ? 'true' : 'false');
    });
    const controls = rootEl.querySelector('#nekto-ext-bgimg-controls');
    if (controls) controls.dataset.disabled = currentBgImageSrc() ? 'false' : 'true';
  }

  /* Поле выбора файла не вставляется в страницу — так стили сайта его не «вытаскивают» наружу */
  function pickBgImageFile() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.addEventListener('change', () => onBgImagePicked(input.files && input.files[0]), { once: true });
    input.click();
  }

  async function imageFileToDataUrl(file) {
    const bitmap = await createImageBitmap(file);
    const k = Math.min(1, BG_IMAGE_MAX_SIDE / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bitmap.width * k);
    canvas.height = Math.round(bitmap.height * k);
    canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    for (const q of [0.86, 0.76, 0.64, 0.5]) {
      const url = canvas.toDataURL('image/jpeg', q);
      if (url.length <= BG_IMAGE_MAX_CHARS) return url;
    }
    throw new Error('too-big');
  }

  async function onBgImagePicked(file) {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setBgImageStatus('Это не картинка');
      return;
    }
    setBgImageStatus('Загружаю…');
    try {
      const url = await imageFileToDataUrl(file);
      chrome.storage.local.set({ [BG_IMAGE_KEY]: url }, () => {
        if (chrome.runtime.lastError) {
          setBgImageStatus('Не удалось сохранить картинку — попробуйте файл поменьше');
          return;
        }
        bgImageUrl = url;
        setBgImageStatus('');
        renderWallGrid();
        selectBgImage('custom');
      });
    } catch (_) {
      setBgImageStatus('Не удалось открыть картинку');
    }
  }

  /* Удалить свою картинку из хранилища (если она была выбрана — фон без картинки) */
  function removeBgImage() {
    chrome.storage.local.remove(BG_IMAGE_KEY, () => {
      bgImageUrl = null;
      if (state.bgImage === 'custom') {
        state.bgImage = 'none';
        saveState();
      }
      renderWallGrid();
      applyBgImage();
      setBgImageStatus('');
    });
  }

  /* ───────── Звук: микрофон, наушники, самопрослушка ───────── */

  const sound = {
    ctx: null,
    stream: null,
    source: null,
    analyser: null,
    gain: null,
    monitoring: false,
    meterRaf: 0,
    meterLevel: 0,
    token: 0,
    els: {},
  };

  const canPickOutput = typeof HTMLMediaElement !== 'undefined' && 'setSinkId' in HTMLMediaElement.prototype;

  function writePagePref(key, value) {
    try {
      if (value) localStorage.setItem(key, value);
      else localStorage.removeItem(key);
    } catch (_) {
      /* localStorage недоступен — выбор применится только к самопрослушке */
    }
  }

  function syncPagePrefs() {
    writePagePref(PAGE_MIC_KEY, state.audio.micId);
    writePagePref(PAGE_OUTPUT_KEY, state.audio.outputId);
    writePagePref(PAGE_MUTE_SITE_SOUNDS_KEY, '1'); // родные звуки nekto всегда выключены — вместо них звук скипа
  }

  function setSoundStatus(text) {
    if (!sound.els.status) return;
    sound.els.status.textContent = text || '';
    sound.els.status.hidden = !text;
  }

  /*
   * Самопрослушка берёт «сырой» сигнал: эхоподавление вырезало бы голос
   * (оно считает эхом звук, который мы сами же выводим в наушники),
   * а шумодав и автогромкость глотают тихие слова и окончания.
   */
  function monitorConstraints(withDevice) {
    const audio = { echoCancellation: false, noiseSuppression: false, autoGainControl: false };
    if (withDevice && state.audio.micId) audio.deviceId = { exact: state.audio.micId };
    return { audio };
  }

  /* «Микрофон (fifine Microphone) (3142:0a80)» → «Микрофон (fifine Microphone)» */
  function cleanDeviceLabel(label) {
    return (label || '').replace(/\s*\([0-9a-f]{4}:[0-9a-f]{4}\)\s*$/i, '').trim();
  }

  function fillDeviceDropdown(dropdown, devices, selectedId, fallbackName) {
    // Chrome добавляет виртуальные «default» и «communications» — их заменяет пункт «Как в системе»
    const list = devices.filter((d) => d.deviceId && d.deviceId !== 'default' && d.deviceId !== 'communications');
    const options = [{ value: '', label: 'Как в системе' }];
    list.forEach((d, i) => options.push({ value: d.deviceId, label: cleanDeviceLabel(d.label) || `${fallbackName} ${i + 1}` }));
    if (selectedId && !list.some((d) => d.deviceId === selectedId)) {
      options.push({ value: selectedId, label: 'Выбранное устройство отключено', muted: true });
    }
    dropdown.setOptions(options, selectedId || '');
  }

  async function refreshDevices() {
    if (!sound.els.mic || !navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) return;
    let devices = [];
    try {
      devices = await navigator.mediaDevices.enumerateDevices();
    } catch (_) {
      return;
    }
    const inputs = devices.filter((d) => d.kind === 'audioinput');
    const outputs = devices.filter((d) => d.kind === 'audiooutput');
    fillDeviceDropdown(sound.els.mic, inputs, state.audio.micId, 'Микрофон');
    fillDeviceDropdown(sound.els.output, outputs, state.audio.outputId, 'Устройство');
    if (!canPickOutput) sound.els.output.setDisabled(true);
    sound.els.access.hidden = !inputs.some((d) => !d.label);
  }

  async function requestDeviceAccess() {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ audio: true });
      s.getTracks().forEach((t) => t.stop());
      setSoundStatus('');
    } catch (_) {
      setSoundStatus('Доступ к микрофону запрещён — разрешите его через значок в адресной строке');
    }
    await refreshDevices();
  }

  function applySinkId(el) {
    if (!el || !canPickOutput) return Promise.resolve();
    const id = state.audio.outputId || '';
    if ((el.sinkId || '') === id) return Promise.resolve();
    return el.setSinkId(id);
  }

  function applyMonitorSink() {
    const ctx = sound.ctx;
    if (!ctx || typeof ctx.setSinkId !== 'function') return Promise.resolve();
    const id = state.audio.outputId || '';
    const current = typeof ctx.sinkId === 'string' ? ctx.sinkId : '';
    if (current === id) return Promise.resolve();
    return ctx.setSinkId(id);
  }

  /* Звук собеседника; остальные звуки сайта перенаправляет page-hook.js */
  function applyOutputToSiteAudio() {
    applySinkId(document.querySelector(SEL.siteAudio)).catch(() => {});
  }

  function setMic(id) {
    state.audio.micId = id;
    saveState();
    syncPagePrefs();
    document.dispatchEvent(new CustomEvent('nx-ext:mic-change', { detail: id }));
    setSoundStatus(convActive ? 'Микрофон переключён прямо в разговоре' : '');
    if (sound.stream) {
      stopPipeline();
      syncPipeline();
    }
  }

  function setOutput(id) {
    state.audio.outputId = id;
    saveState();
    syncPagePrefs();
    Promise.all([applySinkId(document.querySelector(SEL.siteAudio)), applyMonitorSink()])
      .then(() => setSoundStatus(''))
      .catch(() => setSoundStatus('Не удалось переключить устройство вывода'));
  }

  function updateMonitorGain() {
    if (!sound.gain) return;
    const target = sound.monitoring ? state.audio.monitorVolume / 100 : 0;
    sound.gain.gain.setTargetAtTime(target, sound.ctx.currentTime, 0.03);
  }

  /* Микрофон открыт, пока открыта вкладка «Звук» (индикатор) или включена самопрослушка */
  function pipelineNeeded() {
    return sound.monitoring || openSection === 'sound';
  }

  async function startPipeline() {
    if (sound.stream) return;
    const token = ++sound.token;
    let stream;
    try {
      stream = await navigator.mediaDevices.getUserMedia(monitorConstraints(true));
    } catch (_) {
      try {
        stream = await navigator.mediaDevices.getUserMedia(monitorConstraints(false));
      } catch (e) {
        if (token === sound.token) {
          setSoundStatus('Нет доступа к микрофону');
          setMonitoringUi(false);
        }
        return;
      }
    }
    if (token !== sound.token || sound.stream) {
      stream.getTracks().forEach((t) => t.stop()); // пока ждали, панель закрыли или пайплайн перезапустили
      return;
    }

    sound.stream = stream;
    // Вывод прямо в AudioContext — без буфера <audio>, задержка минимальная
    sound.ctx = sound.ctx || new AudioContext({ latencyHint: 'interactive' });
    sound.ctx.resume().catch(() => {});
    applyMonitorSink().catch(() => setSoundStatus('Не удалось вывести самопрослушку в выбранные наушники'));
    sound.source = sound.ctx.createMediaStreamSource(stream);
    sound.analyser = sound.ctx.createAnalyser();
    sound.analyser.fftSize = 1024;
    sound.gain = sound.ctx.createGain();
    sound.gain.gain.value = 0;
    sound.source.connect(sound.analyser);
    sound.source.connect(sound.gain);
    sound.gain.connect(sound.ctx.destination);
    updateMonitorGain();
    startMeter();
    refreshDevices(); // после доступа к микрофону появляются названия устройств
  }

  function stopPipeline() {
    sound.token += 1;
    cancelAnimationFrame(sound.meterRaf);
    sound.meterRaf = 0;
    if (sound.source) sound.source.disconnect();
    if (sound.gain) sound.gain.disconnect();
    if (sound.stream) sound.stream.getTracks().forEach((t) => t.stop());
    if (sound.ctx && sound.ctx.state === 'running') sound.ctx.suspend().catch(() => {});
    sound.stream = sound.source = sound.analyser = sound.gain = null;
    sound.meterLevel = 0;
    renderMeter(0);
  }

  function syncPipeline() {
    if (pipelineNeeded()) startPipeline();
    else stopPipeline();
  }

  function renderMeter(level) {
    if (sound.els.meter) sound.els.meter.style.transform = `scaleX(${level.toFixed(3)})`;
  }

  function startMeter() {
    cancelAnimationFrame(sound.meterRaf);
    const buf = new Float32Array(sound.analyser.fftSize);
    const tick = () => {
      if (!sound.analyser) return;
      sound.analyser.getFloatTimeDomainData(buf);
      let sum = 0;
      for (let i = 0; i < buf.length; i += 1) sum += buf[i] * buf[i];
      const db = 20 * Math.log10(Math.sqrt(sum / buf.length) || 1e-8);
      const level = Math.min(1, Math.max(0, (db + 60) / 55)); // −60 дБ … −5 дБ
      sound.meterLevel = level > sound.meterLevel ? level : sound.meterLevel * 0.9 + level * 0.1;
      renderMeter(sound.meterLevel);
      sound.meterRaf = requestAnimationFrame(tick);
    };
    sound.meterRaf = requestAnimationFrame(tick);
  }

  function setMonitoringUi(on) {
    sound.monitoring = on;
    if (sound.els.monitor) sound.els.monitor.checked = on;
    if (sound.els.volumeRow) sound.els.volumeRow.dataset.disabled = on ? 'false' : 'true';
  }

  function setMonitoring(on) {
    setMonitoringUi(on);
    updateMonitorGain();
    syncPipeline();
  }

  function setMonitorVolume(value) {
    state.audio.monitorVolume = value;
    if (sound.els.volumeValue) sound.els.volumeValue.textContent = `${value}%`;
    updateMonitorGain();
  }


  /* ───────── Тёмная схема сайта ───────── */

  function isLightSiteThemeButton(btn) {
    const t = (btn.textContent || '').trim().toLowerCase();
    return t.includes('светл') || t.includes('light');
  }

  function isDarkSiteThemeButton(btn) {
    const t = (btn.textContent || '').trim().toLowerCase();
    return t.includes('тёмн') || t.includes('темн') || t.includes('dark') || t.includes('night');
  }

  /** Только тёмная схема nekto: класс night_theme, скрыта «Светлая», включена «Тёмная». */
  function enforceSiteDarkMode() {
    if (!document.body.classList.contains('night_theme')) document.body.classList.add('night_theme');
    const panel = document.querySelector(SEL.siteThemePanel);
    if (!panel) return;
    panel.querySelectorAll('.btn-default').forEach((btn) => {
      if (isLightSiteThemeButton(btn) && !btn.classList.contains('nekto-ext-site-light-hidden')) {
        btn.classList.add('nekto-ext-site-light-hidden');
        btn.setAttribute('aria-hidden', 'true');
      }
      if (isDarkSiteThemeButton(btn) && !btn.classList.contains('checked')) {
        btn.click();
      }
    });
  }

  let siteThemeEnforceTimer;
  function scheduleEnforceSiteDark() {
    clearTimeout(siteThemeEnforceTimer);
    siteThemeEnforceTimer = setTimeout(enforceSiteDarkMode, 60);
  }

  /* ───────── Подключение CSS тем ───────── */

  function ensureLink(id, file) {
    let el = document.getElementById(id);
    const href = chrome.runtime.getURL(file);
    if (!el) {
      el = document.createElement('link');
      el.id = id;
      el.rel = 'stylesheet';
    }
    if (el.getAttribute('href') !== href) el.href = href;
    document.head.appendChild(el); // всегда в конец <head>, чтобы перебивать стили сайта
    return el;
  }

  function linkReady(el) {
    if (el.sheet) return Promise.resolve();
    return new Promise((resolve) => {
      el.addEventListener('load', resolve, { once: true });
      el.addEventListener('error', resolve, { once: true });
    });
  }

  /*
   * Файлы темы меняются без «дыры»: новый подключается рядом со старым,
   * старый убирается только после загрузки нового. Иначе на миг пропадают цвета.
   */
  let styleToken = 0;
  function swapThemeLink(slot, file, token) {
    const href = chrome.runtime.getURL(file);
    const current = document.querySelector(`link[data-nx-slot="${slot}"][data-nx-active="true"]`);
    if (current && current.getAttribute('href') === href) {
      document.head.appendChild(current); // сохраняем порядок файлов
      return linkReady(current);
    }
    const el = document.createElement('link');
    el.rel = 'stylesheet';
    el.href = href;
    el.dataset.nxSlot = slot;
    document.head.appendChild(el);
    return linkReady(el).then(() => {
      if (token !== styleToken) {
        el.remove(); // пока грузился, выбрали другую тему
        return;
      }
      document.querySelectorAll(`link[data-nx-slot="${slot}"]`).forEach((other) => {
        if (other !== el) other.remove();
      });
      el.dataset.nxActive = 'true';
    });
  }

  function removeThemeLinks() {
    document.querySelectorAll('link[data-nx-slot]').forEach((el) => el.remove());
  }

  /* Порядок важен: база → палитра → анимации → скрытие рекламы → твики вёрстки.
     Возвращает промис: тема загружена и применена. */
  function applyStyles() {
    const token = ++styleToken;
    const themeId = THEMES[state.theme] ? state.theme : 'default';
    const themed = themeId !== 'default';
    const html = document.documentElement;

    html.classList.toggle('nx-hide-ads', !!state.hideAds);
    html.classList.toggle('nx-anim', !!state.animations);

    let ready;
    if (themed) {
      ready = Promise.all([
        swapThemeLink('theme-base', 'themes/base.css', token),
        swapThemeLink('theme-main', `themes/${themeId}.css`, token),
      ]).then(() => {
        if (token === styleToken) html.classList.add('nx-theme'); // включаем, когда цвета уже есть
      });
    } else {
      html.classList.remove('nx-theme');
      removeThemeLinks();
      ready = Promise.resolve();
    }
    ensureLink('nekto-ext-css-animations', 'themes/animations.css');
    ensureLink('nekto-ext-css-hide-ads', 'themes/hide-ads.css');
    ensureLink('nekto-ext-css-site-tweaks', 'themes/site-tweaks.css');
    return ready;
  }

  /* Фон гаснет, перекрашивается и снова загорается — без резкой смены цвета звёзд */
  function fadeBackdrop(during) {
    const c = document.getElementById('nekto-ext-backdrop');
    if (!c || c.dataset.on !== 'true') {
      during();
      return;
    }
    c.style.transition = 'opacity 0.25s ease';
    c.style.opacity = '0';
    setTimeout(() => {
      during();
      c.style.opacity = '';
      setTimeout(() => {
        c.style.transition = '';
      }, 300);
    }, 250);
  }

  let themeSwitchTimer;

  function backdrop() {
    return window.NektoBackdrop || null;
  }

  function refreshBackdropColors() {
    const b = backdrop();
    if (b) b.refreshColors();
  }

  function applyBackground() {
    const b = backdrop();
    if (!b) return;
    b.setAnimated(state.animations);
    b.setOptions(backdropOptions());
    b.setMode(state.background);
    refreshBackdropColors();
    setTimeout(refreshBackdropColors, 400); // на случай, если стили темы уже были в кэше и load не придёт
  }

  function backdropOptions() {
    return {
      brightness: state.bgBrightness / 100,
      density: state.bgDensity / 100,
      parallax: !!state.bgParallax,
    };
  }

  function updateBackdropOptions() {
    const b = backdrop();
    if (b) b.setOptions(backdropOptions());
  }

  /* Поиск → звёзды стягиваются к центру; найден собеседник → вспышка; разговор → спокойствие */
  function currentChatPhase() {
    if (convActive) return 'talk';
    if (document.querySelector('.audio-chat .chat-step.scan, .search_loader')) return 'search';
    return 'idle';
  }

  /* Прозрачность окна чата: фон карточки полупрозрачный, текст и кнопки — нет */
  function applyCardTransparency() {
    const html = document.documentElement;
    const t = Math.max(0, Math.min(90, Number(state.cardTransparency) || 0));
    html.classList.toggle('nx-card-see', t > 0);
    html.style.setProperty('--nx-card-opacity', `${100 - t}%`);
  }

  function setBackground(id) {
    state.background = BACKGROUNDS[id] ? id : 'none';
    saveState();
    applyBackground();
    updateBackgroundButtons();
  }

  function applyTheme(themeId) {
    state.theme = THEMES[themeId] ? themeId : 'default';
    saveState();
    enforceSiteDarkMode();

    // Плавная смена: на время перехода все цвета на странице анимируются (~0.5 с)
    const html = document.documentElement;
    const smooth = state.animations && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    clearTimeout(themeSwitchTimer);
    if (smooth) html.classList.add('nx-theme-switching');

    applyStyles().then(() => {
      if (smooth) fadeBackdrop(refreshBackdropColors);
      else refreshBackdropColors();
      refreshPipStyle();
      themeSwitchTimer = setTimeout(() => html.classList.remove('nx-theme-switching'), 650);
    });
    updateThemeButtons();
  }

  function applyCompactPanel() {
    if (rootEl) rootEl.classList.toggle('nekto-ext--compact', !!state.compactPanel);
  }

  /* ───────── Выпадающий список в стиле панели (системный select не красится под тему) ───────── */

  let openDropdown = null;

  function dropdownHtml(id) {
    return `
      <div class="nekto-ext__dropdown" id="${id}" data-open="false">
        <button type="button" class="nekto-ext__dropdown-btn" aria-haspopup="listbox" aria-expanded="false">
          <span class="nekto-ext__dropdown-value"></span>
          <span class="nekto-ext__dropdown-chevron">${ICONS.chevron}</span>
        </button>
        <div class="nekto-ext__dropdown-list" role="listbox"></div>
      </div>`;
  }

  function createDropdown(root, onChange) {
    const button = root.querySelector('.nekto-ext__dropdown-btn');
    const valueEl = root.querySelector('.nekto-ext__dropdown-value');
    const list = root.querySelector('.nekto-ext__dropdown-list');
    const items = () => [...list.querySelectorAll('.nekto-ext__dropdown-item')];

    const dd = {
      root,
      value: '',
      options: [],
      setOptions(options, value) {
        dd.options = options;
        list.textContent = '';
        options.forEach((o) => {
          const item = document.createElement('button');
          item.type = 'button';
          item.className = 'nekto-ext__dropdown-item';
          item.setAttribute('role', 'option');
          item.dataset.value = o.value;
          if (o.muted) item.dataset.muted = 'true';
          item.innerHTML = `<span class="nekto-ext__dropdown-label"></span><span class="nekto-ext__dropdown-check">${ICONS.check}</span>`;
          item.firstElementChild.textContent = o.label;
          item.addEventListener('click', () => {
            dd.close();
            button.focus();
            if (o.value === dd.value) return;
            dd.setValue(o.value);
            onChange(o.value);
          });
          list.appendChild(item);
        });
        dd.setValue(value);
      },
      setValue(value) {
        dd.value = value;
        const opt = dd.options.find((o) => o.value === value) || dd.options[0];
        valueEl.textContent = opt ? opt.label : '';
        items().forEach((it) => it.setAttribute('aria-selected', it.dataset.value === value ? 'true' : 'false'));
      },
      setDisabled(on) {
        button.disabled = on;
      },
      isOpen() {
        return root.dataset.open === 'true';
      },
      open() {
        if (openDropdown && openDropdown !== dd) openDropdown.close();
        root.dataset.open = 'true';
        button.setAttribute('aria-expanded', 'true');
        openDropdown = dd;
        const selected = list.querySelector('[aria-selected="true"]') || list.firstElementChild;
        if (selected) selected.focus({ preventScroll: true });
        root.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      },
      close() {
        root.dataset.open = 'false';
        button.setAttribute('aria-expanded', 'false');
        if (openDropdown === dd) openDropdown = null;
      },
    };

    button.addEventListener('click', () => (dd.isOpen() ? dd.close() : dd.open()));
    root.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
      e.preventDefault();
      if (!dd.isOpen()) {
        dd.open();
        return;
      }
      const all = items();
      const i = all.indexOf(document.activeElement);
      const next = all[(i + (e.key === 'ArrowDown' ? 1 : -1) + all.length) % all.length];
      if (next) next.focus();
    });
    return dd;
  }

  /* ───────── Панель ───────── */

  let rootEl;
  let sections = {};
  let statEls = {};
  let flyoutHeadEl;

  function setNavActive() {
    if (!rootEl) return;
    rootEl.querySelectorAll('.nekto-ext__icon-btn[data-tab]').forEach((btn) => {
      const active = openSection === btn.dataset.tab;
      btn.setAttribute('data-active', active ? 'true' : 'false');
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
  }

  function setFlyoutOpen(on) {
    if (!rootEl) return;
    rootEl.classList.toggle('nekto-ext--open', on);
    const fly = rootEl.querySelector('.nekto-ext__flyout');
    if (fly) fly.setAttribute('aria-hidden', on ? 'false' : 'true');
  }

  function closeFlyout() {
    if (openDropdown) openDropdown.close();
    openSection = null;
    setFlyoutOpen(false);
    setNavActive();
    syncPipeline();
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
    if (id === 'stats') renderStats();
    if (openDropdown) openDropdown.close();
    if (id === 'sound') refreshDevices();
    setFlyoutOpen(true);
    setNavActive();
    syncPipeline();
  }

  function onDocPointerDown(e) {
    if (!rootEl || !openSection) return;
    if (openDropdown && !openDropdown.root.contains(e.target)) openDropdown.close();
    if (rootEl.contains(e.target)) return;
    closeFlyout();
  }

  function onDocKeyDown(e) {
    if (e.key !== 'Escape') return;
    if (openDropdown) {
      const btn = openDropdown.root.querySelector('.nekto-ext__dropdown-btn');
      openDropdown.close();
      btn.focus();
      return;
    }
    if (openSection) closeFlyout();
  }

  function renderStats() {
    if (!statEls.conversations) return;
    rollDaily();
    const s = state.stats;
    statEls.conversations.textContent = String(s.conversations);
    statEls.today.textContent = String(s.todayConversations);
    statEls.total.textContent = formatDuration(s.totalSeconds);
    statEls.average.textContent = s.conversations ? formatDuration(s.totalSeconds / s.conversations) : '—';
    statEls.longest.textContent = formatDuration(s.longestSeconds);
    statEls.skips.textContent = String(s.skips);
    statEls.searches.textContent = String(s.searchesStarted);
  }

  /*
   * Сброс всех настроек к состоянию «только что установил».
   * Статистика сохраняется — у неё своя кнопка сброса на вкладке «Статистика».
   * Применяется сразу, без перезагрузки страницы, чтобы не оборвать идущий звонок.
   */
  function resetAllSettings() {
    const btn = rootEl.querySelector('#nekto-ext-reset-settings');
    if (btn.dataset.confirm !== '1') {
      btn.dataset.confirm = '1';
      btn.textContent = 'Нажмите ещё раз для сброса';
      setTimeout(() => {
        if (!btn.isConnected) return;
        btn.dataset.confirm = '';
        btn.textContent = 'Сбросить все настройки';
      }, 3000);
      return;
    }

    const hadCustomMic = !!state.audio.micId;
    const stats = state.stats;
    setMonitoring(false); // самопрослушку выключаем и закрываем микрофон панели
    stopPipeline();

    state = defaultState();
    state.stats = stats;
    rollDaily();
    saveState();

    // устройства — снова «как в системе», в том числе в идущем звонке
    syncPagePrefs();
    if (hadCustomMic) document.dispatchEvent(new CustomEvent('nx-ext:mic-change', { detail: '' }));
    applyOutputToSiteAudio();

    // оформление, фон, своя картинка, часы
    applyStyles().then(() => {
      refreshBackdropColors();
      refreshPipStyle();
    });
    applyBackground();
    applyCardTransparency();
    removeBgImage();
    applyClock();
    renderPing();

    // панель пересобирается с настройками по умолчанию и остаётся открытой на «Настройках»
    openSection = null;
    buildPanel();
    toggleSection('settings');
    const done = rootEl.querySelector('#nekto-ext-reset-settings');
    done.textContent = 'Настройки сброшены';
    done.disabled = true;
    setTimeout(() => {
      if (!done.isConnected) return;
      done.textContent = 'Сбросить все настройки';
      done.disabled = false;
    }, 1600);
  }

  function resetStats() {
    const btn = rootEl.querySelector('#nekto-ext-reset-stats');
    if (btn.dataset.confirm !== '1') {
      btn.dataset.confirm = '1';
      btn.textContent = 'Нажмите ещё раз для сброса';
      setTimeout(() => {
        btn.dataset.confirm = '';
        btn.textContent = 'Сбросить статистику';
      }, 3000);
      return;
    }
    btn.dataset.confirm = '';
    btn.textContent = 'Сбросить статистику';
    state.stats = defaultState().stats;
    rollDaily();
    saveState();
    renderStats();
  }

  function updateThemeButtons() {
    if (!rootEl) return;
    rootEl.querySelectorAll('.nekto-ext__theme').forEach((btn) => {
      const active = btn.dataset.theme === state.theme;
      btn.setAttribute('data-active', active ? 'true' : 'false');
      btn.setAttribute('aria-checked', active ? 'true' : 'false');
    });
  }

  function updateBackgroundButtons() {
    if (!rootEl) return;
    rootEl.querySelectorAll('.nekto-ext__bg').forEach((btn) => {
      const active = btn.dataset.bg === state.background;
      btn.setAttribute('data-active', active ? 'true' : 'false');
      btn.setAttribute('aria-checked', active ? 'true' : 'false');
    });
  }

  function buildPanel() {
    const existing = document.getElementById('nekto-ext-root');
    if (existing) existing.remove();

    rootEl = document.createElement('div');
    rootEl.id = 'nekto-ext-root';
    // любой клик/ввод в панели после перезагрузки расширения — остановка вместо ошибки
    ['click', 'input', 'change'].forEach((type) => {
      rootEl.addEventListener(
        type,
        (e) => {
          if (!extAlive()) e.stopImmediatePropagation();
        },
        true
      );
    });

    rootEl.innerHTML = `
      <div class="nekto-ext__dock">
        <div class="nekto-ext__flyout" aria-hidden="true">
          <div class="nekto-ext__flyout-inner">
            <div class="nekto-ext__flyout-head" id="nekto-ext-flyout-head"></div>
            <div class="nekto-ext__flyout-body">
              <section class="nekto-ext__section" data-section="settings" data-visible="false">
                <div class="nekto-ext__health" id="nekto-ext-health" hidden>
                  <div class="nekto-ext__health-title">Похоже, сайт обновился</div>
                  <ul class="nekto-ext__health-list" id="nekto-ext-health-list"></ul>
                </div>
                <div class="nekto-ext__row">
                  <span class="nekto-ext__label-wrap">
                    <span class="nekto-ext__label">Авто-скип</span>
                    <span class="nekto-ext__hint">Сразу начинать новый поиск после конца разговора</span>
                  </span>
                  <label class="nekto-ext__switch">
                    <input type="checkbox" id="nekto-ext-autoskip" />
                    <span></span>
                  </label>
                </div>
                <div class="nekto-ext__row">
                  <span class="nekto-ext__label-wrap">
                    <span class="nekto-ext__label">Скрыть рекламу</span>
                    <span class="nekto-ext__hint">Реклама, меню сайта и промо приложений</span>
                  </span>
                  <label class="nekto-ext__switch">
                    <input type="checkbox" id="nekto-ext-hideads" />
                    <span></span>
                  </label>
                </div>
                <div class="nekto-ext__row">
                  <span class="nekto-ext__label-wrap">
                    <span class="nekto-ext__label">Плавные анимации</span>
                    <span class="nekto-ext__hint">Переходы между поиском, звонком и концом разговора</span>
                  </span>
                  <label class="nekto-ext__switch">
                    <input type="checkbox" id="nekto-ext-animations" />
                    <span></span>
                  </label>
                </div>
                <div class="nekto-ext__row">
                  <span class="nekto-ext__label-wrap">
                    <span class="nekto-ext__label">Пинг в звонке</span>
                    <span class="nekto-ext__hint">Задержка до собеседника под таймером разговора</span>
                  </span>
                  <label class="nekto-ext__switch">
                    <input type="checkbox" id="nekto-ext-ping" />
                    <span></span>
                  </label>
                </div>
                <div class="nekto-ext__row">
                  <span class="nekto-ext__label-wrap">
                    <span class="nekto-ext__label">Компактная панель</span>
                    <span class="nekto-ext__hint">Картинка в картинке</span>
                  </span>
                  <label class="nekto-ext__switch">
                    <input type="checkbox" id="nekto-ext-compact" />
                    <span></span>
                  </label>
                </div>
                <div class="nekto-ext__row">
                  <span class="nekto-ext__label-wrap">
                    <span class="nekto-ext__label">Часы</span>
                    <span class="nekto-ext__hint">Время компьютера вверху страницы</span>
                  </span>
                  <label class="nekto-ext__switch">
                    <input type="checkbox" id="nekto-ext-clock" />
                    <span></span>
                  </label>
                </div>
                <div class="nekto-ext__row">
                  <span class="nekto-ext__label-wrap">
                    <span class="nekto-ext__label">Мини-окно</span>
                    <span class="nekto-ext__hint" id="nekto-ext-pip-hint">Таймер и кнопки «Скип» и «Микро» поверх всех программ</span>
                  </span>
                  <label class="nekto-ext__switch">
                    <input type="checkbox" id="nekto-ext-pip" />
                    <span></span>
                  </label>
                </div>
                <button type="button" class="nekto-ext__btn nekto-ext__btn--danger" id="nekto-ext-skip-now">Скипнуть сейчас</button>
                <button type="button" class="nekto-ext__btn nekto-ext__btn--ghost" id="nekto-ext-reset-settings">Сбросить все настройки</button>
              </section>
              <section class="nekto-ext__section" data-section="sound" data-visible="false">
                <div class="nekto-ext__field">
                  <span class="nekto-ext__label">Микрофон</span>
                  ${dropdownHtml('nekto-ext-mic')}
                </div>
                <div class="nekto-ext__meter" aria-hidden="true"><span id="nekto-ext-meter"></span></div>
                <div class="nekto-ext__field">
                  <span class="nekto-ext__label">Наушники / динамики</span>
                  ${dropdownHtml('nekto-ext-output')}
                </div>
                <button type="button" class="nekto-ext__btn" id="nekto-ext-device-access" hidden>Показать названия устройств</button>
                <div class="nekto-ext__divider"></div>
                <div class="nekto-ext__row">
                  <span class="nekto-ext__label-wrap">
                    <span class="nekto-ext__label">Самопрослушка</span>
                    <span class="nekto-ext__hint">Слышать свой микрофон. Только в наушниках, иначе будет эхо</span>
                  </span>
                  <label class="nekto-ext__switch">
                    <input type="checkbox" id="nekto-ext-monitor" />
                    <span></span>
                  </label>
                </div>
                <div class="nekto-ext__range-row" id="nekto-ext-volume-row" data-disabled="true">
                  <span class="nekto-ext__hint">Громкость</span>
                  <input type="range" class="nekto-ext__range" id="nekto-ext-monitor-volume" min="0" max="200" step="5" />
                  <span class="nekto-ext__range-value" id="nekto-ext-monitor-volume-value">100%</span>
                </div>
                <p class="nekto-ext__status" id="nekto-ext-sound-status" hidden></p>
              </section>
              <section class="nekto-ext__section" data-section="themes" data-visible="false">
                <div class="nekto-ext__theme-list" id="nekto-ext-theme-list" role="radiogroup" aria-label="Тема"></div>
              </section>
              <section class="nekto-ext__section" data-section="background" data-visible="false">
                <div class="nekto-ext__bg-grid" id="nekto-ext-bg-list" role="radiogroup" aria-label="Фон"></div>
                <div class="nekto-ext__divider nekto-ext__divider--spaced"></div>
                <div class="nekto-ext__subhead">Картинка</div>
                <div class="nekto-ext__wall-grid" id="nekto-ext-wall-grid" role="radiogroup" aria-label="Картинка на фоне"></div>
                <p class="nekto-ext__status" id="nekto-ext-bgimg-status" hidden></p>
                <div class="nekto-ext__bgimg-controls" id="nekto-ext-bgimg-controls" data-disabled="true">
                  <div class="nekto-ext__slider">
                    <div class="nekto-ext__slider-head">
                      <span class="nekto-ext__label">Затемнение картинки</span>
                      <span class="nekto-ext__range-value" id="nekto-ext-bgimg-dim-value"></span>
                    </div>
                    <input type="range" class="nekto-ext__range" id="nekto-ext-bgimg-dim" min="0" max="90" step="5" />
                  </div>
                  <div class="nekto-ext__slider">
                    <div class="nekto-ext__slider-head">
                      <span class="nekto-ext__label">Размытие картинки</span>
                      <span class="nekto-ext__range-value" id="nekto-ext-bgimg-blur-value"></span>
                    </div>
                    <input type="range" class="nekto-ext__range" id="nekto-ext-bgimg-blur" min="0" max="20" step="1" />
                  </div>
                </div>
                <div class="nekto-ext__divider nekto-ext__divider--spaced"></div>
                <div class="nekto-ext__slider">
                  <div class="nekto-ext__slider-head">
                    <span class="nekto-ext__label">Яркость</span>
                    <span class="nekto-ext__range-value" id="nekto-ext-bg-brightness-value"></span>
                  </div>
                  <input type="range" class="nekto-ext__range" id="nekto-ext-bg-brightness" min="20" max="180" step="5" />
                </div>
                <div class="nekto-ext__slider">
                  <div class="nekto-ext__slider-head">
                    <span class="nekto-ext__label">Плотность</span>
                    <span class="nekto-ext__range-value" id="nekto-ext-bg-density-value"></span>
                  </div>
                  <input type="range" class="nekto-ext__range" id="nekto-ext-bg-density" min="30" max="200" step="10" />
                </div>
                <div class="nekto-ext__row nekto-ext__row--last">
                  <span class="nekto-ext__label-wrap">
                    <span class="nekto-ext__label">Параллакс</span>
                    <span class="nekto-ext__hint">Фон слегка смещается за курсором</span>
                  </span>
                  <label class="nekto-ext__switch">
                    <input type="checkbox" id="nekto-ext-bg-parallax" />
                    <span></span>
                  </label>
                </div>
                <div class="nekto-ext__divider nekto-ext__divider--spaced"></div>
                <div class="nekto-ext__slider nekto-ext__slider--last">
                  <div class="nekto-ext__slider-head">
                    <span class="nekto-ext__label">Прозрачность окна чата</span>
                    <span class="nekto-ext__range-value" id="nekto-ext-card-transparency-value"></span>
                  </div>
                  <input type="range" class="nekto-ext__range" id="nekto-ext-card-transparency" min="0" max="90" step="5" />
                </div>
              </section>
              <section class="nekto-ext__section" data-section="stats" data-visible="false">
                <div class="nekto-ext__stat-grid">
                  <div class="nekto-ext__stat"><b id="nekto-stat-conv">0</b><span>Разговоров</span></div>
                  <div class="nekto-ext__stat"><b id="nekto-stat-today">0</b><span>Сегодня</span></div>
                  <div class="nekto-ext__stat nekto-ext__stat--wide"><b id="nekto-stat-total">0</b><span>Всего в разговорах</span></div>
                  <div class="nekto-ext__stat"><b id="nekto-stat-avg">—</b><span>В среднем</span></div>
                  <div class="nekto-ext__stat"><b id="nekto-stat-long">0</b><span>Самый длинный</span></div>
                  <div class="nekto-ext__stat"><b id="nekto-stat-skips">0</b><span>Скипов</span></div>
                  <div class="nekto-ext__stat"><b id="nekto-stat-searches">0</b><span>Поисков</span></div>
                </div>
                <button type="button" class="nekto-ext__btn nekto-ext__btn--ghost" id="nekto-ext-reset-stats">Сбросить статистику</button>
              </section>
            </div>
          </div>
        </div>
        <div class="nekto-ext__launcher" role="toolbar" aria-label="Nekto Voice Panel">
          <button type="button" class="nekto-ext__icon-btn" data-tab="settings" aria-label="Настройки">${ICONS.settings}</button>
          <button type="button" class="nekto-ext__icon-btn" data-tab="sound" aria-label="Звук">${ICONS.sound}</button>
          <button type="button" class="nekto-ext__icon-btn" data-tab="themes" aria-label="Тема">${ICONS.themes}</button>
          <button type="button" class="nekto-ext__icon-btn" data-tab="background" aria-label="Фон">${ICONS.background}</button>
          <button type="button" class="nekto-ext__icon-btn" data-tab="stats" aria-label="Статистика">${ICONS.stats}</button>
        </div>
      </div>
    `;

    document.body.appendChild(rootEl);

    flyoutHeadEl = rootEl.querySelector('#nekto-ext-flyout-head');
    sections.settings = rootEl.querySelector('[data-section="settings"]');
    sections.sound = rootEl.querySelector('[data-section="sound"]');
    sections.themes = rootEl.querySelector('[data-section="themes"]');
    sections.background = rootEl.querySelector('[data-section="background"]');
    sections.stats = rootEl.querySelector('[data-section="stats"]');

    statEls = {
      conversations: rootEl.querySelector('#nekto-stat-conv'),
      today: rootEl.querySelector('#nekto-stat-today'),
      total: rootEl.querySelector('#nekto-stat-total'),
      average: rootEl.querySelector('#nekto-stat-avg'),
      longest: rootEl.querySelector('#nekto-stat-long'),
      skips: rootEl.querySelector('#nekto-stat-skips'),
      searches: rootEl.querySelector('#nekto-stat-searches'),
    };

    const bgList = rootEl.querySelector('#nekto-ext-bg-list');
    Object.values(BACKGROUNDS).forEach((bg) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'nekto-ext__bg';
      b.dataset.bg = bg.id;
      b.setAttribute('role', 'radio');
      b.innerHTML = `<span class="nekto-ext__bg-icon">${bg.icon}</span><span class="nekto-ext__bg-name">${bg.name}</span>`;
      b.addEventListener('click', () => setBackground(bg.id));
      bgList.appendChild(b);
    });

    const bindSlider = (id, key, unit, onInput) => {
      const input = rootEl.querySelector(`#${id}`);
      const value = rootEl.querySelector(`#${id}-value`);
      const show = () => {
        value.textContent = `${state[key]}${unit}`;
      };
      input.value = String(state[key]);
      show();
      input.addEventListener('input', () => {
        state[key] = Number(input.value);
        show();
        onInput();
      });
      input.addEventListener('change', () => saveState());
    };
    bindSlider('nekto-ext-bg-brightness', 'bgBrightness', '%', updateBackdropOptions);
    bindSlider('nekto-ext-bg-density', 'bgDensity', '%', updateBackdropOptions);
    bindSlider('nekto-ext-bgimg-dim', 'bgImageDim', '%', applyBgImage);
    bindSlider('nekto-ext-bgimg-blur', 'bgImageBlur', ' px', applyBgImage);
    bindSlider('nekto-ext-card-transparency', 'cardTransparency', '%', applyCardTransparency);

    renderWallGrid();


    const parallaxInput = rootEl.querySelector('#nekto-ext-bg-parallax');
    parallaxInput.checked = state.bgParallax;
    parallaxInput.addEventListener('change', () => {
      state.bgParallax = parallaxInput.checked;
      saveState();
      updateBackdropOptions();
    });

    const themeList = rootEl.querySelector('#nekto-ext-theme-list');
    Object.values(THEMES).forEach((t) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'nekto-ext__theme';
      b.dataset.theme = t.id;
      b.setAttribute('role', 'radio');
      b.innerHTML = `<span class="nekto-ext__theme-dot" style="background:${t.dot}"></span><span class="nekto-ext__theme-name">${t.name}</span><span class="nekto-ext__theme-check">${ICONS.check}</span>`;
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
    autoInput.checked = state.autoSkip;
    autoInput.addEventListener('change', () => setAutoSkip(autoInput.checked));

    const adsInput = rootEl.querySelector('#nekto-ext-hideads');
    adsInput.checked = state.hideAds;
    adsInput.addEventListener('change', () => {
      state.hideAds = adsInput.checked;
      saveState();
      applyStyles();
    });

    const pipInput = rootEl.querySelector('#nekto-ext-pip');
    pipInput.checked = !!pipWin;
    if (!canPip) {
      pipInput.disabled = true;
      rootEl.querySelector('#nekto-ext-pip-hint').textContent = 'Этот браузер не поддерживает мини-окно';
    }
    pipInput.addEventListener('change', () => {
      if (pipInput.checked) openPip(); // клик даёт браузеру разрешение открыть окно
      else closePip();
    });

    const clockInput = rootEl.querySelector('#nekto-ext-clock');
    clockInput.checked = state.showClock;
    clockInput.addEventListener('change', () => {
      state.showClock = clockInput.checked;
      saveState();
      applyClock();
    });

    const compactInput = rootEl.querySelector('#nekto-ext-compact');
    compactInput.checked = state.compactPanel;
    compactInput.addEventListener('change', () => {
      state.compactPanel = compactInput.checked;
      saveState();
      applyCompactPanel();
    });

    const pingInput = rootEl.querySelector('#nekto-ext-ping');
    pingInput.checked = state.showPing;
    pingInput.addEventListener('change', () => {
      state.showPing = pingInput.checked;
      saveState();
      renderPing();
    });

    const animInput = rootEl.querySelector('#nekto-ext-animations');
    animInput.checked = state.animations;
    animInput.addEventListener('change', () => {
      state.animations = animInput.checked;
      saveState();
      applyStyles();
      const b = backdrop();
      if (b) b.setAnimated(state.animations);
    });

    sound.els = {
      mic: createDropdown(rootEl.querySelector('#nekto-ext-mic'), (id) => setMic(id)),
      output: createDropdown(rootEl.querySelector('#nekto-ext-output'), (id) => setOutput(id)),
      access: rootEl.querySelector('#nekto-ext-device-access'),
      meter: rootEl.querySelector('#nekto-ext-meter'),
      monitor: rootEl.querySelector('#nekto-ext-monitor'),
      volume: rootEl.querySelector('#nekto-ext-monitor-volume'),
      volumeValue: rootEl.querySelector('#nekto-ext-monitor-volume-value'),
      volumeRow: rootEl.querySelector('#nekto-ext-volume-row'),
      status: rootEl.querySelector('#nekto-ext-sound-status'),
    };
    sound.els.access.addEventListener('click', () => requestDeviceAccess());
    sound.els.monitor.addEventListener('change', () => setMonitoring(sound.els.monitor.checked));
    sound.els.volume.value = String(state.audio.monitorVolume);
    sound.els.volume.addEventListener('input', () => setMonitorVolume(Number(sound.els.volume.value)));
    sound.els.volume.addEventListener('change', () => saveState());
    setMonitorVolume(state.audio.monitorVolume);

    rootEl.querySelector('#nekto-ext-skip-now').addEventListener('click', () => skipConversation());
    rootEl.querySelector('#nekto-ext-reset-stats').addEventListener('click', () => resetStats());
    rootEl.querySelector('#nekto-ext-reset-settings').addEventListener('click', () => resetAllSettings());

    updateThemeButtons();
    updateBackgroundButtons();
    applyCompactPanel();
    renderHealth();
    renderStats();
  }

  /* ───────── Запуск ───────── */

  /*
   * После перезагрузки расширения на chrome://extensions старая копия этого скрипта
   * на уже открытой вкладке теряет связь с расширением: любые chrome.* вызовы бросают
   * «Extension context invalidated». Такая копия тихо останавливается и просит обновить страницу.
   */
  let extDead = false;
  let domObserver = null;
  let pollTimer = 0;

  function extAlive() {
    if (extDead) return false;
    try {
      if (chrome.runtime && chrome.runtime.id) return true;
    } catch (_) {
      /* контекст уже недоступен */
    }
    shutdownStaleScript();
    return false;
  }

  /* Обёртка для обработчиков событий и таймеров: после потери контекста ничего не делают */
  function guarded(fn) {
    return function () {
      if (!extAlive()) return undefined;
      return fn.apply(this, arguments);
    };
  }

  function shutdownStaleScript() {
    if (extDead) return;
    extDead = true;
    clearInterval(pollTimer);
    clearTimeout(clockTimer);
    clearTimeout(autoSkipTimer);
    if (domObserver) domObserver.disconnect();
    try {
      stopPipeline();
      closePip();
    } catch (_) {
      /* не мешаем остановке */
    }
    if (rootEl) rootEl.remove();
    if (clockEl) clockEl.remove();
    showReloadNotice();
  }

  function showReloadNotice() {
    if (document.getElementById('nekto-ext-reload-notice')) return;
    const el = document.createElement('div');
    el.id = 'nekto-ext-reload-notice';
    el.innerHTML = '<span>Расширение обновлено — обновите страницу</span><button type="button">Обновить</button>';
    el.querySelector('button').addEventListener('click', () => window.location.reload());
    document.body.appendChild(el);
  }

  function startDomObserver() {
    domObserver = new MutationObserver(() => {
      if (!extAlive()) return;
      scheduleAutoSkip();
      scheduleEnforceSiteDark();
      if (rootEl && !rootEl.isConnected) document.body.appendChild(rootEl);
      if (state.showClock && clockEl && !clockEl.isConnected) document.body.appendChild(clockEl);
      if (bgImageEl && !bgImageEl.isConnected && currentBgImageSrc()) document.body.prepend(bgImageEl);
      const b = backdrop();
      if (b) b.ensureAttached();
    });
    domObserver.observe(document.body, { childList: true, subtree: true });
  }

  function init() {
    Promise.all([loadState(), loadBgImage()]).then(() => {
      rollDaily();
      syncPagePrefs();
      buildPanel();
      enforceSiteDarkMode();
      applyStyles().then(refreshBackdropColors);
      applyBackground();
      applyCardTransparency();
      if (state.bgImage === 'legacy') {
        state.bgImage = bgImageUrl ? 'custom' : 'none';
        saveState();
        renderWallGrid();
      }
      applyBgImage();
      applyClock();
      window.addEventListener('resize', guarded(schedulePositionClock), { passive: true });
      window.addEventListener('scroll', guarded(schedulePositionClock), { passive: true });
      startDomObserver();
      setTimeout(guarded(runStartupChecks), 15000);
      checkAndClickButton();

      document.addEventListener('pointerdown', guarded(onDocPointerDown), true);
      document.addEventListener('keydown', guarded(onDocKeyDown), true);
      document.addEventListener('click', guarded(onDocClickCapture), true);
      document.addEventListener('nx-ext:ping', guarded(onPing));
      window.addEventListener('pagehide', guarded(finishActiveConversation));
      window.addEventListener('pagehide', () => closePip());
      if (navigator.mediaDevices && navigator.mediaDevices.addEventListener) {
        navigator.mediaDevices.addEventListener('devicechange', guarded(() => refreshDevices()));
      }
      pollTimer = window.setInterval(guarded(pollConversation), 400);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

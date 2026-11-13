/*
 * Выполняется в контексте страницы (world: MAIN), до скриптов сайта.
 * Задачи:
 *  - открывать микрофон, выбранный в панели расширения;
 *  - менять микрофон на лету: в потоке сайта и в текущем звонке (replaceTrack);
 *  - направлять все звуки сайта (собеседник, connect.mp3, message.wav) в выбранные наушники.
 * Настройки приходят из content/main.js через localStorage и события на document.
 */
(function () {
  'use strict';

  const MIC_KEY = 'nxExtMicId';
  const OUTPUT_KEY = 'nxExtOutputId';

  const md = navigator.mediaDevices;
  if (!md || !md.getUserMedia) return;

  const origGetUserMedia = md.getUserMedia.bind(md);
  const streams = new Set(); // аудиопотоки, выданные сайту
  const peers = new Set(); // соединения, в которые сайт добавлял треки
  const ownTracks = new WeakSet(); // треки, открытые нами при переключении

  function readPref(key) {
    try {
      return localStorage.getItem(key) || '';
    } catch (_) {
      return '';
    }
  }

  function withMic(constraints, micId) {
    if (!micId || !constraints || !constraints.audio) return constraints;
    const audio = typeof constraints.audio === 'object' ? { ...constraints.audio } : {};
    audio.deviceId = { exact: micId };
    return { ...constraints, audio };
  }

  md.getUserMedia = function (constraints) {
    const micId = readPref(MIC_KEY);
    const wanted = withMic(constraints, micId);
    const request = wanted === constraints
      ? origGetUserMedia(constraints)
      : origGetUserMedia(wanted).catch(() => origGetUserMedia(constraints)); // устройство отключили
    return request.then((stream) => {
      if (constraints && constraints.audio && stream.getAudioTracks().length) streams.add(stream);
      return stream;
    });
  };

  /* Запоминаем соединения: для замены трека в идущем звонке и для замера пинга */
  const PC = window.RTCPeerConnection;
  if (PC) {
    ['addTrack', 'setLocalDescription', 'setRemoteDescription'].forEach((name) => {
      const orig = PC.prototype[name];
      if (typeof orig !== 'function') return;
      PC.prototype[name] = function () {
        peers.add(this);
        return orig.apply(this, arguments);
      };
    });
  }

  /* ───────── Пинг до собеседника ───────── */

  // RTT выбранной пары ICE-кандидатов, в мс; запасной вариант — RTT из RTCP-отчёта собеседника
  async function measurePing(pc) {
    const stats = await pc.getStats();
    let pairId = null;
    stats.forEach((r) => {
      if (r.type === 'transport' && r.selectedCandidatePairId) pairId = r.selectedCandidatePairId;
    });
    let rtt = null;
    stats.forEach((r) => {
      if (r.type !== 'candidate-pair' || typeof r.currentRoundTripTime !== 'number') return;
      const selected = pairId ? r.id === pairId : r.nominated && r.state === 'succeeded';
      if (selected) rtt = r.currentRoundTripTime;
    });
    if (rtt === null) {
      stats.forEach((r) => {
        if (r.type === 'remote-inbound-rtp' && r.kind === 'audio' && typeof r.roundTripTime === 'number') {
          rtt = r.roundTripTime;
        }
      });
    }
    return rtt === null ? null : rtt * 1000;
  }

  let lastPing;
  async function reportPing() {
    let ping = null;
    for (const pc of peers) {
      if (pc.signalingState === 'closed') {
        peers.delete(pc);
        continue;
      }
      const state = pc.iceConnectionState;
      if (state !== 'connected' && state !== 'completed') continue;
      try {
        ping = await measurePing(pc);
      } catch (_) {
        ping = null;
      }
      if (ping !== null) break;
    }
    const value = ping === null ? -1 : Math.round(ping);
    if (value === lastPing) return;
    lastPing = value;
    document.dispatchEvent(new CustomEvent('nx-ext:ping', { detail: value })); // -1 — звонка нет
  }

  setInterval(() => {
    if (peers.size || lastPing !== -1) reportPing().catch(() => {});
  }, 1000);

  async function switchMic(micId) {
    const live = [...streams].filter((s) => s.getAudioTracks().some((t) => t.readyState === 'live'));
    if (!live.length) return; // сайт ещё не открывал микрофон — выбор применится при первом запросе

    const fresh = await origGetUserMedia({ audio: micId ? { deviceId: { exact: micId } } : true });
    const newTrack = fresh.getAudioTracks()[0];
    if (!newTrack) return;
    ownTracks.add(newTrack);

    const replaced = new Set();
    live.forEach((stream) => {
      const old = stream.getAudioTracks()[0];
      if (!old || old === newTrack) return;
      newTrack.enabled = old.enabled; // сохраняем состояние «микрофон выключен»
      stream.removeTrack(old);
      stream.addTrack(newTrack); // сайт берёт localStream.getTracks()[0] для mute и новых звонков
      replaced.add(old);
    });

    for (const pc of peers) {
      if (pc.signalingState === 'closed') {
        peers.delete(pc);
        continue;
      }
      for (const sender of pc.getSenders()) {
        if (sender.track && sender.track.kind === 'audio' && sender.track !== newTrack) {
          try {
            await sender.replaceTrack(newTrack);
          } catch (_) {
            /* соединение закрывается */
          }
        }
      }
    }

    // Свои старые треки закрываем; исходный трек сайта не трогаем — за ним следит монитор сайта
    replaced.forEach((t) => {
      if (ownTracks.has(t)) t.stop();
    });
  }

  /* Наушники: любое воспроизведение сайта идёт в выбранное устройство */
  function applySink(el, outputId) {
    if (!el || typeof el.setSinkId !== 'function') return;
    if ((el.sinkId || '') === outputId) return;
    el.setSinkId(outputId).catch(() => {});
  }

  /*
   * Звуки сайта (connect.mp3 — найден собеседник, message.wav — сообщение) можно выключить:
   * вместо них играют звуки расширения. Беззвучный «прогрев» плеера сайта (fixAutoPlay:
   * muted + громкость 0) не трогаем — от него зависит автовоспроизведение голоса собеседника.
   */
  const MUTE_SITE_SOUNDS_KEY = 'nxExtMuteSiteSounds';
  function isAudibleSiteSound(el) {
    const src = el.currentSrc || el.src || '';
    return src.includes('/audiochat/sound/') && !el.muted && el.volume > 0;
  }

  const origPlay = HTMLMediaElement.prototype.play;
  HTMLMediaElement.prototype.play = function () {
    if (readPref(MUTE_SITE_SOUNDS_KEY) === '1' && isAudibleSiteSound(this)) {
      return Promise.resolve(); // для сайта — «сыграло», на деле тишина
    }
    applySink(this, readPref(OUTPUT_KEY));
    return origPlay.apply(this, arguments);
  };

  /* ───────── Микрофон можно выключить сразу, а не через минуту ───────── */

  /*
   * Сайт разрешает кнопку микрофона только после 60 с разговора (иначе показывает подсказку).
   * В первую минуту перехватываем нажатие и делаем ровно то же, что сайт делает после минуты:
   * выключаем свой трек, обновляем кнопку и сообщаем собеседнику (peerMute) — у него
   * появится значок «микрофон выключен». После минуты работает штатная логика сайта.
   */
  function findVm(el, method) {
    for (let node = el; node; node = node.parentElement) {
      for (let vm = node.__vue__; vm; vm = vm.$parent) {
        if (typeof vm[method] === 'function') return vm;
      }
    }
    return null;
  }

  function setOwnMicEnabled(enabled) {
    streams.forEach((stream) => {
      stream.getAudioTracks().forEach((t) => {
        if (t.readyState === 'live') t.enabled = enabled;
      });
    });
  }

  document.addEventListener(
    'click',
    (e) => {
      const btn = e.target instanceof Element && e.target.closest('.callScreen__microBtn');
      if (!btn) return;
      const vm = findVm(btn, 'muteAudio');
      if (!vm || !vm.activeConnectionId || !(vm.callTime <= 60)) return; // после минуты — как на сайте
      e.preventDefault();
      e.stopImmediatePropagation();

      const muted = !vm.mutedAudio;
      vm.mutedAudio = muted;
      if (muted) vm.localMuteAudio = true;
      setOwnMicEnabled(!muted);
      try {
        vm.$socketActions.peerMute(vm.activeConnectionId, muted);
      } catch (_) {
        /* сокет недоступен — микрофон всё равно выключен локально */
      }
    },
    true
  );

  // Новый разговор начинается с включённым микрофоном, если сайт считает его включённым
  let lastConnectionId = null;
  setInterval(() => {
    const btn = document.querySelector('.callScreen__microBtn');
    const vm = btn && findVm(btn, 'muteAudio');
    const id = vm ? vm.activeConnectionId : null;
    if (id && id !== lastConnectionId && !vm.mutedAudio) setOwnMicEnabled(true);
    lastConnectionId = id;
  }, 1000);

  /* ───────── Громкость собеседника из мини-окна ───────── */

  /* Через хранилище сайта — тогда его собственный ползунок громкости остаётся синхронным */
  document.addEventListener('nx-ext:set-volume', (e) => {
    const v = Math.max(0, Math.min(100, Math.round(Number(e.detail) || 0)));
    const root = document.getElementById('app');
    const vm = root && root.__vue__;
    try {
      vm.$store.commit('user/setVolume', v);
      vm.$bus.$emit('changeVolume', v); // сайт сам выставит громкость звука собеседника
    } catch (_) {
      const audio = document.getElementById('audioStream');
      if (audio) audio.volume = v / 100; // запасной путь, если внутренности сайта изменились
    }
  });

  document.addEventListener('nx-ext:mic-change', (e) => {
    switchMic(typeof e.detail === 'string' ? e.detail : readPref(MIC_KEY)).catch(() => {});
  });
})();

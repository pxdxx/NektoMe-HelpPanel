/*
 * Декоративный фон страницы: звёзды, созвездия, светлячки, туманность,
 * дождь на стекле, снег, ночной город, луна.
 * Рисуется на <canvas> под всем содержимым сайта (z-index: -1).
 * Цвета берутся из переменных активной темы (--nx-accent, --nx-text, --nx-page-solid),
 * поэтому фон сам подстраивается под любую тему. Всё приглушённое — для ночи.
 *
 * Фон реагирует на состояние чата (setPhase):
 *   search — звёзды медленно стягиваются к центру,
 *   talk   — при начале разговора мягкая вспышка, дальше всё успокаивается.
 *
 * API: window.NektoBackdrop.setMode / setAnimated / setOptions / setPhase / refreshColors / ensureAttached
 */
(function () {
  'use strict';

  const FALLBACK = { accent: '#8fa6bf', text: '#dfe3ea', page: '#15181d' }; // тема «Как на сайте»
  const FRAME_MS = 1000 / 30; // 30 кадров/с хватает для медленного фона и бережёт процессор во время звонка
  const MAX_DPR = 1.5;
  const PARALLAX_PX = 24; // максимальный сдвиг ближнего слоя за курсором
  const TAU = Math.PI * 2;

  let canvas = null;
  let ctx = null;
  let mode = 'none';
  let animated = true;
  let w = 0;
  let h = 0;
  let raf = 0;
  let lastFrame = 0;
  let lastTime = 0;
  let colors = { ...FALLBACK };
  let glowSprite = null;
  let scene = null;

  const opts = { brightness: 1, density: 1, parallax: true };
  const pointer = { tx: 0, ty: 0, x: 0, y: 0 };
  // Реакция на состояние чата
  const fx = { phase: 'idle', pull: 0, pullTarget: 0, flash: 0, calm: 0, calmTarget: 0, clock: 0 };

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const rand = (a, b) => a + Math.random() * (b - a);
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  /* ───────── Общие помощники ───────── */

  /* Количество объектов с учётом ползунка «Плотность» */
  function count(base, max) {
    return Math.max(1, Math.round(Math.min(max, base) * opts.density));
  }

  /* Прозрачность с учётом ползунка «Яркость», вспышки и спокойного режима разговора */
  function alpha(a) {
    return clamp(a * opts.brightness * (1 + fx.flash * 0.9) * (1 - fx.calm * 0.2), 0, 1);
  }

  /* Позиция с учётом стягивания к центру (поиск) и параллакса; depth: 0 — далеко, 1 — близко */
  function px(x, depth) {
    return x + (w / 2 - x) * fx.pull * (0.35 + depth * 0.65) + pointer.x * depth * PARALLAX_PX;
  }
  function py(y, depth) {
    return y + (h / 2 - y) * fx.pull * (0.35 + depth * 0.65) + pointer.y * depth * PARALLAX_PX;
  }

  function makeStars(n, maxY) {
    return Array.from({ length: n }, () => {
      const r = Math.random() < 0.08 ? rand(1.1, 1.6) : rand(0.35, 1);
      return {
        x: Math.random() * w,
        y: Math.random() * (maxY || h),
        r,
        d: clamp(r / 1.6, 0.15, 1),
        a: rand(0.12, 0.6),
        speed: rand(0.4, 1.6),
        phase: Math.random() * TAU,
        tinted: Math.random() < 0.18,
      };
    });
  }

  function drawStars(stars) {
    stars.forEach((s) => {
      const tw = animated ? 0.65 + 0.35 * Math.sin(fx.clock * s.speed + s.phase) : 0.85;
      ctx.globalAlpha = alpha(s.a * tw);
      ctx.fillStyle = s.tinted ? colors.accent : colors.text;
      ctx.beginPath();
      ctx.arc(px(s.x, s.d), py(s.y, s.d), s.r * (1 + fx.flash * 0.5), 0, TAU);
      ctx.fill();
    });
  }

  function wrap(o, pad) {
    if (o.x < -pad) o.x = w + pad;
    if (o.x > w + pad) o.x = -pad;
    if (o.y < -pad) o.y = h + pad;
    if (o.y > h + pad) o.y = -pad;
  }

  function offscreen(width, height) {
    const c = document.createElement('canvas');
    c.width = Math.max(1, Math.round(width));
    c.height = Math.max(1, Math.round(height));
    return c;
  }

  /* ───────── Сцены ───────── */

  const SCENES = {
    stars: {
      seed() {
        return { stars: makeStars(count((w * h) / 5200, 420)), meteor: null, nextMeteor: rand(4, 10) };
      },
      draw(s, dt) {
        drawStars(s.stars);
        if (!animated) return;

        s.nextMeteor -= dt;
        if (!s.meteor && s.nextMeteor <= 0 && fx.calm < 0.5) {
          const angle = rand(0.45, 0.75); // вниз-влево
          const speed = rand(520, 760);
          s.meteor = {
            x: rand(w * 0.35, w * 1.05),
            y: rand(-h * 0.05, h * 0.35),
            vx: -Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            life: 0,
            ttl: rand(0.7, 1.1),
          };
          s.nextMeteor = rand(7, 16);
        }
        if (s.meteor) {
          const m = s.meteor;
          m.life += dt;
          m.x += m.vx * dt;
          m.y += m.vy * dt;
          const k = m.life / m.ttl;
          const fade = k < 0.15 ? k / 0.15 : 1 - (k - 0.15) / 0.85;
          const tail = 0.16;
          const x = px(m.x, 0.6);
          const y = py(m.y, 0.6);
          const grad = ctx.createLinearGradient(x, y, x - m.vx * tail, y - m.vy * tail);
          grad.addColorStop(0, colors.text);
          grad.addColorStop(1, 'transparent');
          ctx.globalAlpha = alpha(Math.max(0, fade) * 0.55);
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.2;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x - m.vx * tail, y - m.vy * tail);
          ctx.stroke();
          if (m.life >= m.ttl) s.meteor = null;
        }
      },
    },

    constellations: {
      seed() {
        const n = count((w * h) / 17000, 90);
        return {
          stars: makeStars(Math.round(n * 1.5)),
          points: Array.from({ length: n }, () => {
            const angle = Math.random() * TAU;
            const speed = rand(4, 11);
            return {
              x: Math.random() * w,
              y: Math.random() * h,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed,
              r: rand(0.9, 1.7),
            };
          }),
        };
      },
      draw(s, dt) {
        drawStars(s.stars);
        const link = 140;
        const slow = 1 - fx.calm * 0.6;
        const pts = s.points.map((p) => {
          if (animated) {
            p.x += p.vx * dt * slow;
            p.y += p.vy * dt * slow;
            wrap(p, 20);
          }
          return { x: px(p.x, 0.7), y: py(p.y, 0.7), r: p.r };
        });
        ctx.strokeStyle = colors.accent;
        ctx.lineWidth = 0.7;
        for (let i = 0; i < pts.length; i += 1) {
          for (let j = i + 1; j < pts.length; j += 1) {
            const dx = pts[i].x - pts[j].x;
            const dy = pts[i].y - pts[j].y;
            const d2 = dx * dx + dy * dy;
            if (d2 > link * link) continue;
            ctx.globalAlpha = alpha((1 - Math.sqrt(d2) / link) * 0.2);
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.stroke();
          }
        }
        ctx.fillStyle = colors.text;
        ctx.globalAlpha = alpha(0.45);
        pts.forEach((p) => {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, TAU);
          ctx.fill();
        });
      },
    },

    fireflies: {
      seed() {
        return {
          flies: Array.from({ length: Math.max(6, count(Math.max(14, (w * h) / 38000), 46)) }, () => ({
            x: Math.random() * w,
            y: Math.random() * h,
            size: rand(14, 30),
            d: rand(0.3, 1),
            speed: rand(8, 20),
            dir: Math.random() * TAU,
            turn: rand(-0.4, 0.4),
            phase: Math.random() * TAU,
            pulse: rand(0.5, 1.2),
          })),
        };
      },
      draw(s, dt) {
        if (!glowSprite) return;
        const slow = 1 - fx.calm * 0.5;
        s.flies.forEach((f) => {
          if (animated) {
            f.turn = clamp(f.turn + rand(-0.6, 0.6) * dt, -0.5, 0.5);
            f.dir += f.turn * dt;
            f.x += Math.cos(f.dir) * f.speed * dt * slow;
            f.y += (Math.sin(f.dir) * f.speed - 2) * dt * slow; // чуть всплывают
            wrap(f, 40);
          }
          const glow = 0.5 + 0.5 * Math.sin(fx.clock * f.pulse + f.phase);
          ctx.globalAlpha = alpha(0.12 + glow * 0.4);
          const size = f.size * (0.85 + glow * 0.3) * (1 + fx.flash * 0.4);
          ctx.drawImage(glowSprite, px(f.x, f.d) - size / 2, py(f.y, f.d) - size / 2, size, size);
        });
      },
    },

    nebula: {
      seed() {
        const base = Math.max(w, h);
        return {
          stars: makeStars(count((w * h) / 15600, 140)),
          clouds: Array.from({ length: 4 }, (_, i) => ({
            cx: rand(0.1, 0.9) * w,
            cy: rand(0.1, 0.9) * h,
            orbit: rand(0.04, 0.1) * base,
            speed: rand(0.015, 0.04) * (i % 2 ? 1 : -1),
            phase: Math.random() * TAU,
            r: rand(0.32, 0.55) * base,
            a: rand(0.05, 0.085),
            useText: i === 3,
          })),
        };
      },
      draw(s) {
        s.clouds.forEach((c) => {
          const x = px(c.cx + Math.cos(fx.clock * c.speed + c.phase) * c.orbit, 0.2);
          const y = py(c.cy + Math.sin(fx.clock * c.speed * 0.8 + c.phase) * c.orbit, 0.2);
          const grad = ctx.createRadialGradient(x, y, 0, x, y, c.r);
          grad.addColorStop(0, c.useText ? colors.text : colors.accent);
          grad.addColorStop(1, 'transparent');
          ctx.globalAlpha = alpha(c.a);
          ctx.fillStyle = grad;
          ctx.fillRect(x - c.r, y - c.r, c.r * 2, c.r * 2);
        });
        drawStars(s.stars);
      },
    },

    /* Дождь за окном: далёкие струи за стеклом + капли на самом стекле, иногда стекают */
    rain: {
      seed() {
        const newDrop = () => ({
          x: Math.random() * w,
          y: Math.random() * h,
          r: rand(1.4, 4.2),
          slide: false,
          vy: 0,
          wob: Math.random() * TAU,
        });
        return {
          newDrop,
          streaks: Array.from({ length: count((w * h) / 12000, 170) }, () => ({
            x: Math.random() * w,
            y: Math.random() * h,
            len: rand(14, 34),
            v: rand(520, 860),
            a: rand(0.04, 0.11),
            d: rand(0.2, 0.6),
          })),
          drops: Array.from({ length: count((w * h) / 24000, 90) }, newDrop),
          trails: [],
        };
      },
      draw(s, dt) {
        const slow = 1 - fx.calm * 0.4;
        // струи за стеклом
        ctx.strokeStyle = colors.accent;
        ctx.lineWidth = 1;
        ctx.lineCap = 'round';
        s.streaks.forEach((r) => {
          if (animated) {
            r.y += r.v * dt * slow;
            if (r.y > h + 40) {
              r.y = -40;
              r.x = Math.random() * w;
            }
          }
          const x = px(r.x, r.d);
          const y = py(r.y, r.d);
          ctx.globalAlpha = alpha(r.a);
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x - r.len * 0.12, y - r.len);
          ctx.stroke();
        });

        // следы стёкших капель
        for (let i = s.trails.length - 1; i >= 0; i -= 1) {
          const t = s.trails[i];
          if (animated) t.life -= dt * 0.12;
          if (t.life <= 0) {
            s.trails.splice(i, 1);
            continue;
          }
          drawDrop(t.x, t.y, t.r, t.life * 0.8);
        }

        // капли на стекле — без параллакса: они «на стекле», а не в глубине
        s.drops.forEach((d, i) => {
          if (animated) {
            if (!d.slide && Math.random() < dt * 0.025 * (d.r / 4)) d.slide = true;
            if (d.slide) {
              d.vy = Math.min(d.vy + 70 * dt, 150);
              d.y += d.vy * dt;
              d.wob += dt * 3;
              d.x += Math.sin(d.wob) * 6 * dt;
              d.r -= dt * 0.22;
              if (Math.random() < dt * 14 && s.trails.length < 260) {
                s.trails.push({ x: d.x + rand(-0.6, 0.6), y: d.y - d.r * 1.4, r: d.r * rand(0.25, 0.4), life: 1 });
              }
            }
            if (d.y > h + 10 || d.r < 0.8) s.drops[i] = s.newDrop();
          }
          drawDrop(d.x, d.y, d.r, 1);
        });
      },
    },

    snow: {
      seed() {
        return {
          flakes: Array.from({ length: count((w * h) / 8000, 280) }, () => {
            const r = rand(0.6, 2.6);
            return {
              x: Math.random() * w,
              y: Math.random() * h,
              r,
              d: r / 2.6,
              vy: 10 + r * 13,
              sway: rand(0.3, 1),
              amp: rand(6, 18),
              phase: Math.random() * TAU,
            };
          }),
        };
      },
      draw(s, dt) {
        const slow = 1 - fx.calm * 0.45;
        ctx.fillStyle = colors.text;
        s.flakes.forEach((f) => {
          if (animated) {
            f.y += f.vy * dt * slow;
            f.x += Math.cos(fx.clock * f.sway + f.phase) * f.amp * dt * f.d;
            wrap(f, 10);
          }
          ctx.globalAlpha = alpha(0.18 + f.d * 0.42);
          ctx.beginPath();
          ctx.arc(px(f.x, f.d), py(f.y, f.d), f.r * (1 + fx.flash * 0.4), 0, TAU);
          ctx.fill();
        });
      },
    },

    /* Ночной город: звёздное небо, свечение у горизонта и два слоя силуэтов с редкими окнами */
    city: {
      seed() {
        const pad = PARALLAX_PX + 10;
        const extraH = PARALLAX_PX + 10;
        const layers = [
          { d: 0.25, minH: 0.12, maxH: 0.27, minW: 36, maxW: 100, lit: 0.1, alpha: 0.32 },
          { d: 0.6, minH: 0.07, maxH: 0.2, minW: 46, maxW: 130, lit: 0.16, alpha: 0.5 },
        ].map((L) => {
          const blocks = [];
          for (let x = -pad; x < w + pad; ) {
            const bw = rand(L.minW, L.maxW);
            const bh = rand(L.minH, L.maxH) * h;
            blocks.push({ x, w: bw, h: bh, antenna: Math.random() < 0.15 ? rand(8, 22) : 0 });
            x += bw + (Math.random() < 0.2 ? rand(4, 16) : 0);
          }
          const windows = [];
          blocks.forEach((b) => {
            for (let wy = h - b.h + 10; wy < h - 6; wy += 11) {
              for (let wx = b.x + 6; wx < b.x + b.w - 8; wx += 9) {
                if (Math.random() < L.lit * opts.density) {
                  windows.push({ x: wx, y: wy, on: true, warm: Math.random() < 0.7 });
                }
              }
            }
          });
          return { ...L, blocks, windows, pad, extraH, sprite: null };
        });
        return { stars: makeStars(count((w * h) / 7000, 300), h * 0.75), layers, flickerAcc: 0 };
      },
      onColors(s) {
        // дальний слой — светлее неба (дымка), ближний — цвета страницы (настоящий силуэт)
        s.layers.forEach((L, i) => {
          const c = offscreen(w + L.pad * 2, h + L.extraH);
          const g = c.getContext('2d');
          g.fillStyle = i === 0 ? colors.text : colors.page;
          g.globalAlpha = i === 0 ? 0.06 : 1;
          L.blocks.forEach((b) => {
            g.fillRect(b.x + L.pad, h - b.h, b.w, b.h + L.extraH);
            if (b.antenna) g.fillRect(b.x + L.pad + b.w / 2 - 1, h - b.h - b.antenna, 2, b.antenna);
          });
          L.sprite = c;
        });
      },
      draw(s, dt) {
        drawStars(s.stars);

        // свечение города у горизонта
        const glow = ctx.createLinearGradient(0, h, 0, h * 0.55);
        glow.addColorStop(0, colors.accent);
        glow.addColorStop(1, 'transparent');
        ctx.globalAlpha = alpha(0.09);
        ctx.fillStyle = glow;
        ctx.fillRect(0, h * 0.55, w, h * 0.45);

        if (animated) {
          s.flickerAcc += dt;
          while (s.flickerAcc > 0.35) {
            s.flickerAcc -= 0.35;
            const L = s.layers[Math.random() < 0.6 ? 1 : 0];
            const win = L.windows[Math.floor(Math.random() * L.windows.length)];
            if (win) win.on = !win.on;
          }
        }

        s.layers.forEach((L) => {
          if (!L.sprite) return;
          const ox = pointer.x * L.d * PARALLAX_PX - L.pad;
          const oy = Math.max(0, pointer.y) * L.d * PARALLAX_PX * 0.5;
          ctx.globalAlpha = 1;
          ctx.drawImage(L.sprite, ox, oy);
          L.windows.forEach((win) => {
            if (!win.on) return;
            ctx.globalAlpha = alpha(L.alpha);
            ctx.fillStyle = win.warm ? colors.accent : colors.text;
            ctx.fillRect(win.x + L.pad + ox, win.y + oy, 3, 4);
          });
        });
      },
    },

    /* Луна: полумесяц в углу с ореолом, тонкие облака, звёзды */
    moon: {
      seed() {
        const r = clamp(Math.min(w, h) * 0.055, 26, 64);
        return {
          stars: makeStars(count((w * h) / 8000, 260)),
          moon: { x: w * 0.83, y: h * 0.2, r },
          clouds: Array.from({ length: count(6, 10) }, () => ({
            x: Math.random() * w,
            y: rand(0.06, 0.5) * h,
            rx: rand(140, 320),
            ry: rand(8, 22),
            v: rand(3, 9),
            a: rand(0.035, 0.07),
            d: rand(0.25, 0.45),
          })),
          sprite: null,
        };
      },
      onColors(s) {
        // Полумесяц с тонким мягким свечением по краю — без ореола вокруг.
        // Рисуем вдвое крупнее, чтобы край был гладким; запас по краям с избытком,
        // чтобы свечение нигде не обрезалось границей холста.
        const r = s.moon.r;
        const scale = 2;
        const pad = r * 0.8;
        const size = r * 2 + pad * 2;
        const center = size / 2;

        const shape = offscreen(size * scale, size * scale);
        const sg = shape.getContext('2d');
        sg.scale(scale, scale);
        sg.fillStyle = colors.text;
        sg.beginPath();
        sg.arc(center, center, r, 0, TAU);
        sg.fill();
        sg.globalCompositeOperation = 'destination-out';
        sg.beginPath();
        sg.arc(center + r * 0.42, center - r * 0.18, r * 0.9, 0, TAU);
        sg.fill();

        const [cr, cg, cb] = parseColor(colors.text);
        const c = offscreen(size * scale, size * scale);
        const g = c.getContext('2d');
        g.shadowColor = `rgba(${cr}, ${cg}, ${cb}, 0.3)`;
        g.shadowBlur = r * 0.2 * scale; // охват ~0.2r — в 4 раза меньше запаса pad
        g.drawImage(shape, 0, 0);
        s.sprite = { canvas: c, size };
      },
      draw(s, dt) {
        drawStars(s.stars);

        const m = s.moon;
        const mx = px(m.x, 0.12);
        const my = py(m.y, 0.12);
        if (s.sprite) {
          ctx.globalAlpha = alpha(0.85);
          ctx.drawImage(s.sprite.canvas, mx - s.sprite.size / 2, my - s.sprite.size / 2, s.sprite.size, s.sprite.size);
        }

        ctx.fillStyle = colors.text;
        s.clouds.forEach((c) => {
          if (animated) {
            c.x += c.v * dt * (1 - fx.calm * 0.5);
            if (c.x - c.rx > w) c.x = -c.rx;
          }
          const cx = px(c.x, c.d);
          const cy = py(c.y, c.d);
          const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, c.rx);
          grad.addColorStop(0, colors.text);
          grad.addColorStop(1, 'transparent');
          ctx.save();
          ctx.translate(cx, cy);
          ctx.scale(1, c.ry / c.rx);
          ctx.globalAlpha = alpha(c.a);
          ctx.fillStyle = grad;
          ctx.fillRect(-c.rx, -c.rx, c.rx * 2, c.rx * 2);
          ctx.restore();
        });
      },
    },
  };

  function drawDrop(x, y, r, life) {
    ctx.fillStyle = colors.text;
    ctx.globalAlpha = alpha(0.07 * life);
    ctx.beginPath();
    ctx.arc(x, y, r, 0, TAU);
    ctx.fill();
    ctx.strokeStyle = colors.text;
    ctx.lineWidth = 0.7;
    ctx.globalAlpha = alpha(0.16 * life);
    ctx.stroke();
    ctx.globalAlpha = alpha(0.4 * life);
    ctx.beginPath();
    ctx.arc(x - r * 0.35, y - r * 0.35, Math.max(0.4, r * 0.28), 0, TAU);
    ctx.fill();
  }

  /* ───────── Отрисовка ───────── */

  /* Любой CSS-цвет → [r, g, b]; браузер сам нормализует запись через canvas */
  const colorCache = new Map();
  let colorProbe = null;
  function parseColor(color) {
    if (colorCache.has(color)) return colorCache.get(color);
    if (!colorProbe) colorProbe = offscreen(1, 1).getContext('2d');
    colorProbe.fillStyle = '#000';
    colorProbe.fillStyle = color;
    const v = String(colorProbe.fillStyle);
    let rgb = [223, 227, 234];
    if (v[0] === '#' && v.length === 7) {
      rgb = [1, 3, 5].map((i) => parseInt(v.slice(i, i + 2), 16));
    } else {
      const m = v.match(/[\d.]+/g);
      if (m && m.length >= 3) rgb = m.slice(0, 3).map(Number);
    }
    colorCache.set(color, rgb);
    return rgb;
  }

  function buildGlowSprite() {
    const size = 64;
    const c = offscreen(size, size);
    const g = c.getContext('2d');
    const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    grad.addColorStop(0, colors.text);
    grad.addColorStop(0.12, colors.accent);
    grad.addColorStop(0.45, colors.accent);
    grad.addColorStop(1, 'transparent');
    g.fillStyle = grad;
    g.beginPath();
    g.arc(size / 2, size / 2, size / 2, 0, TAU);
    g.fill();
    // ореол мягче ядра
    g.globalCompositeOperation = 'destination-in';
    const fade = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    fade.addColorStop(0, 'rgba(0,0,0,1)');
    fade.addColorStop(0.25, 'rgba(0,0,0,0.55)');
    fade.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = fade;
    g.fillRect(0, 0, size, size);
    glowSprite = c;
  }

  function updateEffects(dt) {
    if (!isAnimated()) {
      fx.pull = fx.flash = fx.calm = 0;
      pointer.x = pointer.y = 0;
      return;
    }
    fx.pull += (fx.pullTarget - fx.pull) * Math.min(1, dt * 0.55);
    fx.calm += (fx.calmTarget - fx.calm) * Math.min(1, dt * 0.4);
    fx.flash = Math.max(0, fx.flash - dt * 0.65);
    fx.clock += dt * (1 - fx.calm * 0.55); // в разговоре мерцание медленнее

    const tx = opts.parallax ? pointer.tx : 0;
    const ty = opts.parallax ? pointer.ty : 0;
    pointer.x += (tx - pointer.x) * Math.min(1, dt * 2.5);
    pointer.y += (ty - pointer.y) * Math.min(1, dt * 2.5);
  }

  function renderFrame(time) {
    if (!ctx || !scene) return;
    const t = time / 1000;
    const dt = lastTime ? Math.min(0.1, t - lastTime) : 0;
    lastTime = t;
    updateEffects(dt);
    ctx.globalAlpha = 1;
    ctx.clearRect(0, 0, w, h);
    SCENES[mode].draw(scene, isAnimated() ? dt : 0);
    ctx.globalAlpha = 1;
  }

  function loop(time) {
    raf = requestAnimationFrame(loop);
    if (time - lastFrame < FRAME_MS) return;
    lastFrame = time;
    renderFrame(time);
  }

  function isAnimated() {
    return animated && !reducedMotion.matches;
  }

  function restart() {
    cancelAnimationFrame(raf);
    raf = 0;
    lastTime = 0;
    if (mode === 'none' || !canvas) return;
    if (isAnimated()) {
      raf = requestAnimationFrame(loop);
    } else {
      const was = animated;
      animated = false; // статичный кадр без движения
      renderFrame(performance.now());
      animated = was;
    }
  }

  function reseed() {
    scene = mode === 'none' ? null : SCENES[mode].seed();
    if (scene && SCENES[mode].onColors) SCENES[mode].onColors(scene);
  }

  function resize() {
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    reseed();
    restart();
  }

  let resizeTimer;
  function onResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 150);
  }

  function onPointerMove(e) {
    pointer.tx = clamp((e.clientX / (w || 1) - 0.5) * 2, -1, 1);
    pointer.ty = clamp((e.clientY / (h || 1) - 0.5) * 2, -1, 1);
  }

  function ensureAttached() {
    if (mode === 'none') return;
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = 'nekto-ext-backdrop';
      canvas.setAttribute('aria-hidden', 'true');
      ctx = canvas.getContext('2d');
      window.addEventListener('resize', onResize);
      window.addEventListener('pointermove', onPointerMove, { passive: true });
      reducedMotion.addEventListener('change', restart);
    }
    if (!canvas.isConnected) document.body.prepend(canvas);
  }

  function readVar(name, fallback) {
    const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return v || fallback;
  }

  function refreshColors() {
    const next = {
      accent: readVar('--nx-accent', FALLBACK.accent),
      text: readVar('--nx-text', FALLBACK.text),
      page: readVar('--nx-page-solid', FALLBACK.page),
    };
    const same = next.accent === colors.accent && next.text === colors.text && next.page === colors.page;
    if (same && glowSprite) return;
    colors = next;
    buildGlowSprite();
    if (scene && SCENES[mode].onColors) SCENES[mode].onColors(scene);
    if (!isAnimated()) restart(); // статичный кадр нужно перерисовать вручную
  }

  function setMode(next) {
    const target = SCENES[next] ? next : 'none';
    if (target === mode && (target === 'none' || scene)) return;
    mode = target;
    if (mode === 'none') {
      cancelAnimationFrame(raf);
      raf = 0;
      scene = null;
      if (canvas) {
        canvas.dataset.on = 'false';
        ctx.clearRect(0, 0, w, h);
      }
      return;
    }
    ensureAttached();
    if (!glowSprite) buildGlowSprite();
    resize();
    requestAnimationFrame(() => {
      if (canvas) canvas.dataset.on = 'true'; // плавное появление через CSS
    });
  }

  function setAnimated(on) {
    animated = !!on;
    restart();
  }

  let reseedTimer;
  function setOptions(next) {
    if (typeof next.brightness === 'number') opts.brightness = clamp(next.brightness, 0.1, 2);
    if (typeof next.parallax === 'boolean') opts.parallax = next.parallax;
    if (typeof next.density === 'number' && next.density !== opts.density) {
      opts.density = clamp(next.density, 0.2, 2.5);
      clearTimeout(reseedTimer);
      reseedTimer = setTimeout(() => {
        if (mode !== 'none' && canvas) {
          reseed();
          restart();
        }
      }, 120);
    }
    if (!isAnimated()) restart();
  }

  function setPhase(phase) {
    if (phase === fx.phase) return;
    const wasTalk = fx.phase === 'talk';
    fx.phase = phase;
    fx.pullTarget = phase === 'search' ? 0.22 : 0;
    fx.calmTarget = phase === 'talk' ? 1 : 0;
    if (phase === 'talk' && !wasTalk) fx.flash = 1; // собеседник найден — мягкая вспышка
  }

  window.NektoBackdrop = { setMode, setAnimated, setOptions, setPhase, refreshColors, ensureAttached };
})();

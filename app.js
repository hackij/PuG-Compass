const STORAGE_KEY = "pug_lerntrainer_progress_v3";
const CATALOG_CACHE_KEY = "pug_catalog_cache_v1";
const THEME_KEY = "pug_compass_theme_v1";

const appState = {
  catalog: null,
  cards: [],
  cardMap: new Map(),
  learned: {},
  queues: {},
  xp: 0,
  streak: 0,
};

const ui = {
  landingPage: document.getElementById("landingPage"),
  appContent: document.getElementById("appContent"),
  views: document.querySelectorAll(".view"),
  navButtons: document.querySelectorAll(".nav-btn"),
  coachUrl: document.getElementById("coachUrl"),
  btnCoachLoad: document.getElementById("btnCoachLoad"),
  btnCoachOpen: document.getElementById("btnCoachOpen"),
  coachFrame: document.getElementById("coachFrame"),
  resetProgress: document.getElementById("resetProgress"),
  podcastAudio: document.getElementById("podcastAudio"),
  podcastPlay: document.getElementById("podcastPlay"),
  podcastPause: document.getElementById("podcastPause"),
  podcastSeek: document.getElementById("podcastSeek"),
  podcastCurrent: document.getElementById("podcastCurrent"),
  podcastDuration: document.getElementById("podcastDuration"),
  podcastWaveform: document.getElementById("podcastWaveform"),
  btnStartLearning: document.getElementById("btnStartLearning"),
  mindmapSection: document.getElementById("mindmapSection"),
  themeToggle: document.getElementById("themeToggle"),
  themeToggleLabel: document.getElementById("themeToggleLabel"),
};

const podcast = {
  audioCtx: null,
  analyser: null,
  source: null,
  rafId: null,
  isPlaying: false,
};

start();

async function start() {
  applySavedTheme();
  initIcons();
  wireNavigation();
  wireCoach();
  wirePodcast();
  wireReset();
  wireStartCTA();
  wireThemeToggle();

  try {
    appState.catalog = await loadCatalog();
    appState.cards = flattenCards(appState.catalog);
    appState.cardMap = new Map(appState.cards.map((card) => [card.id, card]));

    const saved = loadProgress();
    appState.learned = saved.learned;
    appState.queues = saved.queues;
    appState.xp = saved.xp;
    appState.streak = saved.streak;

    updateMeta();

    Mindmap.init({
      rootId: "mindmapRoot",
      detailsId: "mindmapDetails",
      getCategories: getCategoryProgress,
      getCardsByCategory,
      onOpenCategory: (categoryId) => {
        navigate("flashcards");
        Flashcards.setFilter(categoryId);
      },
    });

    Flashcards.init({ app: appApi });
    MemoryLab.init({ app: appApi });
  } catch (err) {
    console.error(err);
    alert("Fehler beim Laden von pug_fragenkatalog.json. Bitte Dateiformat prüfen.");
  }
}

function applySavedTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY);
  const theme = savedTheme === "light" ? "light" : "dark";
  setTheme(theme);
}

function wireThemeToggle() {
  if (!ui.themeToggle) return;
  ui.themeToggle.addEventListener("click", () => {
    const isLight = document.body.classList.contains("light-mode");
    setTheme(isLight ? "dark" : "light");
  });
}

function setTheme(theme) {
  const isLight = theme === "light";
  document.body.classList.toggle("light-mode", isLight);
  document.body.classList.toggle("dark-mode", !isLight);
  localStorage.setItem(THEME_KEY, isLight ? "light" : "dark");
  if (ui.themeToggleLabel) {
    ui.themeToggleLabel.textContent = isLight ? "🌙 Dark" : "☀ Light";
  }
}

function wireStartCTA() {
  if (!ui.btnStartLearning || !ui.landingPage || !ui.appContent) return;
  ui.btnStartLearning.addEventListener("click", () => {
    ui.landingPage.classList.add("is-hiding");
    ui.appContent.style.display = "block";
    requestAnimationFrame(() => {
      ui.appContent.classList.add("is-visible");
      navigate("start");
      ui.mindmapSection?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    window.setTimeout(() => {
      ui.landingPage.style.display = "none";
    }, 360);
  });
}

async function loadCatalog() {
  try {
    const res = await fetch("pug_fragenkatalog.json", { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    localStorage.setItem(CATALOG_CACHE_KEY, JSON.stringify(json));
    return normalizeCatalog(json);
  } catch (primaryErr) {
    if (window.PUG_CATALOG && Array.isArray(window.PUG_CATALOG.categories)) {
      return normalizeCatalog(window.PUG_CATALOG);
    }
    const cached = localStorage.getItem(CATALOG_CACHE_KEY);
    if (cached) {
      return normalizeCatalog(JSON.parse(cached));
    }
    throw primaryErr;
  }
}

function normalizeCatalog(raw) {
  const categories = Array.isArray(raw?.categories) ? raw.categories : [];
  return {
    categories: categories.map((cat, idx) => ({
      id: String(cat.id || idx + 1),
      title: String(cat.title || `Kategorie ${idx + 1}`),
      cards: Array.isArray(cat.cards) ? cat.cards : [],
    })),
  };
}

function flattenCards(catalog) {
  const cards = [];
  catalog.categories.forEach((category) => {
    category.cards.forEach((card, index) => {
      cards.push({
        id: Number(card.id ?? `${category.id}${index}`),
        categoryId: category.id,
        categoryTitle: category.title,
        question: String(card.question || ""),
        answer: String(card.answer || ""),
        points: Number(card.points || 1),
        type: card.type === "O" ? "open" : "closed",
        wiki: typeof card.wiki === "string" ? card.wiki : "",
      });
    });
  });
  return cards;
}

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { learned: {}, queues: {}, xp: 0, streak: 0 };
    const parsed = JSON.parse(raw);
    return {
      learned: parsed.learned || {},
      queues: parsed.queues || {},
      xp: Number(parsed.xp) || 0,
      streak: Number(parsed.streak) || 0,
    };
  } catch {
    return { learned: {}, queues: {}, xp: 0, streak: 0 };
  }
}

function saveProgress() {
  const payload = {
    learned: appState.learned,
    queues: appState.queues,
    xp: appState.xp,
    streak: appState.streak,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

function updateMeta() {
  // Professional mode: no visible gamification widgets on the UI.
}

function renderBadges() {
  // Intentionally unused after visual simplification.
}

function getCategoryList() {
  return appState.catalog.categories.map((c) => ({ id: c.id, title: c.title }));
}

function getCardsByCategory(categoryId) {
  return appState.cards.filter((card) => card.categoryId === categoryId);
}

function getCategoryProgress() {
  return appState.catalog.categories.map((category) => {
    const cards = getCardsByCategory(category.id);
    const learned = cards.filter((card) => appState.learned[card.id]).length;
    return {
      id: category.id,
      title: category.title,
      learned,
      total: cards.length,
    };
  });
}

function getUnlearnedCards(filter = "all") {
  return appState.cards.filter((card) => {
    if (appState.learned[card.id]) return false;
    if (filter === "all") return true;
    return card.categoryId === filter;
  });
}

function buildQueue(filter) {
  const ids = getUnlearnedCards(filter).map((c) => c.id);
  for (let i = ids.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [ids[i], ids[j]] = [ids[j], ids[i]];
  }
  return ids;
}

function queueFor(filter) {
  const key = String(filter || "all");
  if (!appState.queues[key]) {
    appState.queues[key] = buildQueue(key);
  }

  appState.queues[key] = appState.queues[key].filter((id) => !appState.learned[id]);

  if (appState.queues[key].length === 0) {
    appState.queues[key] = buildQueue(key);
  }

  return appState.queues[key];
}

function peekCard(filter) {
  const queue = queueFor(filter);
  if (!queue.length) return null;
  return appState.cardMap.get(queue[0]) || null;
}

function markCardKnown(cardId) {
  if (appState.learned[cardId]) return;

  appState.learned[cardId] = true;

  const card = appState.cardMap.get(cardId);
  if (card) appState.xp += Math.max(1, card.points);
  appState.streak += 1;

  Object.keys(appState.queues).forEach((key) => {
    appState.queues[key] = appState.queues[key].filter((id) => id !== cardId);
  });

  saveProgress();
  updateMeta();
  broadcastProgress();
}

function deferCard(filter, cardId) {
  const queue = queueFor(filter);
  if (!queue.length) return;

  const idx = queue.indexOf(cardId);
  if (idx === -1) return;

  queue.splice(idx, 1);
  queue.push(cardId);
  appState.streak = 0;

  saveProgress();
  updateMeta();
  broadcastProgress();
}

function getQueueSize(filter) {
  return queueFor(filter).length;
}

function getRandomCards(count) {
  const source = [...appState.cards];
  for (let i = source.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [source[i], source[j]] = [source[j], source[i]];
  }
  return source.slice(0, Math.min(count, source.length));
}

function addXp(amount) {
  appState.xp += Math.max(0, Number(amount) || 0);
  saveProgress();
  updateMeta();
}

function broadcastProgress() {
  Mindmap.render();
  document.dispatchEvent(new CustomEvent("pug:progress"));
}

function wireNavigation() {
  ui.navButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      navigate(btn.dataset.view);
      initIcons();
    });
  });
}

function navigate(view) {
  ui.navButtons.forEach((b) => b.classList.toggle("active", b.dataset.view === view));
  ui.views.forEach((section) => section.classList.toggle("active", section.id === `view-${view}`));
}

function wireCoach() {
  ui.btnCoachLoad.addEventListener("click", () => {
    const url = normalizeUrl(ui.coachUrl.value);
    ui.coachUrl.value = url;
    ui.coachFrame.src = url;
    ui.btnCoachOpen.href = url;
  });
}

function wireReset() {
  if (!ui.resetProgress) return;
  ui.resetProgress.addEventListener("click", () => {
    const ok = window.confirm("Möchtest du wirklich deinen gesamten Lernstand zurücksetzen?");
    if (!ok) return;
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(CATALOG_CACHE_KEY);
    window.location.reload();
  });
}

function initIcons() {
  if (window.lucide && typeof window.lucide.createIcons === "function") {
    window.lucide.createIcons();
  }
}

function normalizeUrl(url) {
  if (!url) return "https://app.fobizz.com/ai/chats/public_assistants/736cf24b-7eeb-4bfe-8b03-ad7819499855?token=ac101b3dc7072c6c1cf6abaece92c7e9";
  if (/^https?:\/\//i.test(url)) return url;
  return `https://${url}`;
}

function wirePodcast() {
  const audio = ui.podcastAudio;
  if (!audio || !ui.podcastPlay || !ui.podcastPause || !ui.podcastSeek) return;

  ui.podcastPlay.addEventListener("click", async () => {
    await playPodcastAudio();
  });

  ui.podcastPause.addEventListener("click", () => {
    audio.pause();
  });

  audio.addEventListener("play", () => {
    podcast.isPlaying = true;
    ui.podcastPlay.disabled = true;
    ui.podcastPause.disabled = false;
    startWaveform();
  });

  audio.addEventListener("pause", () => {
    podcast.isPlaying = false;
    ui.podcastPlay.disabled = false;
    ui.podcastPause.disabled = true;
    stopWaveform();
  });

  audio.addEventListener("ended", () => {
    podcast.isPlaying = false;
    ui.podcastPlay.disabled = false;
    ui.podcastPause.disabled = true;
    stopWaveform(true);
  });

  audio.addEventListener("loadedmetadata", () => {
    ui.podcastDuration.textContent = formatTime(audio.duration);
  });

  audio.addEventListener("timeupdate", () => {
    if (!audio.duration) return;
    ui.podcastCurrent.textContent = formatTime(audio.currentTime);
    ui.podcastSeek.value = ((audio.currentTime / audio.duration) * 100).toFixed(2);
  });

  ui.podcastSeek.addEventListener("input", () => {
    if (!audio.duration) return;
    audio.currentTime = (Number(ui.podcastSeek.value) / 100) * audio.duration;
  });

  drawIdleWaveform();
  ui.podcastPause.disabled = true;
}

async function playPodcastAudio() {
  const audio = ui.podcastAudio;
  if (!audio) return;

  if (!podcast.audioCtx) {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (Ctx) {
      podcast.audioCtx = new Ctx();
      podcast.analyser = podcast.audioCtx.createAnalyser();
      podcast.analyser.fftSize = 128;
      podcast.source = podcast.audioCtx.createMediaElementSource(audio);
      podcast.source.connect(podcast.analyser);
      podcast.analyser.connect(podcast.audioCtx.destination);
    }
  }

  if (podcast.audioCtx && podcast.audioCtx.state === "suspended") {
    await podcast.audioCtx.resume();
  }

  await audio.play();
}

function startWaveform() {
  stopWaveform();

  const canvas = ui.podcastWaveform;
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const analyser = podcast.analyser;
  const bars = 36;
  const gap = 6;
  const barWidth = (canvas.width - gap * (bars + 1)) / bars;
  const data = analyser ? new Uint8Array(analyser.frequencyBinCount) : null;

  const draw = () => {
    const h = canvas.height;
    ctx.clearRect(0, 0, canvas.width, h);

    for (let i = 0; i < bars; i += 1) {
      let value;
      if (analyser && data) {
        analyser.getByteFrequencyData(data);
        value = (data[i % data.length] / 255) * 0.9 + 0.08;
      } else {
        value = 0.18 + Math.abs(Math.sin((Date.now() / 280) + i * 0.6)) * 0.45;
      }
      const barH = Math.max(8, value * h);
      const x = gap + i * (barWidth + gap);
      const y = (h - barH) / 2;
      const radius = Math.min(8, barWidth / 2);

      const grad = ctx.createLinearGradient(0, y, 0, y + barH);
      grad.addColorStop(0, "#0b0f17");
      grad.addColorStop(0.5, "#e63946");
      grad.addColorStop(1, "#ffcc33");
      ctx.fillStyle = grad;
      roundRect(ctx, x, y, barWidth, barH, radius);
      ctx.fill();
    }

    podcast.rafId = window.requestAnimationFrame(draw);
  };

  draw();
}

function stopWaveform(showEnd = false) {
  if (podcast.rafId) {
    cancelAnimationFrame(podcast.rafId);
    podcast.rafId = null;
  }
  if (showEnd) {
    drawIdleWaveform(0.12);
  } else {
    drawIdleWaveform();
  }
}

function drawIdleWaveform(base = 0.22) {
  const canvas = ui.podcastWaveform;
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const bars = 36;
  const gap = 6;
  const barWidth = (canvas.width - gap * (bars + 1)) / bars;
  const h = canvas.height;
  ctx.clearRect(0, 0, canvas.width, h);

  for (let i = 0; i < bars; i += 1) {
    const level = base + (i % 5 === 0 ? 0.1 : 0.03);
    const barH = level * h;
    const x = gap + i * (barWidth + gap);
    const y = (h - barH) / 2;
    ctx.fillStyle = "rgba(230, 57, 70, 0.28)";
    roundRect(ctx, x, y, barWidth, barH, Math.min(8, barWidth / 2));
    ctx.fill();
  }
}

function roundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function formatTime(totalSeconds) {
  const value = Number.isFinite(totalSeconds) ? Math.max(0, totalSeconds) : 0;
  const mins = Math.floor(value / 60);
  const secs = Math.floor(value % 60);
  return `${mins}:${String(secs).padStart(2, "0")}`;
}

const appApi = {
  getCategoryList,
  getCardsByCategory,
  getQueueSize,
  peekCard,
  markCardKnown,
  deferCard,
  getRandomCards,
  addXp,
};

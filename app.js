/* PuG Compass 3 – Lern-App WiSo (Handwerk & IHK) · BS1 Bayreuth
   Läuft komplett im Browser, speichert den Lernstand lokal (localStorage). */
(() => {
  "use strict";
  const P = window.PUG;
  const KEY = "pugcompass_v2";
  const DAY = 86400000;
  const INTERVAL = { 1: 1, 2: 3, 3: 7, 4: 14, 5: 30 };   // Leitner-Fächer → Tage bis zur Wiederholung
  const READY = [0, 0.3, 0.55, 0.8, 0.93, 1];            // „Prüfungsreife“ je Fach
  const WD = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
  const WD_LONG = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];
  const MON = ["Jan.", "Feb.", "März", "Apr.", "Mai", "Juni", "Juli", "Aug.", "Sep.", "Okt.", "Nov.", "Dez."];
  const MON_LONG = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
  const PHASES = {
    learn: { name: "Neues lernen", short: "Phase 1", desc: "An jedem Lerntag kommen neue Karten dazu, bis jedes Thema einmal dran war.", color: "var(--bs1-blue)" },
    firm: { name: "Festigen", short: "Phase 2", desc: "Wiederholen, Schwächen ausbügeln und regelmäßig Quiz.", color: "#0e9384" },
    final: { name: "Endspurt", short: "Phase 3", desc: "Keine neuen Karten mehr – nur Wiederholung und Probeprüfungen.", color: "var(--bs1-red)" },
  };

  /* ───────── Icons ───────── */
  const sv = (d, w = 2) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
  const I = {
    compass: sv('<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5z" fill="currentColor"/>'),
    cards: sv('<rect x="3" y="6" width="14" height="15" rx="2.5"/><path d="M7 3h11.5A2.5 2.5 0 0 1 21 5.5V17"/>'),
    repeat: sv('<path d="M17 2l3 3-3 3"/><path d="M4 11V9a4 4 0 0 1 4-4h12M7 22l-3-3 3-3"/><path d="M20 13v2a4 4 0 0 1-4 4H4"/>'),
    plus: sv('<path d="M12 5v14M5 12h14"/>', 2.4),
    quiz: sv('<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6V14"/><circle cx="12" cy="17.2" r=".6" fill="currentColor"/>'),
    puzzle: sv('<path d="M10 3h4v3a2 2 0 1 0 4 0V3h3v7h-3a2 2 0 1 0 0 4h3v7h-7v-3a2 2 0 1 0-4 0v3H3v-7h3a2 2 0 1 0 0-4H3V3z"/>'),
    exam: sv('<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2.5M9.5 2h5"/>'),
    plan: sv('<rect x="3" y="4.5" width="18" height="16" rx="3"/><path d="M3 9.5h18M8 2.5v4M16 2.5v4"/>'),
    chev: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 6 6 6-6 6"/></svg>',
    back: sv('<path d="m15 6-6 6 6 6"/>', 2.2),
    close: sv('<path d="M6 6l12 12M18 6 6 18"/>', 2.2),
    check: sv('<path d="m5 12.5 4.5 4.5L19 7.5"/>', 3.2),
    hammer: sv('<path d="m14 7 3-3 3 3-3 3M17 10l-9.5 9.5a2.1 2.1 0 0 1-3-3L14 7"/>'),
    factory: sv('<path d="M3 21V10l6 4V10l6 4V5h4v16zM7 17h2M12 17h2M17 17h1"/>'),
    bot: sv('<rect x="4" y="8" width="16" height="12" rx="3"/><path d="M12 8V4M9 13h.01M15 13h.01M9.5 17h5"/>'),
    link: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>',
    flame: '<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2s5 4.5 5 10a5 5 0 0 1-10 0c0-2.2 1.2-3.8 2-4.6.2 1.7 1.2 2.6 1.8 2.6C10 7 12 2 12 2z"/></svg>',
    euro: sv('<path d="M17.5 6.5A7 7 0 1 0 17.5 17.5M4 10h10M4 14h10"/>'),
    match: sv('<circle cx="5" cy="6" r="2"/><circle cx="5" cy="18" r="2"/><circle cx="19" cy="6" r="2"/><circle cx="19" cy="18" r="2"/><path d="M7 6l10 12M7 18 17 6"/>'),
    order: sv('<path d="M10 6h10M10 12h10M10 18h10M4 5l1.5-1v5M3.5 12.5a1.5 1.5 0 1 1 2.3 1.3L3.5 16h3M3.5 19.5h2a1 1 0 0 1 0 2h-2"/>'),
    gap: sv('<path d="M3 12h4M17 12h4"/><rect x="8.5" y="8" width="7" height="8" rx="1.5" stroke-dasharray="2 2"/>'),
    story: sv('<path d="M4 5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9l-5 4z"/><path d="M8 8h8M8 12h5"/>'),
    download: sv('<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>'),
    sparkle: sv('<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/>'),
    flag: sv('<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>'),
  };

  /* ───────── Datum ───────── */
  const today = () => Math.floor((Date.now() - new Date().getTimezoneOffset() * 60000) / DAY);
  const dateOf = (n) => new Date(n * DAY);
  const weekday = (n) => dateOf(n).getUTCDay();
  const dayOfISO = (s) => { if (!s) return null; const [y, m, d] = s.split("-").map(Number); return Date.UTC(y, m - 1, d) / DAY; };
  const isoOf = (n) => dateOf(n).toISOString().slice(0, 10);
  const fmt = (n, long) => { const d = dateOf(n); return `${(long ? WD_LONG : WD)[d.getUTCDay()]}, ${d.getUTCDate()}. ${MON[d.getUTCMonth()]}`; };

  /* ───────── Zustand ───────── */
  const blank = () => ({ profile: null, plan: { days: [1, 3, 5, 0], minutes: 15, time: "17:00", start: null }, cards: {}, exams: [], log: {}, missions: {} });
  let S = load();
  let view = { name: S.profile ? "home" : "onboarding" };
  let timerId = null;

  function load() {
    try {
      const s = JSON.parse(localStorage.getItem(KEY));
      if (s && typeof s === "object") { const b = blank(); return { ...b, ...s, plan: { ...b.plan, ...(s.plan || {}) }, log: s.log || {}, missions: s.missions || {} }; }
    } catch (e) { /* leer */ }
    return blank();
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* privat/voll */ } }

  const topicById = (id) => P.topics.find((t) => t.id === id);
  const fits = (x) => (x.g === "all" || x.g === S.profile.track) && (S.profile.bayern || !x.by);
  const pool = () => P.cards.filter(fits);
  const st = (id) => S.cards[id] || { b: 0, d: 0, ok: 0, bad: 0 };
  const isDue = (c) => { const s = st(c.id); return s.b > 0 && s.d <= today(); };
  const readiness = (cards) => cards.length ? cards.reduce((a, c) => a + READY[st(c.id).b], 0) / cards.length : 0;
  const examDay = () => dayOfISO(S.profile?.date);
  const isLearn = (n) => S.plan.days.includes(weekday(n));
  const learnDays = (a, b) => { let k = 0; for (let n = a; n <= b; n++) if (isLearn(n)) k++; return k; };

  function logT() {
    const t = today();
    return S.log[t] || (S.log[t] = { rev: 0, new: 0, quiz: 0, train: 0, exam: 0, r: null });
  }
  function grade(c, result, src) {
    // result: 0 = nochmal, 1 = unsicher, 2 = gewusst
    const s = { ...st(c.id) }; const wasNew = s.b === 0;
    if (result === 2) { s.b = Math.min(5, s.b + 1); s.ok++; }
    else if (result === 1) { s.b = Math.max(1, s.b); }
    else { s.b = 1; s.bad++; }
    s.d = today() + (result === 0 ? 0 : result === 1 ? 1 : INTERVAL[s.b]);
    S.cards[c.id] = s;
    const L = logT();
    if (src === "learn") wasNew ? L.new++ : L.rev++;
    L.r = Math.round(readiness(pool()) * 1000) / 1000;
    trimLog(); save();
  }
  function bump(key) { const L = logT(); L[key]++; L.r = Math.round(readiness(pool()) * 1000) / 1000; save(); }
  function trimLog() { const keys = Object.keys(S.log).map(Number).sort((a, b) => a - b); while (keys.length > 400) delete S.log[keys.shift()]; }
  const active = (n) => { const L = S.log[n]; return !!L && (L.rev + L.new + L.quiz + L.train + L.exam) > 0; };
  function streak() {
    let n = today(), k = 0;
    if (!active(n)) n--;
    for (let guard = 0; guard < 400; guard++, n--) {
      if (active(n)) k++;
      else if (isLearn(n)) break; // ein geplanter Lerntag ohne Lernen beendet die Serie, freie Tage nicht
    }
    return k;
  }

  /* ───────── Lernplan ───────── */
  function phaseInfo() {
    const E = examDay(), T = today();
    if (E == null) return { id: "none" };
    if (T === E) return { id: "day", E };
    if (T > E) return { id: "after", E };
    let start = S.plan.start ?? T; if (start > T || start >= E) start = T;
    const total = E - start;
    const finalLen = total >= 35 ? 14 : total >= 14 ? 7 : Math.max(1, Math.floor(total / 3));
    const finalStart = E - finalLen;
    let p1end = start + Math.floor((finalStart - start) * 0.6) - 1;
    if (finalStart - start < 10) p1end = finalStart - 1; // wenig Zeit: direkt lernen, dann Endspurt
    const id = T >= finalStart ? "final" : T > p1end ? "firm" : "learn";
    return { id, E, start, finalStart, p1end, left: E - T };
  }
  function probes() {
    const E = examDay(); if (E == null) return [];
    const T = today(); const start = Math.min(S.plan.start ?? T, T);
    const plan = [[42, "Probeprüfung 1"], [28, "Probeprüfung 2"], [14, "Probeprüfung 3"], [3, "Generalprobe"]];
    let list = [];
    plan.forEach(([o, label]) => {
      let d = E - o; if (d < start) return;
      for (let k = 0; k <= 3; k++) if (isLearn(d - k) && d - k >= start) { d = d - k; break; }
      list.push({ day: d, label });
    });
    list = list.filter((p, i) => i === 0 || p.day !== list[i - 1].day).map((p, i, arr) => {
      const until = (arr[i + 1] ? arr[i + 1].day : E) - 1;
      const done = S.exams.find((e) => e.kind === "full" && e.day != null && e.day >= p.day - 3 && e.day <= until);
      const state = done ? "done" : T < p.day ? "planned" : T <= until ? "due" : "missed";
      return { ...p, until, done, state };
    });
    return list;
  }
  const dueProbe = () => probes().find((p) => p.state === "due");

  function mission() {
    const T = today();
    if (S.missions[T]) return S.missions[T];
    const ph = phaseInfo(); const cards = pool();
    const due = cards.filter(isDue).length, fresh = cards.filter((c) => st(c.id).b === 0).length;
    const budget = Math.max(6, Math.round(S.plan.minutes * 1.1));
    const probe = dueProbe();
    const learnDay = isLearn(T);
    let nNew = 0;
    if (ph.id === "none") nNew = Math.min(fresh, Math.round(budget * 0.45));
    else if (ph.id === "learn") nNew = Math.min(fresh, Math.min(Math.round(budget * 0.8), Math.max(Math.round(budget * 0.5), Math.ceil(fresh / Math.max(1, learnDays(T, ph.p1end))))));
    else if (ph.id === "firm") nNew = fresh ? Math.min(fresh, Math.round(budget * 0.6), Math.ceil(fresh / Math.max(1, learnDays(T, ph.finalStart - 1)))) : 0;
    let nRev = Math.min(due, Math.max(budget - nNew, Math.ceil(budget * 0.5)));
    const items = [];
    if (!learnDay && !probe) {
      const m = { day: T, rest: true, items: [], phase: ph.id };
      S.missions = { [T]: m }; save(); return m;
    }
    if (nRev) items.push({ k: "rev", n: nRev });
    if (nNew) items.push({ k: "new", n: nNew });
    if (probe) items.push({ k: "exam", label: probe.label });
    else if (ph.id === "final" || ph.id === "firm") items.push({ k: "quiz" });
    else if (S.plan.minutes >= 15 || !items.length) items.push({ k: "train" });
    if (!items.length) items.push({ k: "quiz" });
    const m = { day: T, rest: false, items, phase: ph.id };
    S.missions = { [T]: m }; save();
    return m;
  }
  function missionState(m) {
    const L = S.log[today()] || { rev: 0, new: 0, quiz: 0, train: 0, exam: 0 };
    const items = m.items.map((it) => {
      const have = it.k === "rev" ? L.rev : it.k === "new" ? L.new : L[it.k];
      const need = it.n || 1;
      return { ...it, have: Math.min(have, need), need, done: have >= need };
    });
    const total = items.reduce((a, x) => a + x.need, 0), got = items.reduce((a, x) => a + x.have, 0);
    const mins = Math.round(m.items.reduce((a, x) => a + (x.k === "rev" ? x.n * 0.7 : x.k === "new" ? x.n * 1.2 : x.k === "exam" ? 60 : 4), 0));
    return { items, frac: total ? got / total : 1, done: items.every((x) => x.done), mins };
  }
  function prognosis() {
    const E = examDay(), T = today(); const r = readiness(pool());
    if (E == null || T >= E) return null;
    const all = Object.entries(S.log).map(([d, v]) => [+d, v.r]).filter(([d, v]) => v != null && d <= T).sort((a, b) => a[0] - b[0]);
    const snaps = all.filter(([d]) => d >= T - 21);
    const left = learnDays(T + 1, E - 1);
    let rate, measured = false;
    if (snaps.length >= 3 && snaps[snaps.length - 1][0] - snaps[0][0] >= 4) {
      const ld = Math.max(1, learnDays(snaps[0][0] + 1, snaps[snaps.length - 1][0]));
      rate = Math.max(0, (snaps[snaps.length - 1][1] - snaps[0][1]) / ld); measured = true;
    } else rate = Math.max(0, (0.85 - r) / Math.max(1, left));
    const proj = Math.min(1, r + rate * left);
    const lvl = !measured ? "none" : proj >= 0.8 ? "ok" : proj >= 0.6 ? "mid" : "bad";
    return { r, proj, lvl, measured, left, snaps: all };
  }

  /* ───────── Hilfen ───────── */
  const $ = (sel, root = document) => root.querySelector(sel);
  const esc = (s) => String(s).replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));
  const shuffle = (a) => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const pct = (x) => Math.round(x * 100);
  const eur = (x) => x.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";
  function toast(msg) { const t = $("#toast"); t.textContent = msg; t.classList.add("show"); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove("show"), 2200); }
  function ask(msg, yes, onYes) {
    const d = document.createElement("div"); d.className = "modal";
    d.innerHTML = `<div class="glass card" role="dialog" aria-modal="true"><p style="margin:0 0 16px">${esc(msg)}</p><div class="btn-row"><button class="btn btn-glass" data-x="0">Abbrechen</button><button class="btn btn-red" data-x="1">${esc(yes)}</button></div></div>`;
    d.addEventListener("click", (e) => { const b = e.target.closest("[data-x]"); if (!b && e.target !== d) return; d.remove(); if (b && b.dataset.x === "1") onYes(); });
    document.body.appendChild(d); d.querySelector('[data-x="1"]').focus();
  }
  function gradeOf(p) {
    const g = [[92, 1, "sehr gut"], [81, 2, "gut"], [67, 3, "befriedigend"], [50, 4, "ausreichend"], [30, 5, "mangelhaft"], [0, 6, "ungenügend"]];
    const r = g.find(([min]) => p >= min); return { n: r[1], word: r[2] };
  }
  function termOfDay() { const t = P.terms; const n = today(); return t[(n * 7 + 3) % t.length]; }

  function metaTags(c) {
    const t = topicById(c.t);
    let h = `<span class="tag"><i class="dotmini" style="background:${t.color}"></i>${esc(t.short)}</span>`;
    if (c.f) h += `<span class="tag fall">Fallsituation</span>`;
    if (c.g !== "all") h += `<span class="tag">${c.g === "hwk" ? "Handwerk" : "IHK"}</span>`;
    if (c.by) h += `<span class="tag by">Bayern</span>`;
    if (c.s) h += `<span class="tag stand">Stand ${esc(c.s)}</span>`;
    return h;
  }
  const fallBox = (c) => c.f ? `<div class="fallbox">${I.story}<p>${esc(c.f)}</p></div>` : "";
  function standNote(c) {
    if (!c.s) return "";
    return `<div class="note">Diese Antwort kann sich ändern (Wahlen, Gesetze, Jahreswechsel). Stand: <b>${esc(c.s)}</b>.${c.src ? ` <a href="${esc(c.src)}" target="_blank" rel="noopener">Aktuell nachprüfen ↗</a>` : ""}</div>`;
  }

  /* ───────── Rendering ───────── */
  const VIEWS = {};
  const ACT = {};
  const TAB = { home: "home", learn: "learn", learnRun: "learn", train: "train", quiz: "train", task: "train", calc: "train", exam: "exam", plan: "plan", settings: "plan" };
  function render(keepScroll) {
    clearInterval(timerId); timerId = null;
    const y = window.scrollY;
    const app = $("#app");
    const focus = ["onboarding", "learnRun", "quiz", "task"].includes(view.name) || (view.name === "exam" && ["run", "grade"].includes(view.phase));
    app.classList.toggle("no-nav", focus);
    $("#nav").hidden = focus;
    document.querySelectorAll("#nav button").forEach((b) => b.classList.toggle("on", b.dataset.go === TAB[view.name]));
    app.innerHTML = VIEWS[view.name]();
    app.querySelectorAll("[data-act]").forEach((el) => {
      const ev = el.tagName === "INPUT" || el.tagName === "SELECT" ? (el.type === "number" || el.type === "text" ? "input" : "change") : "click";
      el.addEventListener(ev, (e) => { const f = ACT[el.dataset.act]; if (f) f(el, e); });
    });
    if (view.after) { const f = view.after; view.after = null; f(); }
    window.scrollTo({ top: keepScroll ? y : 0 });
  }
  const rerender = () => render(true);
  function go(name, extra = {}) { view = { name, ...extra }; render(); }

  const LOGO = window.PUG_LOGO || "icons/icon.svg";
  const MARK = window.PUG_MARK || "logo/pug-compass-zeichen.svg";
  const wordmark = (cls = "") => `<span class="wm ${cls}" role="img" aria-label="PuG Compass"><span class="sharp"><b>PuG</b> <em>Compass</em></span><span class="soft" aria-hidden="true"><b>PuG</b> <em>Compass</em></span></span>`;
  function header(title, sub) {
    // Startseite: großer Schriftzug; Unterseiten: kleiner Schriftzug + Seitentitel
    const home = title === "PuG Compass";
    return `<div class="top"><div class="brand"><img class="logo" src="${MARK}" alt=""><div class="titles">${wordmark(home ? "" : "page")}${home ? "" : `<span class="sub">${esc(title)}</span>`}<small>${esc(sub)}</small></div></div>
      <span class="tag streak" title="Lerntage in Folge">${I.flame} ${streak()}</span></div>`;
  }
  const profileLine = () => `${S.profile.job} · ${P.tracks[S.profile.track].label}`;
  const backBtn = (act, label = "Zurück") => `<button class="btn btn-glass icon-btn" data-act="${act}" aria-label="${label}">${label === "Beenden" ? I.close : I.back}</button>`;

  /* ── Onboarding ── */
  VIEWS.onboarding = () => {
    const o = view.o || (view.o = { step: 0, track: null, job: null, date: "", bayern: true, days: [...S.plan.days], minutes: S.plan.minutes, time: S.plan.time });
    if (o.step === 0) {
      return `<div class="onb welcome">
        <div class="glass card wcard">
          <div class="eyebrow center-e">Willkommen bei</div>
          <img class="wmark" src="${MARK}" alt="">
          <div class="center">${wordmark("hero")}</div>
          <p class="lead">Dein persönlicher Lernbegleiter für die Prüfung in <b>Wirtschafts- und Sozialkunde</b>. Hier lernst du mit Karteikarten, Fallsituationen und kleinen Trainingsaufgaben – und kannst die Prüfung vorher unter echten Bedingungen üben.</p>
          <div class="howto">
            <div><span>1</span><p><strong class="ht">Wähle deinen Bereich</strong>Lernst du im <b>Handwerk</b> oder in der <b>Industrie</b>? Danach suchst du deinen Beruf aus – die Inhalte passen sich an.</p></div>
            <div><span>2</span><p><strong class="ht">Trag deinen Prüfungstag ein</strong>Das ist freiwillig. Mit Datum bekommst du einen Lernplan mit Phasen, Probeprüfungen und einer Prognose.</p></div>
            <div><span>3</span><p><strong class="ht">Leg fest, wann du lernst</strong>Wähle deine Lerntage und wie viel Zeit du hast. Dann wartet jeden Tag deine Tagesmission auf dich.</p></div>
          </div>
          <button class="btn btn-primary btn-block" data-act="onbNext">Los geht's</button>
          <p class="tiny center" style="margin:12px 0 0">Ohne Anmeldung. Dein Lernstand bleibt nur auf deinem Gerät.</p>
        </div></div>`;
    }
    const steps = `<div class="steps">${[1, 2, 3, 4].map((i) => `<i class="${i <= o.step ? "on" : ""}"></i>`).join("")}</div>`;
    let body = "";
    if (o.step === 1) {
      body = `<div class="eyebrow">Schritt 1</div><h1>Handwerk oder Industrie?</h1>
        <p class="muted">Bei welcher Kammer legst du deine Prüfung ab? Die meisten Inhalte sind gleich, einige Fragen gibt es nur für deinen Bereich.</p>
        <button class="choice ${o.track === "hwk" ? "on" : ""}" data-act="onbTrack" data-v="hwk"><div class="ic red">${I.hammer}</div><div><b>Handwerk</b><span>Gesellenprüfung bei der Handwerkskammer – z. B. Klempner, SHK</span></div></button>
        <button class="choice ${o.track === "ihk" ? "on" : ""}" data-act="onbTrack" data-v="ihk"><div class="ic blue">${I.factory}</div><div><b>Industrie & Handel</b><span>Abschlussprüfung bei der IHK – z. B. Mechatroniker</span></div></button>`;
    } else if (o.step === 2) {
      const t = P.tracks[o.track];
      body = `<div class="eyebrow">Schritt 2 · ${esc(t.label)}</div><h1>Dein Beruf</h1><p class="muted">Wähle deinen Ausbildungsberuf.</p>
        <div class="chips" style="margin:14px 0 6px">${t.jobs.map((j) => `<button class="chip ${o.job === j ? "on" : ""}" data-act="onbJob" data-v="${esc(j)}">${esc(j)}</button>`).join("")}</div>`;
    } else if (o.step === 3) {
      body = `<div class="eyebrow">Schritt 3 · freiwillig</div><h1>Wann ist deine Prüfung?</h1><p class="muted">Aus dem Datum entsteht dein Lernplan mit drei Phasen und festen Probeprüfungen. Du kannst das Feld auch leer lassen und es später eintragen.</p>
        <label class="field"><span>Tag der schriftlichen Prüfung</span><input type="date" id="onbDate" value="${esc(o.date)}" min="${isoOf(today() + 1)}"></label>
        <div class="switch"><div><b>Bayern-Fragen</b><div class="tiny">Landtag, Kommunalwahl, mittlerer Schulabschluss in Bayern</div></div><input type="checkbox" id="onbBy" ${o.bayern ? "checked" : ""}></div>`;
    } else {
      body = `<div class="eyebrow">Schritt 4</div><h1>Wann lernst du?</h1><p class="muted">Wähle deine Lerntage und wie viel Zeit du dir nimmst. Verpasst du mal einen Tag, verteilt der Plan den Stoff einfach neu.</p>
        ${rhythmFields(o)}`;
    }
    const canNext = (o.step === 1 && o.track) || (o.step === 2 && o.job) || o.step === 3 || (o.step === 4 && o.days.length);
    return `<div class="onb"><div class="glass card">${steps}${body}
      <div class="btn-row" style="margin-top:18px">
        <button class="btn btn-glass" data-act="onbBack">Zurück</button>
        <button class="btn btn-primary" data-act="onbNext" ${canNext ? "" : "disabled"}>${o.step === 4 ? "Plan erstellen" : o.step === 3 && !o.date ? "Weiter" : "Weiter"}</button>
      </div></div></div>`;
  };
  function rhythmFields(o) {
    const order = [1, 2, 3, 4, 5, 6, 0];
    return `<div class="field"><span class="flabel">Lerntage</span><div class="daypick">${order.map((d) => `<button class="${o.days.includes(d) ? "on" : ""}" data-act="rDay" data-v="${d}" aria-pressed="${o.days.includes(d)}">${WD[d]}</button>`).join("")}</div></div>
      <div class="field"><span class="flabel">Zeit pro Lerntag</span><div class="seg">${[10, 15, 20, 30].map((m) => `<button class="${o.minutes === m ? "on" : ""}" data-act="rMin" data-v="${m}">${m} Min.</button>`).join("")}</div></div>
      <label class="field"><span>Uhrzeit (für den Kalender)</span><input type="time" id="rTime" value="${esc(o.time)}" data-act="rTime"></label>`;
  }
  ACT.rDay = (el) => { const o = view.o; const d = +el.dataset.v; const k = o.days.indexOf(d); k >= 0 ? o.days.splice(k, 1) : o.days.push(d); rerender(); };
  ACT.rMin = (el) => { view.o.minutes = +el.dataset.v; rerender(); };
  ACT.rTime = (el) => { view.o.time = el.value || "17:00"; };
  ACT.onbTrack = (el) => { if (view.o.track !== el.dataset.v) view.o.job = null; view.o.track = el.dataset.v; rerender(); };
  ACT.onbJob = (el) => { view.o.job = el.dataset.v; rerender(); };
  ACT.onbBack = () => { view.o.step--; render(); };
  ACT.onbNext = () => {
    const o = view.o;
    if (o.step === 3) { o.date = $("#onbDate").value; o.bayern = $("#onbBy").checked; }
    if (o.step < 4) { o.step++; render(); return; }
    S.profile = { track: o.track, job: o.job, date: o.date, bayern: o.bayern };
    S.plan = { days: o.days, minutes: o.minutes, time: o.time, start: today() };
    S.missions = {}; save(); go("home"); toast("Dein Lernplan steht");
  };

  /* ── Heute ── */
  VIEWS.home = () => {
    const ph = phaseInfo(); const m = mission(); const ms = missionState(m);
    const term = termOfDay(); const pr = prognosis();
    const T = today(); const r = 46, circ = 2 * Math.PI * r;
    let phaseCard = "";
    if (ph.id === "none") phaseCard = `<div class="glass card tight row-between"><div><b>Noch kein Prüfungstermin</b><div class="tiny">Trag ihn ein – dann bekommst du Phasen, Probeprüfungen und eine Prognose.</div></div><button class="btn btn-primary btn-s" data-act="toSettings">Eintragen</button></div>`;
    else if (ph.id === "day") phaseCard = `<div class="glass card hero-day"><div class="eyebrow">Heute ist Prüfungstag</div><h1>Viel Erfolg! Du bist vorbereitet.</h1><p class="muted" style="margin:0">Frühstücken, Ausweis einpacken, rechtzeitig losfahren. Kurz vorher nur noch die Merkhilfen anschauen – nichts Neues mehr.</p></div>`;
    else if (ph.id === "after") phaseCard = `<div class="glass card tight row-between"><div><b>Prüfung vorbei</b><div class="tiny">Du kannst weiter üben oder einen neuen Termin eintragen.</div></div><button class="btn btn-glass btn-s" data-act="toSettings">Ändern</button></div>`;
    else {
      const P3 = PHASES[ph.id];
      const segs = [["learn", ph.start, ph.p1end], ["firm", ph.p1end + 1, ph.finalStart - 1], ["final", ph.finalStart, ph.E - 1]].filter(([, a, b]) => b >= a);
      const span = ph.E - ph.start;
      const bar = segs.map(([id, a, b]) => `<i style="flex:${b - a + 1};background:${PHASES[id].color};opacity:${id === ph.id ? 1 : 0.28}"></i>`).join("");
      const pos = Math.min(100, Math.max(0, ((T - ph.start) / Math.max(1, span)) * 100));
      phaseCard = `<div class="glass card phase"><div class="row-between"><div><span class="pill" style="background:${P3.color}">${P3.short} · ${P3.name}</span></div><div class="count"><b>${ph.left}</b><span>${ph.left === 1 ? "Tag" : "Tage"} bis zur Prüfung</span></div></div>
        <div class="phasebar">${bar}<em style="left:${pos}%"></em></div><p class="tiny" style="margin:8px 0 0">${P3.desc}</p></div>`;
    }
    let missionCard;
    if (m.rest) {
      const next = (() => { for (let n = T + 1; n < T + 8; n++) if (isLearn(n)) return n; return null; })();
      missionCard = `<div class="glass card mission rest"><div class="eyebrow">Tagesmission</div><h2>Heute ist lernfrei</h2><p class="muted">Dein nächster Lerntag ist ${next ? fmt(next, true) : "bald"}. Wer mag, kann trotzdem eine Runde üben – das zählt extra.</p>
        <div class="btn-row"><button class="btn btn-glass" data-act="startQuiz">Kurzes Quiz</button><button class="btn btn-glass" data-act="startLearnFree">Frei lernen</button></div></div>`;
    } else {
      const label = { rev: (x) => `${x.need} Karten wiederholen`, new: (x) => `${x.need} neue Karten lernen`, quiz: () => "Schnell-Quiz (10 Fragen)", train: () => "1 Trainingsaufgabe", exam: (x) => `${x.label} (60 Min.)` };
      const icon = { rev: I.repeat, new: I.plus, quiz: I.quiz, train: I.puzzle, exam: I.exam };
      const rows = ms.items.map((x, i) => `<button class="mrow ${x.done ? "done" : ""}" data-act="mItem" data-v="${i}"><span class="mic">${x.done ? I.check : icon[x.k]}</span><span class="grow"><b>${label[x.k](x)}</b>${x.need > 1 && !x.done ? `<span class="mbar"><i style="width:${pct(x.have / x.need)}%"></i></span>` : ""}</span>${x.done ? "" : `<span class="chev">${I.chev}</span>`}</button>`).join("");
      missionCard = `<div class="glass card mission ${ms.done ? "complete" : ""}">
        <div class="mhead"><div><div class="eyebrow">Tagesmission · ${fmt(T)}</div><h2>${ms.done ? "Mission erfüllt!" : "Dein Plan für heute"}</h2><div class="tiny">${ms.done ? `Stark – ${streak()} ${streak() === 1 ? "Lerntag" : "Lerntage"} in Folge.` : `ca. ${ms.mins} Minuten`}</div></div>
          <div class="ring sm"><svg viewBox="0 0 110 110"><circle class="bg" cx="55" cy="55" r="${r}" fill="none" stroke-width="10"/><circle class="fg" cx="55" cy="55" r="${r}" fill="none" stroke-width="10" stroke-linecap="round" stroke-dasharray="${circ}" stroke-dashoffset="${circ * (1 - ms.frac)}"/></svg><span>${pct(ms.frac)}%</span></div></div>
        <div class="mlist">${rows}</div>
        ${ms.done ? `<button class="btn btn-glass btn-block" data-act="startQuiz">Bonusrunde: Quiz</button>` : `<button class="btn btn-primary btn-block" data-act="mStart">Mission starten</button>`}</div>`;
    }
    const prog = pr ? `<button class="glass card tight progmini lvl-${pr.lvl}" data-act="toPlan"><span class="lamp"></span><span class="grow">${pr.measured ? `<b>Prognose: ${pct(pr.proj)} % Prüfungsreife</b><span class="tiny">${pr.lvl === "ok" ? "Du bist auf Kurs." : pr.lvl === "mid" ? "Knapp – halte deine Lerntage ein." : "Mehr Tempo nötig – plane mehr Zeit ein."} Aktuell ${pct(pr.r)} %.</span>` : `<b>Prüfungsreife: ${pct(pr.r)} %</b><span class="tiny">Die Prognose startet, sobald du ein paar Tage gelernt hast.</span>`}</span><span class="chev">${I.chev}</span></button>` : "";
    return `${header("PuG Compass", profileLine())}
      <button class="glass card term" data-act="termFlip" aria-expanded="${!!view.termOpen}"><div class="eyebrow">${I.sparkle} Begriff des Tages</div><div class="tw">${esc(term.w)}</div>
        <div class="td ${view.termOpen ? "open" : ""}">${view.termOpen ? esc(term.d) : "Was bedeutet das? Erst überlegen, dann antippen."}</div></button>
      ${phaseCard}${missionCard}${prog}`;
  };
  ACT.termFlip = () => { view.termOpen = !view.termOpen; rerender(); };
  ACT.toSettings = () => go("settings");
  ACT.toPlan = () => go("plan");
  ACT.mStart = () => { const ms = missionState(mission()); const i = ms.items.findIndex((x) => !x.done); if (i >= 0) runMissionItem(ms.items[i]); };
  ACT.mItem = (el) => { const it = missionState(mission()).items[+el.dataset.v]; if (!it.done) runMissionItem(it); };
  function runMissionItem(it) {
    if (it.k === "rev" || it.k === "new") {
      const ms = missionState(mission());
      const rev = ms.items.find((x) => x.k === "rev"), nw = ms.items.find((x) => x.k === "new");
      const cards = pool();
      const due = shuffle(cards.filter(isDue)).sort((a, b) => st(a.id).b - st(b.id).b).slice(0, rev ? rev.need - rev.have : 0);
      const fresh = shuffle(cards.filter((c) => st(c.id).b === 0)).slice(0, nw ? nw.need - nw.have : 0);
      const list = it.k === "new" ? [...fresh, ...due] : [...due, ...fresh];
      startRun(list, true);
    } else if (it.k === "quiz") startQuiz(null, true);
    else if (it.k === "train") startTask(null, true);
    else if (it.k === "exam") { view = { name: "exam", ...buildExam("full") }; render(); }
  }

  /* ── Lernen ── */
  VIEWS.learn = () => {
    const cards = pool();
    const rows = P.topics.map((t) => {
      const tc = cards.filter((c) => c.t === t.id); if (!tc.length) return "";
      const due = tc.filter(isDue).length, rd = readiness(tc);
      return `<button class="topic" data-act="learnTopic" data-v="${t.id}"><span class="dot" style="background:${t.color}"></span>
        <span class="name"><b>${esc(t.title)}</b><span class="bar"><i style="width:${pct(rd)}%;background:${t.color}"></i></span><span class="tiny">${tc.length} Karten · ${due} fällig</span></span><span class="pct">${pct(rd)} %</span></button>`;
    }).join("");
    const weak = cards.filter((c) => st(c.id).bad > 0 && st(c.id).b <= 2).length;
    const falls = cards.filter((c) => c.f).length;
    return `${header("Lernen", profileLine())}
      <div class="actions">
        <button class="glass action" data-act="startLearnFree"><span class="ic blue">${I.cards}</span><span><b>Gemischt lernen</b><span>Fällige und neue Karten aus allen Themen</span></span><span class="chev">${I.chev}</span></button>
        <button class="glass action" data-act="learnFall"><span class="ic violet">${I.story}</span><span><b>Fallsituationen</b><span>${falls} Situationen aus dem Arbeitsalltag</span></span><span class="chev">${I.chev}</span></button>
        ${weak ? `<button class="glass action" data-act="learnWeak"><span class="ic red">${I.repeat}</span><span><b>Schwächen üben</b><span>${weak} Karten, die zuletzt nicht saßen</span></span><span class="chev">${I.chev}</span></button>` : ""}
      </div>
      <div class="glass card"><h2>Themen</h2>${rows}</div>
      <div class="glass card"><h2>Merkhilfen</h2><div class="grid2">${P.mnemonics.map((m) => `<button class="mnemo" data-act="mnemo"><b>${esc(m.t)}</b><div class="m">${esc(m.m)}</div><div class="a">${esc(m.a)}</div></button>`).join("")}</div><p class="tiny" style="margin-bottom:0">Antippen zeigt die Auflösung.</p></div>
      <p class="tiny center">So funktioniert's: Je nachdem, wie gut du eine Karte wusstest, kommt sie morgen, in 3, 7, 14 oder 30 Tagen wieder.</p>`;
  };
  ACT.mnemo = (el) => el.classList.toggle("open");
  ACT.startLearnFree = () => {
    const cards = pool();
    const due = shuffle(cards.filter(isDue)).sort((a, b) => st(a.id).b - st(b.id).b);
    const fresh = shuffle(cards.filter((c) => st(c.id).b === 0));
    startRun([...due.slice(0, 15), ...fresh.slice(0, 8)].slice(0, 20));
  };
  ACT.learnTopic = (el) => {
    const cards = pool().filter((c) => c.t === el.dataset.v);
    let list = [...shuffle(cards.filter(isDue)), ...shuffle(cards.filter((c) => st(c.id).b === 0))].slice(0, 15);
    if (!list.length) list = shuffle(cards).slice(0, 10);
    startRun(list);
  };
  ACT.learnFall = () => {
    const cards = pool().filter((c) => c.f);
    startRun(shuffle(cards).sort((a, b) => st(a.id).b - st(b.id).b).slice(0, 8));
  };
  ACT.learnWeak = () => startRun(shuffle(pool().filter((c) => st(c.id).bad > 0 && st(c.id).b <= 2)).slice(0, 15));
  function startRun(list, fromMission) {
    go("learnRun", { queue: list.map((c) => c.id), total: list.length, shown: false, checks: [], done: { 0: 0, 1: 0, 2: 0 }, fromMission });
  }

  VIEWS.learnRun = () => {
    const v = view;
    const close = backBtn("endRun", "Beenden");
    if (!v.queue.length) {
      const n = v.done[0] + v.done[1] + v.done[2];
      const ms = missionState(mission());
      return `<div class="learn-head">${close}<div class="progress-line"><i style="width:100%"></i></div></div>
        <div class="glass card empty"><div class="big">${n ? "✓" : "•"}</div><h2>${n ? "Runde geschafft" : "Gerade nichts zu lernen"}</h2>
        <p class="muted">${n ? `Gewusst: <b>${v.done[2]}</b> · Unsicher: <b>${v.done[1]}</b> · Nochmal: <b>${v.done[0]}</b>` : "Alle fälligen Karten sind erledigt. Probier ein Quiz oder eine Trainingsaufgabe."}</p>
        <div class="btn-row"><button class="btn btn-glass" data-act="endRun">${v.fromMission ? "Zur Mission" : "Fertig"}</button>${v.fromMission && !ms.done ? `<button class="btn btn-primary" data-act="mStart">Weiter mit der Mission</button>` : ""}</div></div>`;
    }
    const c = P.cards.find((x) => x.id === v.queue[0]);
    const prog = v.total ? (v.total - v.queue.length) / v.total : 0;
    const isNew = st(c.id).b === 0;
    let ans = "";
    if (v.shown) {
      const keys = c.k ? `<div class="tiny" style="margin-bottom:6px">Hake ab, was du hattest${c.n ? ` (verlangt: ${c.n})` : ""}:</div>
        <div class="checks">${c.k.map((k, i) => `<button class="check ${v.checks.includes(i) ? "on" : ""}" data-act="chk" data-v="${i}"><span class="box">${v.checks.includes(i) ? I.check : ""}</span>${esc(k)}</button>`).join("")}</div>` : "";
      const sug = c.k && c.n ? (v.checks.length >= c.n ? 2 : v.checks.length >= Math.ceil(c.n / 2) ? 1 : 0) : null;
      ans = `<div class="answer"><div class="label">Musterlösung</div><p>${esc(c.a)}</p>${standNote(c)}${keys}</div>
        <div class="tiny center" style="margin:14px 0 8px">Wie gut wusstest du es?</div>
        <div class="rate">
          <button class="btn r-bad ${sug === 0 ? "sug" : ""}" data-act="rate" data-v="0">Nochmal<small>gleich wieder</small></button>
          <button class="btn r-mid ${sug === 1 ? "sug" : ""}" data-act="rate" data-v="1">Unsicher<small>morgen</small></button>
          <button class="btn r-ok ${sug === 2 ? "sug" : ""}" data-act="rate" data-v="2">Gewusst<small>in ${INTERVAL[Math.min(5, st(c.id).b + 1)]} T.</small></button>
        </div>`;
    }
    return `<div class="learn-head">${close}<div class="progress-line"><i style="width:${pct(prog)}%"></i></div><span class="tiny">${v.total - v.queue.length + 1}/${v.total}</span></div>
      <div class="glass qcard"><div class="qmeta">${isNew ? '<span class="tag new">neu</span>' : ""}${metaTags(c)}</div>
        ${fallBox(c)}<p class="qtext">${esc(c.q)}</p>
        ${v.shown ? "" : `<textarea id="myAns" placeholder="Deine Antwort (optional) – erst überlegen, dann aufdecken">${esc(v.draft || "")}</textarea>
        <button class="btn btn-primary btn-block" style="margin-top:12px" data-act="reveal">Antwort zeigen</button>`}
        ${v.shown && v.draft ? `<div class="tiny" style="margin-top:4px">Deine Antwort:</div><p class="mine">${esc(v.draft)}</p>` : ""}
        ${ans}
      </div>`;
  };
  ACT.endRun = () => go(view.fromMission ? "home" : "learn");
  ACT.reveal = () => { view.draft = ($("#myAns")?.value || "").trim(); view.shown = true; render(); };
  ACT.chk = (el) => { const i = +el.dataset.v; const a = view.checks; const k = a.indexOf(i); k >= 0 ? a.splice(k, 1) : a.push(i); rerender(); };
  ACT.rate = (el) => {
    const r = +el.dataset.v; const id = view.queue.shift(); const c = P.cards.find((x) => x.id === id);
    grade(c, r, "learn"); view.done[r]++;
    if (r === 0) view.queue.splice(Math.min(view.queue.length, 3), 0, id);
    view.shown = false; view.checks = []; view.draft = "";
    render();
  };

  /* ── Training ── */
  VIEWS.train = () => {
    const tasks = P.tasks.filter(fits);
    const cnt = (t) => tasks.filter((x) => x.type === t).length;
    return `${header("Training", profileLine())}
      <div class="actions">
        <button class="glass action" data-act="startQuizBtn"><span class="ic teal">${I.quiz}</span><span><b>Schnell-Quiz</b><span>10 Multiple-Choice-Fragen, Schwächen zuerst</span></span><span class="chev">${I.chev}</span></button>
        <button class="glass action" data-act="startTaskType" data-v="match"><span class="ic blue">${I.match}</span><span><b>Zuordnen</b><span>${cnt("match")} Aufgaben – finde die passenden Paare</span></span><span class="chev">${I.chev}</span></button>
        <button class="glass action" data-act="startTaskType" data-v="order"><span class="ic violet">${I.order}</span><span><b>Reihenfolge</b><span>${cnt("order")} Abläufe in die richtige Ordnung bringen</span></span><span class="chev">${I.chev}</span></button>
        <button class="glass action" data-act="startTaskType" data-v="cloze"><span class="ic orange">${I.gap}</span><span><b>Lückentext</b><span>${cnt("cloze")} Texte vervollständigen</span></span><span class="chev">${I.chev}</span></button>
        <button class="glass action" data-act="toCalc"><span class="ic red">${I.euro}</span><span><b>Lohnzettel-Rechner</b><span>Sieh, wohin jeder Euro deiner Vergütung geht</span></span><span class="chev">${I.chev}</span></button>
      </div>`;
  };
  ACT.startQuizBtn = () => startQuiz(null);
  ACT.startQuiz = () => startQuiz(null);
  ACT.startTaskType = (el) => startTask(el.dataset.v);
  ACT.toCalc = () => go("calc");

  function startQuiz(topic, fromMission) {
    const cards = pool().filter((c) => c.mc && (!topic || c.t === topic));
    const scored = shuffle(cards).sort((a, b) => (st(a.id).b - st(b.id).b) || (st(b.id).bad - st(a.id).bad));
    const pick = shuffle(scored.slice(0, 18)).slice(0, 10);
    go("quiz", { items: pick.map((c) => ({ id: c.id, opts: shuffle(c.mc.map((t, i) => ({ t, ok: i === 0 }))), pick: null })), i: 0, fromMission, counted: false });
  }
  VIEWS.quiz = () => {
    const v = view;
    const close = backBtn("quizEnd", "Beenden");
    if (v.i >= v.items.length) {
      if (!v.counted) { v.counted = true; bump("quiz"); }
      const right = v.items.filter((x) => x.opts[x.pick]?.ok).length;
      return `<div class="learn-head">${close}<div class="progress-line"><i style="width:100%"></i></div></div>
        <div class="glass card empty"><div class="score">${right}<span>/${v.items.length}</span></div><h2>${right >= 8 ? "Stark – das sitzt." : right >= 5 ? "Gut gemacht." : "Dranbleiben."}</h2>
        <p class="muted">Falsch beantwortete Fragen landen automatisch wieder in deinem Lernstapel.</p>
        <div class="btn-row"><button class="btn btn-glass" data-act="quizEnd">${v.fromMission ? "Zur Mission" : "Fertig"}</button><button class="btn btn-primary" data-act="startQuiz">Nochmal 10</button></div></div>`;
    }
    const it = v.items[v.i]; const c = P.cards.find((x) => x.id === it.id);
    const answered = it.pick !== null; const L = "ABCD";
    const opts = it.opts.map((o, i) => {
      let cls = ""; if (answered) { if (o.ok) cls = "right"; else if (i === it.pick) cls = "wrong"; }
      return `<button class="opt ${cls}" data-act="qpick" data-v="${i}" ${answered ? "disabled" : ""}><span class="l">${L[i]}</span><span>${esc(o.t)}</span></button>`;
    }).join("");
    const ok = answered && it.opts[it.pick].ok;
    return `<div class="learn-head">${close}<div class="progress-line"><i style="width:${pct(v.i / v.items.length)}%"></i></div><span class="tiny">${v.i + 1}/${v.items.length}</span></div>
      <div class="glass qcard"><div class="qmeta">${metaTags(c)}</div>${fallBox(c)}<p class="qtext">${esc(c.q)}</p><div class="opts">${opts}</div>
      ${answered ? `<div class="feedback ${ok ? "ok" : "bad"}"><b>${ok ? "Richtig!" : "Leider falsch."}</b>${esc(c.a)}</div>${standNote(c)}
      <button class="btn btn-primary btn-block" style="margin-top:12px" data-act="qnext">${v.i + 1 < v.items.length ? "Weiter" : "Auswertung"}</button>` : ""}</div>`;
  };
  ACT.quizEnd = () => go(view.fromMission ? "home" : "train");
  ACT.qpick = (el) => { const it = view.items[view.i]; if (it.pick !== null) return; it.pick = +el.dataset.v; grade(P.cards.find((x) => x.id === it.id), it.opts[it.pick].ok ? 2 : 0, "quiz"); rerender(); };
  ACT.qnext = () => { view.i++; render(); };

  /* ── Trainingsaufgaben: Zuordnen, Reihenfolge, Lückentext ── */
  function startTask(type, fromMission) {
    const all = P.tasks.filter((x) => fits(x) && (!type || x.type === type));
    const seen = S.seenTasks || (S.seenTasks = {});
    const pick = shuffle(all).sort((a, b) => (seen[a.id] || 0) - (seen[b.id] || 0))[0];
    seen[pick.id] = Date.now(); save();
    const v = { name: "task", task: pick, type, fromMission, checked: false };
    if (pick.type === "match") Object.assign(v, { right: shuffle(pick.pairs.map((p) => p[1])), sel: null, matched: {}, miss: 0, flash: null });
    if (pick.type === "order") Object.assign(v, { pool: shuffle(pick.items.map((t, i) => i)), answer: [] });
    if (pick.type === "cloze") {
      const parts = []; let gi = 0;
      pick.text.split(/(\{[^}]+\})/).forEach((seg) => {
        if (seg.startsWith("{")) { const opts = seg.slice(1, -1).split("|"); parts.push({ gap: gi++, right: opts[0], opts: shuffle(opts) }); }
        else if (seg) parts.push({ text: seg });
      });
      Object.assign(v, { parts, vals: {} });
    }
    view = v; render();
  }
  VIEWS.task = () => {
    const v = view, t = v.task; const tp = topicById(t.t);
    const label = { match: "Zuordnen", order: "Reihenfolge", cloze: "Lückentext" }[t.type];
    let body = "", done = false, score = "";
    if (t.type === "match") {
      const lefts = t.pairs.map((p, i) => {
        const m = v.matched[i] != null;
        return `<button class="mtile ${m ? "ok" : ""} ${v.sel === i ? "sel" : ""} ${v.flash && v.flash[0] === i ? "bad" : ""}" data-act="mL" data-v="${i}" ${m ? "disabled" : ""}>${esc(p[0])}</button>`;
      }).join("");
      const used = Object.values(v.matched);
      const rights = v.right.map((r, j) => `<button class="mtile r ${used.includes(j) ? "ok" : ""} ${v.flash && v.flash[1] === j ? "bad" : ""}" data-act="mR" data-v="${j}" ${used.includes(j) ? "disabled" : ""}>${esc(r)}</button>`).join("");
      done = used.length === t.pairs.length;
      body = `<p class="tiny">Tippe links einen Begriff an und dann rechts das Passende.</p><div class="mgrid"><div class="mcol">${lefts}</div><div class="mcol">${rights}</div></div>`;
      if (done) score = `${t.pairs.length} Paare gefunden${v.miss ? `, ${v.miss} ${v.miss === 1 ? "Fehlversuch" : "Fehlversuche"}` : " – fehlerfrei!"}`;
    }
    if (t.type === "order") {
      if (!v.checked) {
        body = `<p class="tiny">Tippe die Schritte in der richtigen Reihenfolge an. Antippen in deiner Liste nimmt einen Schritt zurück.</p>
          <ol class="olist">${v.answer.map((i) => `<li><button class="otile set" data-act="oBack" data-v="${i}">${esc(t.items[i])}</button></li>`).join("")}${v.answer.length < t.items.length ? `<li class="ph">…</li>` : ""}</ol>
          <div class="opool">${v.pool.filter((i) => !v.answer.includes(i)).map((i) => `<button class="otile" data-act="oAdd" data-v="${i}">${esc(t.items[i])}</button>`).join("")}</div>
          <button class="btn btn-primary btn-block" data-act="oCheck" ${v.answer.length < t.items.length ? "disabled" : ""}>Prüfen</button>`;
      } else {
        const right = v.answer.filter((x, k) => x === k).length;
        body = `<ol class="olist">${v.answer.map((i, k) => `<li><span class="otile ${i === k ? "ok" : "bad"}">${esc(t.items[i])}</span></li>`).join("")}</ol>
          ${right < t.items.length ? `<div class="feedback ok"><b>Richtige Reihenfolge</b><ol class="plain">${t.items.map((x) => `<li>${esc(x)}</li>`).join("")}</ol></div>` : ""}`;
        done = true; score = `${right} von ${t.items.length} Schritten an der richtigen Stelle`;
      }
    }
    if (t.type === "cloze") {
      body = `<p class="cloze">${v.parts.map((p) => {
        if (p.text) return esc(p.text);
        const val = v.vals[p.gap] || "";
        const cls = v.checked ? (val === p.right ? "ok" : "bad") : "";
        return `<select class="gapsel ${cls}" data-act="cSel" data-v="${p.gap}" ${v.checked ? "disabled" : ""} aria-label="Lücke ${p.gap + 1}"><option value="">…</option>${p.opts.map((o) => `<option ${o === val ? "selected" : ""}>${esc(o)}</option>`).join("")}</select>${v.checked && val !== p.right ? `<span class="fix">${esc(p.right)}</span>` : ""}`;
      }).join("")}</p>`;
      const gaps = v.parts.filter((p) => p.right);
      if (!v.checked) body += `<button class="btn btn-primary btn-block" data-act="cCheck" ${Object.keys(v.vals).filter((k) => v.vals[k]).length < gaps.length ? "disabled" : ""}>Prüfen</button>`;
      else { done = true; score = `${gaps.filter((p) => v.vals[p.gap] === p.right).length} von ${gaps.length} Lücken richtig`; }
    }
    if (done && !v.counted) { v.counted = true; bump("train"); }
    return `<div class="learn-head">${backBtn("taskEnd", "Beenden")}<span class="tiny" style="flex:1">${label}</span></div>
      <div class="glass qcard"><div class="qmeta"><span class="tag"><i class="dotmini" style="background:${tp.color}"></i>${esc(tp.short)}</span></div><p class="qtext">${esc(t.title)}</p>${body}
      ${done ? `<div class="feedback ok" style="margin-top:14px"><b>${esc(score)}</b></div><div class="btn-row" style="margin-top:12px"><button class="btn btn-glass" data-act="taskEnd">${v.fromMission ? "Zur Mission" : "Fertig"}</button><button class="btn btn-primary" data-act="taskNext">Nächste Aufgabe</button></div>` : ""}</div>`;
  };
  ACT.taskEnd = () => go(view.fromMission ? "home" : "train");
  ACT.taskNext = () => startTask(view.type, false);
  ACT.mL = (el) => { view.sel = +el.dataset.v; view.flash = null; rerender(); };
  ACT.mR = (el) => {
    const v = view; const j = +el.dataset.v; if (v.sel == null) { toast("Erst links einen Begriff wählen"); return; }
    if (v.task.pairs[v.sel][1] === v.right[j]) { v.matched[v.sel] = j; v.sel = null; v.flash = null; }
    else { v.flash = [v.sel, j]; v.miss++; setTimeout(() => { if (view === v) { v.flash = null; rerender(); } }, 700); }
    rerender();
  };
  ACT.oAdd = (el) => { view.answer.push(+el.dataset.v); rerender(); };
  ACT.oBack = (el) => { const i = +el.dataset.v; view.answer = view.answer.filter((x) => x !== i); rerender(); };
  ACT.oCheck = () => { view.checked = true; rerender(); };
  ACT.cSel = (el) => { view.vals[+el.dataset.v] = el.value; rerender(); };
  ACT.cCheck = () => { view.checked = true; rerender(); };

  /* ── Lohnzettel-Rechner ── */
  VIEWS.calc = () => {
    const v = view.c || (view.c = { brutto: 980, age23: false, kids: false, zus: P.rates.kvZusatz, lst: 0, church: false });
    const R = P.rates; const b = Math.max(0, +v.brutto || 0);
    const gering = b > 0 && b <= R.geringverdiener;
    const rowsDef = [
      ["Krankenversicherung", R.kv / 2 + v.zus / 2, R.kv / 2 + v.zus / 2, "#2563c9"],
      ["Pflegeversicherung", R.pv / 2 + (v.age23 && !v.kids ? R.pvKinderlos : 0), R.pv / 2, "#7a5af8"],
      ["Rentenversicherung", R.rv / 2, R.rv / 2, "#0e9384"],
      ["Arbeitslosenversicherung", R.alv / 2, R.alv / 2, "#dc6803"],
    ];
    const rows = rowsDef.map(([n, an, ag, col]) => {
      const anE = gering ? 0 : (b * an) / 100, agE = gering ? (b * (an + ag)) / 100 : (b * ag) / 100;
      return { n, an, anE, agE, col };
    });
    const lst = Math.max(0, +v.lst || 0); const kist = v.church ? Math.round(lst * 0.08 * 100) / 100 : 0;
    const sv = rows.reduce((a, r) => a + r.anE, 0); const netto = Math.max(0, b - sv - lst - kist);
    const ag = rows.reduce((a, r) => a + r.agE, 0);
    const seg = (val, col, title) => val > 0 ? `<i style="flex:${val};background:${col}" title="${esc(title)}"></i>` : "";
    return `<div class="learn-head">${backBtn("toTrain")}<h2 style="margin:0">Lohnzettel-Rechner</h2></div>
      <div class="glass card">
        <label class="field"><span>Bruttovergütung pro Monat</span><div class="euroin"><input type="number" inputmode="decimal" min="0" step="10" id="cB" value="${esc(v.brutto)}" data-act="cIn" data-k="brutto"><b>€</b></div></label>
        <div class="grid2">
          <div class="switch"><div><b>23 Jahre oder älter</b></div><input type="checkbox" ${v.age23 ? "checked" : ""} data-act="cTog" data-k="age23"></div>
          <div class="switch"><div><b>Ich habe Kinder</b></div><input type="checkbox" ${v.kids ? "checked" : ""} data-act="cTog" data-k="kids"></div>
        </div>
        <details class="more"><summary>Weitere Angaben</summary>
          <label class="field"><span>Zusatzbeitrag deiner Krankenkasse (%)</span><input type="number" step="0.1" min="0" value="${esc(v.zus)}" data-act="cIn" data-k="zus"></label>
          <label class="field"><span>Lohnsteuer laut Abrechnung (€)</span><input type="number" step="1" min="0" value="${esc(v.lst)}" data-act="cIn" data-k="lst"><small class="tiny">Bei Ausbildungsvergütungen meist 0 €.</small></label>
          <div class="switch"><div><b>Kirchenmitglied</b><div class="tiny">Kirchensteuer in Bayern: 8 % der Lohnsteuer</div></div><input type="checkbox" ${v.church ? "checked" : ""} data-act="cTog" data-k="church"></div>
        </details>
      </div>
      <div class="glass card calcres" id="calcRes">
        <div class="row-between"><div><div class="tiny">Ausgezahlt (netto)</div><div class="netto">${eur(netto)}</div></div><div class="right"><div class="tiny">Abzüge</div><b>${eur(b - netto)}</b></div></div>
        <div class="stack">${seg(netto, "var(--ok)", "Netto")}${rows.map((r) => seg(r.anE, r.col, r.n)).join("")}${seg(lst + kist, "#64748b", "Steuern")}</div>
        <div class="ctable">
          ${rows.map((r) => `<div><span class="dotmini" style="background:${r.col}"></span><span class="grow">${r.n}<small>${gering ? "zahlt dein Betrieb" : `${r.an.toLocaleString("de-DE")} % Arbeitnehmeranteil`}</small></span><b>${eur(r.anE)}</b></div>`).join("")}
          ${lst || kist ? `<div><span class="dotmini" style="background:#64748b"></span><span class="grow">Steuern<small>Lohnsteuer${kist ? " + Kirchensteuer" : ""}</small></span><b>${eur(lst + kist)}</b></div>` : ""}
        </div>
        ${gering ? `<div class="note">Bis ${R.geringverdiener} € im Monat zahlt der Betrieb die Sozialversicherung allein (Geringverdienergrenze).</div>` : ""}
        <div class="agbox"><b>${eur(ag)}</b> zahlt dein Betrieb zusätzlich als Arbeitgeberanteil – dazu kommt noch die Unfallversicherung, die er allein trägt. Du kostest ihn also mindestens <b>${eur(b + ag)}</b> im Monat.</div>
        <p class="tiny" style="margin:10px 0 0">Beitragssätze Stand ${esc(P.stand)}. Vereinfachte Rechnung, ohne Gewähr.</p>
      </div>`;
  };
  ACT.toTrain = () => go("train");
  ACT.cIn = (el) => { view.c[el.dataset.k] = el.value; const res = VIEWS.calc(); const tmp = document.createElement("div"); tmp.innerHTML = res; $("#calcRes").replaceWith(tmp.querySelector("#calcRes")); };
  ACT.cTog = (el) => { view.c[el.dataset.k] = el.checked; rerender(); };

  /* ── Prüfungssimulation ── */
  const MC_W = 3, OPEN_W = 10;
  function buildExam(kind) {
    const cards = pool();
    const nMc = kind === "short" ? 10 : 20, nOpen = kind === "short" ? 2 : 4;
    const byTopic = (list, n) => {
      const groups = P.topics.map((t) => shuffle(list.filter((c) => c.t === t.id))).filter((g) => g.length);
      const out = []; let k = 0;
      while (out.length < n && groups.some((g) => g.length)) { const g = groups[k % groups.length]; if (g.length) out.push(g.shift()); k++; }
      return shuffle(out);
    };
    const mc = byTopic(cards.filter((c) => c.mc), nMc);
    const open = byTopic(cards.filter((c) => c.p >= 3 && !mc.includes(c)), nOpen);
    const items = [
      ...mc.map((c) => ({ id: c.id, type: "mc", w: MC_W, opts: shuffle(c.mc.map((t, i) => ({ t, ok: i === 0 }))), pick: null })),
      ...open.map((c) => ({ id: c.id, type: "open", w: OPEN_W, text: "", checks: [], self: null })),
    ];
    const minutes = kind === "short" ? 20 : P.tracks[S.profile.track].minutes;
    return { phase: "run", kind, items, i: 0, end: Date.now() + minutes * 60000, minutes };
  }
  VIEWS.exam = () => {
    const v = view;
    if (v.phase === "intro") {
      const pr = probes();
      const plist = pr.length ? `<div class="glass card"><h2>Deine Probeprüfungen</h2><div class="plist">${pr.map((p) => `<div class="prow ${p.state}"><span class="pdot"></span><span class="grow"><b>${esc(p.label)}</b><small>${fmt(p.day, true)}</small></span><span class="pstate">${p.state === "done" ? `Note ${gradeOf(p.done.pct).n}` : p.state === "due" ? "jetzt dran" : p.state === "missed" ? "verpasst" : "geplant"}</span></div>`).join("")}</div></div>` : "";
      const hist = S.exams.slice(-6).reverse().map((e) => `<div class="hrow"><span>${new Date(e.at).toLocaleDateString("de-DE")} · ${e.kind === "short" ? "Kurztest" : "Probeprüfung"}</span><b>${e.pct} % · Note ${gradeOf(e.pct).n}</b></div>`).join("");
      return `${header("Prüfung simulieren", profileLine())}
        <div class="glass card"><div class="eyebrow">${esc(P.tracks[S.profile.track].exam)}</div><h2>Unter echten Bedingungen üben</h2>
          <p class="muted">Gebundene Aufgaben (Multiple Choice) und offene Aufgaben aus allen Themen, mit Zeitlimit. Offene Antworten bewertest du am Ende selbst anhand der Musterlösung. Die Note ergibt sich nach dem 100-Punkte-Schlüssel.</p>
          <div class="grid2" style="margin-top:14px">
            <button class="glass action" data-act="examStart" data-v="full"><span class="ic red">${I.exam}</span><span><b>Probeprüfung</b><span>${P.tracks[S.profile.track].minutes} Min. · 20 MC + 4 offene</span></span></button>
            <button class="glass action" data-act="examStart" data-v="short"><span class="ic blue">${I.exam}</span><span><b>Kurztest</b><span>20 Min. · 10 MC + 2 offene</span></span></button>
          </div></div>
        ${plist}
        ${hist ? `<div class="glass card"><h2>Deine Ergebnisse</h2>${trendChart()}${hist}</div>` : ""}`;
    }
    if (v.phase === "run") {
      const it = v.items[v.i]; const c = P.cards.find((x) => x.id === it.id); const L = "ABCD";
      const body = it.type === "mc"
        ? `<div class="opts">${it.opts.map((o, i) => `<button class="opt ${it.pick === i ? "sel" : ""}" data-act="exPick" data-v="${i}"><span class="l">${L[i]}</span><span>${esc(o.t)}</span></button>`).join("")}</div>`
        : `<textarea id="exText" style="min-height:150px" placeholder="Deine Antwort…">${esc(it.text)}</textarea>`;
      const grid = v.items.map((x, i) => `<button class="${(x.type === "mc" ? x.pick !== null : x.text.trim()) ? "done" : ""} ${i === v.i ? "cur" : ""}" data-act="exJump" data-v="${i}">${i + 1}</button>`).join("");
      view.after = startTimer;
      return `<div class="glass exam-bar"><span class="timer" id="timer">--:--</span><span class="tiny" style="flex:1">Aufgabe ${v.i + 1} von ${v.items.length}</span><button class="btn btn-red btn-s" data-act="exFinish">Abgeben</button></div>
        <div class="glass qcard"><div class="qmeta"><span class="tag">${it.type === "mc" ? "Gebundene Aufgabe" : "Offene Aufgabe"}</span><span class="tag">${it.w} Punkte</span>${c.s ? `<span class="tag stand">Stand ${esc(c.s)}</span>` : ""}</div>
          ${fallBox(c)}<p class="qtext">${esc(c.q)}</p>${body}
          <div class="btn-row" style="margin-top:14px"><button class="btn btn-glass" data-act="exPrev" ${v.i === 0 ? "disabled" : ""}>Zurück</button><button class="btn btn-primary" data-act="exNext">${v.i + 1 < v.items.length ? "Weiter" : "Zur Übersicht"}</button></div></div>
        <div class="glass card tight"><div class="tiny" style="margin-bottom:8px">Übersicht</div><div class="qgrid">${grid}</div></div>`;
    }
    if (v.phase === "grade") {
      const rows = v.items.filter((x) => x.type === "open").map((it) => {
        const c = P.cards.find((x) => x.id === it.id); const idx = v.items.indexOf(it);
        const self = c.k
          ? `<div class="tiny" style="margin:8px 0 6px">Was davon steht in deiner Antwort?${c.n ? ` (verlangt: ${c.n})` : ""}</div><div class="checks">${c.k.map((k, i) => `<button class="check ${it.checks.includes(i) ? "on" : ""}" data-act="exChk" data-q="${idx}" data-v="${i}"><span class="box">${it.checks.includes(i) ? I.check : ""}</span>${esc(k)}</button>`).join("")}</div>`
          : `<div class="rate" style="margin-top:10px">${[["0", "falsch", "r-bad"], ["0.5", "teilweise", "r-mid"], ["1", "richtig", "r-ok"]].map(([val, lab, cl]) => `<button class="btn ${cl} ${String(it.self) === val ? "sug" : ""}" data-act="exSelf" data-q="${idx}" data-v="${val}">${lab}</button>`).join("")}</div>`;
        return `<div class="glass qcard"><div class="qmeta"><span class="tag">Aufgabe ${idx + 1}</span><span class="tag">${it.w} Punkte</span></div>${fallBox(c)}<p class="qtext" style="font-size:17px">${esc(c.q)}</p>
          <div class="tiny">Deine Antwort:</div><p class="mine">${it.text ? esc(it.text) : "<i class='muted'>(keine Antwort)</i>"}</p>
          <div class="answer" style="margin-top:0"><div class="label">Musterlösung</div><p>${esc(c.a)}</p>${standNote(c)}</div>${self}</div>`;
      }).join("");
      return `${header("Selbst bewerten", "Offene Aufgaben")}
        <div class="glass card"><p class="muted" style="margin:0">Die Multiple-Choice-Aufgaben sind ausgewertet. Vergleiche jetzt deine offenen Antworten ehrlich mit der Musterlösung.</p></div>
        ${rows}<button class="btn btn-primary btn-block" data-act="exResult">Ergebnis anzeigen</button>`;
    }
    if (v.phase === "result") {
      const r = v.result; const g = gradeOf(r.pct);
      const scale = [1, 2, 3, 4, 5, 6].map((n) => `<div class="${n === g.n ? "on" : ""}">${n}</div>`).join("");
      const grid = v.items.map((x, i) => `<button class="${x.score >= x.w ? "right" : x.score > 0 ? "" : "wrong"}" data-act="exReview" data-v="${i}">${i + 1}</button>`).join("");
      const per = P.topics.map((t) => {
        const its = v.items.filter((x) => P.cards.find((c) => c.id === x.id).t === t.id); if (!its.length) return "";
        const p = its.reduce((a, x) => a + x.score, 0) / its.reduce((a, x) => a + x.w, 0);
        return `<div class="topic static"><span class="dot" style="background:${t.color}"></span><span class="name"><b>${esc(t.short)}</b><span class="bar"><i style="width:${pct(p)}%;background:${t.color}"></i></span></span><span class="pct">${pct(p)} %</span></div>`;
      }).join("");
      let rev = "";
      if (v.review !== undefined) {
        const it = v.items[v.review]; const c = P.cards.find((x) => x.id === it.id);
        rev = `<div class="glass qcard"><div class="qmeta"><span class="tag">Aufgabe ${v.review + 1}</span><span class="tag">${Math.round(it.score * 10) / 10} / ${it.w} Punkte</span></div>${fallBox(c)}<p class="qtext" style="font-size:17px">${esc(c.q)}</p>
          ${it.type === "mc" ? `<div class="opts">${it.opts.map((o, i) => `<div class="opt ${o.ok ? "right" : i === it.pick ? "wrong" : ""}"><span class="l">${"ABCD"[i]}</span><span>${esc(o.t)}</span></div>`).join("")}</div>` : ""}
          <div class="answer"><div class="label">Musterlösung</div><p>${esc(c.a)}</p>${standNote(c)}</div></div>`;
      }
      return `${header("Ergebnis", profileLine())}
        <div class="glass card grade"><div class="tiny">${r.points} von ${r.max} Punkten · ${r.pct} %</div><div class="big">${g.n}</div><div class="word">${g.word}</div>
          <div class="scale">${scale}</div><p class="tiny" style="margin-bottom:0">${g.n <= 4 ? "Bestanden – ab 50 Punkten gilt die Prüfung als bestanden." : "Noch nicht bestanden – ab 50 Punkten ist die Prüfung bestanden."} ${r.timeUp ? "Die Zeit war abgelaufen." : ""}</p></div>
        <div class="glass card"><h2>Nach Themen</h2>${per}<p class="tiny" style="margin-bottom:0">Schwache Themen bekommen in deinem Plan automatisch mehr Wiederholungen.</p></div>
        <div class="glass card tight"><div class="tiny" style="margin-bottom:8px">Antippen zum Nachschauen</div><div class="qgrid">${grid}</div></div>
        ${rev}
        <div class="btn-row"><button class="btn btn-glass" data-act="toHome">Zu Heute</button><button class="btn btn-primary" data-act="toExam">Prüfungen</button></div>`;
    }
    return "";
  };
  function trendChart() {
    const ex = S.exams.filter((e) => e.kind === "full").slice(-8);
    if (ex.length < 2) return "";
    const W = 320, H = 120, pad = 22;
    const x = (i) => pad + (i * (W - 2 * pad)) / (ex.length - 1), y = (p) => H - 18 - (p / 100) * (H - 30);
    const pts = ex.map((e, i) => `${x(i)},${y(e.pct)}`).join(" ");
    return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Verlauf der Probeprüfungen">
      <line x1="${pad}" x2="${W - pad}" y1="${y(50)}" y2="${y(50)}" class="gl dash"/><text x="${W - pad}" y="${y(50) - 4}" class="lbl" text-anchor="end">bestanden ab 50</text>
      <polyline points="${pts}" class="ln"/>${ex.map((e, i) => `<circle cx="${x(i)}" cy="${y(e.pct)}" r="4" class="pt"/><text x="${x(i)}" y="${H - 4}" class="lbl" text-anchor="middle">${gradeOf(e.pct).n}</text>`).join("")}</svg>`;
  }
  function saveExamText() { const t = $("#exText"); if (t && view.items) view.items[view.i].text = t.value; }
  function startTimer() {
    const tick = () => {
      const left = Math.max(0, view.end - Date.now()); const el = $("#timer"); if (!el) return;
      const m = Math.floor(left / 60000), s = Math.floor((left % 60000) / 1000);
      el.textContent = `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
      el.classList.toggle("low", left < 5 * 60000);
      if (left <= 0) { clearInterval(timerId); saveExamText(); toast("Zeit abgelaufen"); finishExam(true); }
    };
    tick(); timerId = setInterval(tick, 1000);
  }
  ACT.toExam = () => go("exam", { phase: "intro" });
  ACT.toHome = () => go("home");
  ACT.examStart = (el) => { view = { name: "exam", ...buildExam(el.dataset.v) }; render(); };
  ACT.exPick = (el) => { view.items[view.i].pick = +el.dataset.v; rerender(); };
  ACT.exPrev = () => { saveExamText(); view.i--; render(); };
  ACT.exNext = () => { saveExamText(); if (view.i + 1 < view.items.length) view.i++; render(); };
  ACT.exJump = (el) => { saveExamText(); view.i = +el.dataset.v; render(); };
  ACT.exFinish = () => {
    saveExamText();
    const open = view.items.filter((x) => (x.type === "mc" ? x.pick === null : !x.text.trim())).length;
    ask(open ? `Noch ${open} Aufgabe(n) unbeantwortet. Trotzdem abgeben?` : "Prüfung jetzt abgeben?", "Abgeben", () => finishExam(false));
  };
  function finishExam(timeUp) {
    clearInterval(timerId); view.timeUp = timeUp;
    view.items.filter((x) => x.type === "mc").forEach((x) => { x.score = x.pick !== null && x.opts[x.pick].ok ? x.w : 0; grade(P.cards.find((c) => c.id === x.id), x.score ? 2 : 0, "exam"); });
    view.phase = "grade"; render();
  }
  ACT.exChk = (el) => { const it = view.items[+el.dataset.q]; const i = +el.dataset.v; const k = it.checks.indexOf(i); k >= 0 ? it.checks.splice(k, 1) : it.checks.push(i); rerender(); };
  ACT.exSelf = (el) => { view.items[+el.dataset.q].self = +el.dataset.v; rerender(); };
  ACT.exResult = () => {
    view.items.filter((x) => x.type === "open").forEach((x) => {
      const c = P.cards.find((cc) => cc.id === x.id);
      const frac = c.k ? Math.min(1, x.checks.length / (c.n || c.k.length)) : (x.self || 0);
      x.score = Math.round(frac * x.w * 2) / 2;
      grade(c, frac >= 0.99 ? 2 : frac >= 0.5 ? 1 : 0, "exam");
    });
    const max = view.items.reduce((a, x) => a + x.w, 0), points = view.items.reduce((a, x) => a + x.score, 0);
    const p = Math.round((points / max) * 100);
    view.result = { points: Math.round(points * 10) / 10, max, pct: p, timeUp: view.timeUp };
    S.exams.push({ at: Date.now(), day: today(), pct: p, kind: view.kind }); S.exams = S.exams.slice(-40);
    if (view.kind === "full") bump("exam"); else save();
    view.phase = "result"; render();
  };
  ACT.exReview = (el) => { view.review = +el.dataset.v; rerender(); };

  /* ── Plan ── */
  VIEWS.plan = () => {
    const ph = phaseInfo(); const pr = prognosis(); const T = today();
    let phases = "";
    if (["learn", "firm", "final"].includes(ph.id)) {
      const segs = [["learn", ph.start, ph.p1end], ["firm", ph.p1end + 1, ph.finalStart - 1], ["final", ph.finalStart, ph.E - 1]].filter(([, a, b]) => b >= a);
      phases = `<div class="glass card"><h2>Deine Phasen</h2><div class="timeline">${segs.map(([id, a, b]) => {
        const st2 = T > b ? "past" : T >= a ? "now" : "next";
        return `<div class="tl ${st2}"><span class="tldot" style="background:${PHASES[id].color}"></span><div><b>${PHASES[id].short}: ${PHASES[id].name}</b><small>${fmt(a)} – ${fmt(b)}${st2 === "now" ? " · läuft gerade" : ""}</small><p>${PHASES[id].desc}</p></div></div>`;
      }).join("")}<div class="tl next"><span class="tldot" style="background:var(--ink)"></span><div><b>Prüfungstag</b><small>${fmt(ph.E, true)}</small></div></div></div></div>`;
    }
    let progC = "";
    if (pr) {
      const msg = { ok: "Wenn du so weitermachst, gehst du gut vorbereitet in die Prüfung.", mid: "Es wird knapp. Halte deine Lerntage ein oder plane etwas mehr Zeit ein.", bad: "Im aktuellen Tempo reicht es nicht ganz. Nimm dir mehr Lerntage oder mehr Minuten vor.", none: "Die gestrichelte Linie zeigt, wohin du kommst, wenn du deine Tagesmissionen erfüllst. Nach ein paar Lerntagen rechnet die App mit deinem echten Tempo." }[pr.lvl];
      progC = `<div class="glass card"><div class="row-between"><h2 style="margin:0">Prognose</h2><span class="pill lvl-${pr.lvl}">${pr.measured ? `${pct(pr.proj)} % am Prüfungstag` : `Ziel: ${pct(pr.proj)} %`}</span></div>
        ${progChart(pr, ph)}<p class="muted" style="margin:6px 0 0">${msg}</p><p class="tiny" style="margin:6px 0 0">Prüfungsreife heute: ${pct(pr.r)} %. ${pr.measured ? "Berechnet aus deinem Lerntempo der letzten drei Wochen." : ""}</p></div>`;
    }
    const pl = probes();
    const probeC = pl.length ? `<div class="glass card"><h2>Probeprüfungen</h2><div class="plist">${pl.map((p) => `<div class="prow ${p.state}"><span class="pdot"></span><span class="grow"><b>${esc(p.label)}</b><small>${fmt(p.day, true)}</small></span><span class="pstate">${p.state === "done" ? `Note ${gradeOf(p.done.pct).n}` : p.state === "due" ? "jetzt dran" : p.state === "missed" ? "verpasst" : "geplant"}</span></div>`).join("")}</div><p class="tiny" style="margin-bottom:0">Am geplanten Tag steht die Probeprüfung in deiner Tagesmission.</p></div>` : "";
    return `${header("Lernplan", profileLine())}
      ${ph.id === "none" ? `<div class="glass card"><h2>Noch kein Prüfungstermin</h2><p class="muted">Mit dem Datum bekommst du Phasen, feste Probeprüfungen, eine Prognose und den Kalender-Export.</p><button class="btn btn-primary" data-act="toSettings">Termin eintragen</button></div>` : ""}
      ${progC}${phases}
      <div class="glass card"><div class="row-between"><h2 style="margin:0">Kalender</h2><div class="calnav"><button class="btn btn-glass icon-btn sm" data-act="calPrev" aria-label="Vorheriger Monat">${I.back}</button><button class="btn btn-glass icon-btn sm flip" data-act="calNext" aria-label="Nächster Monat">${I.back}</button></div></div>${calendar()}</div>
      ${probeC}
      <div class="glass card"><h2>Dein Rhythmus</h2><p class="muted" style="margin-top:0">${S.plan.days.length} Lerntage pro Woche (${[1, 2, 3, 4, 5, 6, 0].filter((d) => S.plan.days.includes(d)).map((d) => WD[d]).join(", ")}) · je ${S.plan.minutes} Minuten · ${esc(S.plan.time)} Uhr</p>
        <div class="btn-row"><button class="btn btn-glass" data-act="toSettings">Ändern</button><button class="btn btn-primary" data-act="ics" ${ph.id === "none" ? "disabled" : ""}>${I.download} In Kalender</button></div>
        <p class="tiny" style="margin-bottom:0">„In Kalender“ lädt eine Datei mit deinen Lernterminen, Probeprüfungen und dem Prüfungstag. Öffne sie, um alles in deinen Handy-Kalender zu übernehmen – inklusive Erinnerung.</p></div>
      <div class="glass card"><h2>Mehr</h2><div class="list">
        <a href="${esc(P.links.coach)}" target="_blank" rel="noopener"><span class="lic">${I.bot}</span><span class="grow">KI-Lerncoach<small>Mündlich üben wie im Fachgespräch (fobizz)</small></span>${I.link}</a>
        ${P.links.extra.map((x) => `<a href="${esc(x.url)}" target="_blank" rel="noopener"><span class="lic">${I.puzzle}</span><span class="grow">${esc(x.title)}<small>${esc(x.src)}</small></span>${I.link}</a>`).join("")}
        <button class="row" data-act="toSettings"><span class="lic">${I.compass}</span><span class="grow">Profil & Prüfungstermin<small>${esc(profileLine())}</small></span>${I.chev}</button>
        <button class="row" data-act="export"><span class="lic">${I.download}</span><span class="grow">Lernstand sichern<small>Als Datei speichern, z. B. für ein neues Handy</small></span>${I.chev}</button>
        <button class="row" data-act="import"><span class="lic">${I.repeat}</span><span class="grow">Lernstand laden<small>Gesicherte Datei wieder einspielen</small></span>${I.chev}</button>
        <button class="row" data-act="reset"><span class="lic" style="color:var(--bad)">${I.close}</span><span class="grow" style="color:var(--bad)">Lernstand zurücksetzen</span></button>
      </div><input type="file" id="importFile" accept="application/json" hidden data-act="importFile"></div>
      <p class="tiny center">PuG Compass · Inhalte Stand ${esc(P.stand)} · ${pool().length} Karten · BS1 Bayreuth</p>`;
  };
  function progChart(pr, ph) {
    const T = today(); const E = ph.E ?? examDay();
    const first = Math.min(pr.snaps.length ? pr.snaps[0][0] : T, ph.start ?? T, T);
    const W = 320, H = 150, L = 30, Rr = 12, top = 12, bot = 26;
    const x = (d) => L + ((d - first) / Math.max(1, E - first)) * (W - L - Rr);
    const y = (v) => top + (1 - v) * (H - top - bot);
    const past = [...pr.snaps.filter(([d]) => d < T), [T, pr.r]];
    const line = past.map(([d, v]) => `${x(d).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
    const col = { ok: "var(--ok)", mid: "var(--warn)", bad: "var(--bad)", none: "var(--ink-3)" }[pr.lvl];
    return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Prognose der Prüfungsreife">
      ${[0, 0.5, 1].map((v) => `<line x1="${L}" x2="${W - Rr}" y1="${y(v)}" y2="${y(v)}" class="gl"/><text x="${L - 6}" y="${y(v) + 4}" class="lbl" text-anchor="end">${v * 100}%</text>`).join("")}
      <line x1="${L}" x2="${W - Rr}" y1="${y(0.8)}" y2="${y(0.8)}" class="gl dash"/><text x="${L + 4}" y="${y(0.8) - 4}" class="lbl">Ziel 80 %</text>
      <polyline points="${line}" class="ln"/>
      <line x1="${x(T)}" y1="${y(pr.r)}" x2="${x(E)}" y2="${y(pr.proj)}" class="ln proj" style="stroke:${col}"/>
      <circle cx="${x(T)}" cy="${y(pr.r)}" r="4.5" class="pt"/><circle cx="${x(E)}" cy="${y(pr.proj)}" r="5" style="fill:${col}"/>
      ${x(E) - x(T) > 46 ? `<text x="${Math.max(L + 12, x(T))}" y="${H - 8}" class="lbl" text-anchor="middle">heute</text>` : ""}<text x="${x(E)}" y="${H - 8}" class="lbl" text-anchor="end">Prüfung</text></svg>`;
  }
  function calendar() {
    const T = today(); const base = dateOf(T); let ym = view.cal ?? { y: base.getUTCFullYear(), m: base.getUTCMonth() };
    view.cal = ym;
    const first = Date.UTC(ym.y, ym.m, 1) / DAY; const days = new Date(Date.UTC(ym.y, ym.m + 1, 0)).getUTCDate();
    const lead = (weekday(first) + 6) % 7; const E = examDay(); const pr = probes();
    let cells = "";
    for (let i = 0; i < lead; i++) cells += `<span></span>`;
    for (let d = 0; d < days; d++) {
      const n = first + d; const cls = [];
      if (n === T) cls.push("today");
      if (active(n)) cls.push("did");
      else if (n > T && isLearn(n) && (E == null || n < E)) cls.push("plan");
      else if (n < T && isLearn(n) && S.plan.start != null && n >= S.plan.start) cls.push("miss");
      if (pr.some((p) => p.day === n)) cls.push("probe");
      if (n === E) cls.push("exam");
      cells += `<span class="${cls.join(" ")}">${d + 1}</span>`;
    }
    return `<div class="calhead">${MON_LONG[ym.m]} ${ym.y}</div><div class="cal">${["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"].map((w) => `<b>${w}</b>`).join("")}${cells}</div>
      <div class="legend"><span><i class="did"></i>gelernt</span><span><i class="plan"></i>Lerntag</span><span><i class="probe"></i>Probeprüfung</span><span><i class="exam"></i>Prüfung</span></div>`;
  }
  ACT.calPrev = () => { const c = view.cal; view.cal = c.m === 0 ? { y: c.y - 1, m: 11 } : { y: c.y, m: c.m - 1 }; rerender(); };
  ACT.calNext = () => { const c = view.cal; view.cal = c.m === 11 ? { y: c.y + 1, m: 0 } : { y: c.y, m: c.m + 1 }; rerender(); };

  ACT.ics = () => {
    const E = examDay(); const T = today(); if (E == null) return;
    const [hh, mm] = (S.plan.time || "17:00").split(":").map(Number);
    const stamp = new Date().toISOString().replace(/[-:]/g, "").slice(0, 15) + "Z";
    const dt = (n, h, m) => isoOf(n).replace(/-/g, "") + "T" + String(h).padStart(2, "0") + String(m).padStart(2, "0") + "00";
    const endOf = (h, m, add) => { const t = h * 60 + m + add; return [Math.floor(t / 60) % 24, t % 60]; };
    const ev = [];
    const esc2 = (s) => s.replace(/[,;]/g, (c) => "\\" + c);
    const BY = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];
    let firstLearn = null; for (let n = T; n < E; n++) if (isLearn(n)) { firstLearn = n; break; }
    if (firstLearn != null) {
      const [eh, em] = endOf(hh, mm, S.plan.minutes);
      ev.push(["BEGIN:VEVENT", `UID:pugc-learn-${firstLearn}@pugcompass`, `DTSTAMP:${stamp}`, `DTSTART:${dt(firstLearn, hh, mm)}`, `DTEND:${dt(firstLearn, eh, em)}`,
        `RRULE:FREQ=WEEKLY;BYDAY=${S.plan.days.map((d) => BY[d]).join(",")};UNTIL=${dt(E - 1, 23, 59)}`,
        `SUMMARY:${esc2("PuG Compass: Tagesmission")}`, `DESCRIPTION:${esc2("Öffne PuG Compass und erledige deine Tagesmission.")}`,
        "BEGIN:VALARM", "ACTION:DISPLAY", "DESCRIPTION:PuG Compass – Zeit zum Lernen", "TRIGGER:-PT10M", "END:VALARM", "END:VEVENT"].join("\r\n"));
    }
    probes().filter((p) => p.day >= T && p.state !== "done").forEach((p) => {
      const [eh, em] = endOf(hh, mm, 60);
      ev.push(["BEGIN:VEVENT", `UID:pugc-probe-${p.day}@pugcompass`, `DTSTAMP:${stamp}`, `DTSTART:${dt(p.day, hh, mm)}`, `DTEND:${dt(p.day, eh, em)}`,
        `SUMMARY:${esc2("PuG Compass: " + p.label + " (60 Min.)")}`, "BEGIN:VALARM", "ACTION:DISPLAY", "DESCRIPTION:Probeprüfung", "TRIGGER:-PT30M", "END:VALARM", "END:VEVENT"].join("\r\n"));
    });
    ev.push(["BEGIN:VEVENT", `UID:pugc-exam-${E}@pugcompass`, `DTSTAMP:${stamp}`, `DTSTART;VALUE=DATE:${isoOf(E).replace(/-/g, "")}`, `DTEND;VALUE=DATE:${isoOf(E + 1).replace(/-/g, "")}`,
      `SUMMARY:${esc2("Prüfung Wirtschafts- und Sozialkunde – viel Erfolg!")}`, "BEGIN:VALARM", "ACTION:DISPLAY", "DESCRIPTION:Morgen ist Prüfung", "TRIGGER:-PT12H", "END:VALARM", "END:VEVENT"].join("\r\n"));
    const ics = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//BS1 Bayreuth//PuG Compass//DE", "CALSCALE:GREGORIAN", ...ev, "END:VCALENDAR"].join("\r\n");
    download(ics, "pug-compass-lernplan.ics", "text/calendar");
    toast("Kalenderdatei erstellt");
  };
  function download(content, name, type) {
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([content], { type })); a.download = name;
    document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 3000);
  }
  ACT.export = () => { download(JSON.stringify(S), `pug-compass-lernstand-${isoOf(today())}.json`, "application/json"); toast("Lernstand gespeichert"); };
  ACT.import = () => $("#importFile").click();
  ACT.importFile = (el) => {
    const f = el.files[0]; if (!f) return;
    f.text().then((t) => { const d = JSON.parse(t); if (!d.cards) throw 0; localStorage.setItem(KEY, JSON.stringify(d)); S = load(); go("home"); toast("Lernstand geladen"); })
      .catch(() => toast("Datei konnte nicht gelesen werden"));
  };
  ACT.reset = () => ask("Wirklich den gesamten Lernstand löschen? Profil und Plan bleiben erhalten.", "Löschen", () => { S.cards = {}; S.exams = []; S.log = {}; S.missions = {}; S.plan.start = today(); save(); go("home"); toast("Lernstand zurückgesetzt"); });

  VIEWS.settings = () => {
    const p = S.profile; const t = P.tracks[p.track];
    const o = view.o || (view.o = { days: [...S.plan.days], minutes: S.plan.minutes, time: S.plan.time });
    return `<div class="learn-head">${backBtn("toPlan")}<h2 style="margin:0">Profil & Plan</h2></div>
      <div class="glass card"><h3>Prüfung</h3>
        <label class="field"><span>Kammer</span><select id="sTrack" data-act="sTrack">${Object.entries(P.tracks).map(([k, x]) => `<option value="${k}" ${k === p.track ? "selected" : ""}>${esc(x.label)}</option>`).join("")}</select></label>
        <label class="field"><span>Beruf</span><select id="sJob">${t.jobs.map((j) => `<option ${j === p.job ? "selected" : ""}>${esc(j)}</option>`).join("")}</select></label>
        <label class="field"><span>Prüfungstag</span><input type="date" id="sDate" value="${esc(p.date || "")}"></label>
        <div class="switch"><div><b>Bayern-Fragen</b><div class="tiny">Landtag, Kommunalwahl, Schulabschluss</div></div><input type="checkbox" id="sBy" ${p.bayern ? "checked" : ""}></div>
      </div>
      <div class="glass card"><h3>Lernrhythmus</h3>${rhythmFields(o)}</div>
      <button class="btn btn-primary btn-block" data-act="sSave" ${o.days.length ? "" : "disabled"}>Speichern</button>`;
  };
  ACT.sTrack = (el) => { $("#sJob").innerHTML = P.tracks[el.value].jobs.map((j) => `<option>${esc(j)}</option>`).join(""); };
  ACT.sSave = () => {
    const newDate = $("#sDate").value;
    if (newDate !== S.profile.date) S.plan.start = today();
    S.profile = { track: $("#sTrack").value, job: $("#sJob").value, date: newDate, bayern: $("#sBy").checked };
    S.plan = { ...S.plan, days: view.o.days, minutes: view.o.minutes, time: $("#rTime").value || "17:00" };
    if (S.plan.start == null) S.plan.start = today();
    S.missions = {}; save(); go("home"); toast("Plan aktualisiert");
  };

  /* ───────── Start ───────── */
  document.querySelectorAll("#nav button").forEach((b) => b.addEventListener("click", () => {
    const g = b.dataset.go;
    if (g === "exam") go("exam", { phase: "intro" }); else go(g);
  }));
  // Mitternacht: neue Tagesmission
  document.addEventListener("visibilitychange", () => { if (!document.hidden && S.profile && !S.missions[today()] && view.name === "home") render(); });
  render();
  if ("serviceWorker" in navigator && location.protocol.startsWith("http")) navigator.serviceWorker.register("sw.js").catch(() => {});
})();

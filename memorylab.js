(() => {
  const scenarioQuestions = [
    {
      prompt: "Eine Firma reduziert wegen Auftragsmangel vorübergehend die Arbeitszeit. Welcher Begriff passt?",
      options: ["Kurzarbeitergeld", "Tarifautonomie", "Bundesrat", "Freihandel"],
      correct: 0,
      explanation: "Kurzarbeitergeld sichert Einkommen bei vorübergehendem Arbeitsausfall.",
    },
    {
      prompt: "Beschäftigte legen für bessere Löhne die Arbeit nieder. Welches Konzept ist gemeint?",
      options: ["Streik", "Legislative", "Sozialhilfe", "Subvention"],
      correct: 0,
      explanation: "Ein Streik ist ein Arbeitskampfmittel zur Durchsetzung tariflicher Forderungen.",
    },
    {
      prompt: "Eine Person verliert ihren Job und erhält zeitlich begrenzte Versicherungsleistung. Was passt?",
      options: ["Arbeitslosengeld I", "Pflegeversicherung", "Kirchensteuer", "Urabstimmung"],
      correct: 0,
      explanation: "Arbeitslosengeld I ist eine Leistung der Arbeitslosenversicherung.",
    },
  ];

  const mnemonics = [
    {
      topic: "Wahlrechtsgrundsätze",
      type: "Akrostichon",
      mnemonic: "Alle Unseren Freien Guten Gesetze",
      explanation: "Allgemein, Unmittelbar, Frei, Gleich, Geheim.",
    },
    {
      topic: "5 Sozialversicherungen",
      type: "Akronym",
      mnemonic: "K R A P U",
      explanation: "Krankenversicherung, Rentenversicherung, Arbeitslosenversicherung, Pflegeversicherung, Unfallversicherung.",
    },
    {
      topic: "EU-Grundfreiheiten",
      type: "Logische Gruppierung",
      mnemonic: "WPDK",
      explanation: "Waren, Personen, Dienstleistungen, Kapital. Merke: Alles soll sich im Binnenmarkt frei bewegen können.",
    },
    {
      topic: "Magisches Viereck",
      type: "Visuelle Struktur",
      mnemonic: "Vier Ecken: Preise, Jobs, Wachstum, Außenhandel",
      explanation: "Preisstabilität, hoher Beschäftigungsstand, angemessenes Wirtschaftswachstum, außenwirtschaftliches Gleichgewicht.",
    },
    {
      topic: "Gesetzgebung in Deutschland",
      type: "Logische Kette",
      mnemonic: "Initiative -> Beratung -> Beschluss -> Bundesrat -> Ausfertigung",
      explanation: "Vom Gesetzesvorschlag über Bundestag und Bundesrat bis zur Unterschrift und Verkündung.",
    },
    {
      topic: "Tarifkonflikt Ablauf",
      type: "Akrostichon",
      mnemonic: "F W U S T",
      explanation: "Forderung, Verhandlung, Urabstimmung, Streik, Tarifabschluss.",
    },
  ];

  const imageTasks = [
    {
      image: "✊🏭",
      prompt: "Welche Bezeichnung passt zu diesem Bild?",
      options: ["Streik", "Tarifvertrag", "Arbeitslosigkeit", "Bundestag"],
      correct: 0,
      explanation: "Die Kombination aus Protest und Fabrik steht für einen Arbeitskampf, also Streik.",
    },
    {
      image: "🏛️⚖️",
      prompt: "Wofür steht dieses Symbol am ehesten?",
      options: ["Gewaltenteilung und Verfassungsorgane", "Kurzarbeit", "Pflegeversicherung", "Subvention"],
      correct: 0,
      explanation: "Parlament und Waage stehen für Staat, Recht und verfassungsmäßige Ordnung.",
    },
    {
      image: "💶📉",
      prompt: "Welches Thema wird hier am ehesten dargestellt?",
      options: ["Konjunkturabschwung", "Urabstimmung", "Betriebsrat", "Bundespräsident"],
      correct: 0,
      explanation: "Sinkende Kurve mit Währung deutet auf wirtschaftlichen Abschwung hin.",
    },
    {
      image: "📄✍️⚖️",
      prompt: "Welcher Begriff passt am besten?",
      options: ["Arbeitsvertrag", "Pflegeversicherung", "Bundesrat", "Inflation"],
      correct: 0,
      explanation: "Vertrag, Unterschrift und Rechtssymbol stehen für einen Arbeitsvertrag.",
    },
    {
      image: "🤒🏥💳",
      prompt: "Welches Thema wird dargestellt?",
      options: ["Gesetzliche Krankenversicherung", "Arbeitslosengeld", "Tarifbindung", "Wahlpflicht"],
      correct: 0,
      explanation: "Krankheit, Krankenhaus und Versicherungskarte deuten auf die Krankenversicherung hin.",
    },
    {
      image: "👵💶📅",
      prompt: "Wofür steht diese Emoji-Kombination?",
      options: ["Rentenversicherung", "Mindestlohn", "Koalitionsfreiheit", "Freihandel"],
      correct: 0,
      explanation: "Alter, Geld und Zeit sind ein typischer Hinweis auf die Rente.",
    },
    {
      image: "👷‍♀️🚫💼",
      prompt: "Welcher Begriff ist richtig?",
      options: ["Arbeitslosigkeit", "Betriebsrat", "Steuerprogression", "Bundestagswahl"],
      correct: 0,
      explanation: "Person ohne Arbeitssymbol steht für Arbeitslosigkeit.",
    },
    {
      image: "🤝📜💶",
      prompt: "Was beschreibt diese Kombination?",
      options: ["Tarifvertrag", "Pflegegrad", "Subvention", "Gewaltenteilung"],
      correct: 0,
      explanation: "Einigung, Vertrag und Geld verweisen auf einen Tarifvertrag.",
    },
    {
      image: "🗳️🏛️👥",
      prompt: "Welches politische Thema ist gemeint?",
      options: ["Demokratische Wahl", "Kurzarbeit", "Staatsverschuldung", "Sozialhilfe"],
      correct: 0,
      explanation: "Wahlurne, Parlament und Bevölkerung stehen für Wahlen in der Demokratie.",
    },
    {
      image: "🏭📈💰",
      prompt: "Welcher wirtschaftliche Begriff passt?",
      options: ["Wirtschaftswachstum", "Streikrecht", "Bundesrat", "Pflegekasse"],
      correct: 0,
      explanation: "Produktion, steigende Kurve und Geld deuten auf Wachstum hin.",
    },
    {
      image: "🌍🚢💱",
      prompt: "Welches Thema wird dargestellt?",
      options: ["Globalisierung und Welthandel", "Sozialwahl", "Arbeitsgericht", "Mindesturlaub"],
      correct: 0,
      explanation: "Welt, Handelsschiff und Währungssymbol stehen für internationalen Handel.",
    },
    {
      image: "🧑‍⚖️🏢⚒️",
      prompt: "Worum geht es hier?",
      options: ["Arbeitsgericht", "Rentenanpassung", "Verfassungsänderung", "Konjunkturpolitik"],
      correct: 0,
      explanation: "Richter, Gebäude und Arbeitssymbol verweisen auf arbeitsrechtliche Streitfälle.",
    },
  ];

  const state = {
    app: null,
    root: null,
    activeTool: "image",
    cartoonImages: [],
    currentCartoon: null,
  };

  function init({ app }) {
    state.app = app;
    state.root = document.getElementById("memoryContent");

    const tabs = document.querySelectorAll(".tab-btn");
    tabs.forEach((btn) => {
      btn.addEventListener("click", () => {
        tabs.forEach((x) => x.classList.toggle("active", x === btn));
        state.activeTool = btn.dataset.tool;
        render();
      });
    });

    loadCartoonImages().finally(() => {
      if (state.activeTool === "cartoon") render();
    });

    render();
  }

  function render() {
    if (!state.root) return;

    if (state.activeTool === "scenario") renderMCQ("Szenario Spiel", scenarioQuestions, "scenario");
    if (state.activeTool === "mnemo") renderMnemo();
    if (state.activeTool === "cartoon") renderCartoonAnalysis();
    if (state.activeTool === "image") renderMCQ("Emoji zu Begriff", imageTasks, "image", true);
    if (state.activeTool === "workshop") renderWorkshop();
  }

  function renderMCQ(title, source, key, withVisual = false) {
    const item = source[Math.floor(Math.random() * source.length)];
    const shuffledOptions = shuffle(
      item.options.map((optionText, idx) => ({
        optionText,
        isCorrect: idx === item.correct,
      })),
    );
    const visualBlock = withVisual
      ? (item.imagePath
        ? `<img class="task-image" src="${item.imagePath}" alt="${title}" loading="lazy" />`
        : `<div class="image-emoji">${item.image || item.art || "🧠"}</div>`)
      : "";
    const sourceBlock = item.source
      ? `<p class="source-line">Quelle: ${item.source.author} – ${item.source.website}</p>`
      : "";

    state.root.innerHTML = `
      <h3>${title}</h3>
      ${visualBlock}
      ${sourceBlock}
      <p>${item.prompt}</p>
      <div class="options">
        ${shuffledOptions.map((opt, idx) => `<button class="option-btn" data-idx="${idx}" data-correct="${opt.isCorrect ? "1" : "0"}">${opt.optionText}</button>`).join("")}
      </div>
      <button class="btn btn-muted" id="nextTask">Neue Aufgabe</button>
      <div class="explain" id="explainBox" hidden></div>
    `;

    const explain = state.root.querySelector("#explainBox");
    state.root.querySelectorAll(".option-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = Number(btn.dataset.idx);
        const isCorrect = btn.dataset.correct === "1";
        state.root.querySelectorAll(".option-btn").forEach((b) => {
          b.disabled = true;
          const bIdx = Number(b.dataset.idx);
          const optionIsCorrect = shuffledOptions[bIdx]?.isCorrect;
          if (optionIsCorrect) b.classList.add("correct");
          if (bIdx === idx && !isCorrect) b.classList.add("wrong");
        });

        explain.hidden = false;
        explain.innerHTML = `<strong>${isCorrect ? "Richtig" : "Nicht ganz"}:</strong> ${item.explanation}`;

        if (isCorrect) state.app.addXp(3);
      });
    });

    state.root.querySelector("#nextTask").addEventListener("click", render);
  }

  function renderMnemo() {
    state.root.innerHTML = `
      <h3>Eselsbrücken</h3>
      <div class="mnemo-grid">
        ${mnemonics
          .map(
            (m, idx) => `
          <button class="mnemo-card" data-idx="${idx}" type="button" aria-label="Eselsbrücke umdrehen">
            <span class="mnemo-card-inner">
              <span class="mnemo-face mnemo-front">
                <strong>${m.topic}</strong>
                <p>${m.mnemonic}</p>
              </span>
              <span class="mnemo-face mnemo-back">
                <small>Erklärung</small>
                <p>${formatMnemonicExplanation(m.explanation)}</p>
              </span>
            </span>
          </button>
        `
          )
          .join("")}
      </div>
      <p class="explain">Tipp: Drehe jede Karte erst nach eigenem Abruf um. So bleibt das Wissen länger im Gedächtnis.</p>
    `;

    state.root.querySelectorAll(".mnemo-card").forEach((card) => {
      card.addEventListener("click", () => {
        card.classList.toggle("flipped");
      });
    });
  }

  function renderWorkshop() {
    state.root.innerHTML = `
      <h3>Lernwerkstatt</h3>
      <div class="workshop-categories">
        <span class="workshop-category active">Gesetzgebung</span>
        <span class="workshop-category active">Politisches System in Deutschland</span>
      </div>
      <article class="workshop-card">
        <h4>Gesetzgebung</h4>
        <p>Interaktive Vertiefung: Wie funktioniert der Weg eines Gesetzes?</p>
        <iframe
          src="https://learningapps.org/watch?app=11838531"
          style="border:0;width:100%;height:500px"
          allowfullscreen="true"
          loading="lazy"
          title="Lernwerkstatt Gesetzgebung"
        ></iframe>
      </article>
      <article class="workshop-card">
        <h4>Politisches System in Deutschland</h4>
        <p>Arbeitsblatt zur Wiederholung zentraler Strukturen und Institutionen des politischen Systems.</p>
        <iframe
          src="https://to-teach.ai/worksheets/3ECtKjFTcYaUVhISZCr8/hBgFOEsubMXTtO15Y9QC"
          style="width:100%;height:600px;border:none"
          loading="lazy"
          title="Lernwerkstatt Politisches System in Deutschland"
        ></iframe>
        <a
          class="workshop-fallback-link"
          href="https://to-teach.ai/worksheets/3ECtKjFTcYaUVhISZCr8/hBgFOEsubMXTtO15Y9QC"
          target="_blank"
          rel="noopener noreferrer"
        >Übung im neuen Tab öffnen</a>
      </article>
    `;
  }

  function formatMnemonicExplanation(text) {
    if (!text) return "";
    if (text.includes(",")) {
      return text.split(",").map((part) => part.trim()).join("<br />");
    }
    if (text.includes("->")) {
      return text.split("->").map((part) => part.trim()).join("<br />");
    }
    return text;
  }

  function shuffle(list) {
    const arr = [...list];
    for (let i = arr.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  async function loadCartoonImages() {
    const exts = [".jpg", ".jpeg", ".png", ".webp"];
    const toCartoon = (path) => ({
      imagePath: path,
      question: "Welche politischen Themen oder Ereignisse kritisiert diese Karikatur?",
      answerOptions: [],
      correctAnswer: "",
    });

    try {
      const res = await fetch("Karikaturen/");
      if (res.ok) {
        const html = await res.text();
        const hrefMatches = [...html.matchAll(/href=\"([^\"]+)\"/gi)].map((m) => m[1]);
        const files = hrefMatches
          .filter((href) => exts.some((ext) => href.toLowerCase().endsWith(ext)))
          .map((href) => decodeURIComponent(href))
          .map((href) => href.startsWith("Karikaturen/") ? href : `Karikaturen/${href}`);
        if (files.length) {
          state.cartoonImages = files.map(toCartoon);
          return;
        }
      }
    } catch {
      // Fallback below
    }

    // Fallback: explicit local file list for file:// usage without directory listing.
    if (Array.isArray(window.KARIKATUREN_FILES) && window.KARIKATUREN_FILES.length) {
      state.cartoonImages = window.KARIKATUREN_FILES
        .filter((file) => {
          const value = String(file).toLowerCase();
          return value.startsWith("data:image/") || exts.some((ext) => value.endsWith(ext));
        })
        .map((file) => {
          const value = String(file);
          if (value.startsWith("data:image/")) return value;
          return value.startsWith("Karikaturen/") ? value : `Karikaturen/${value}`;
        })
        .map(toCartoon);
    }
  }

  function renderCartoonAnalysis() {
    const cartoon = pickNextCartoon();
    if (!cartoon) {
      state.root.innerHTML = `
        <h3>Karikaturen Analyse</h3>
        <p>Keine Karikaturen gefunden. Lege bitte Bilder in den Ordner <code>Karikaturen/</code>.</p>
      `;
      return;
    }

    state.root.innerHTML = `
      <h3>Karikaturen Analyse</h3>
      <div class="caricature-container">
        <img class="task-image cartoon-image caricature-image" src="${encodeURI(cartoon.imagePath)}" alt="Karikatur" loading="lazy" />
      </div>
      <p class="source-line">Quelle: Klaus Stuttmann – www.stuttmann-karikaturen.de</p>
      <p class="cartoon-question">${cartoon.question}</p>
      <p class="cartoon-hint">Tipp: Nenne politische Themen, Personen oder gesellschaftliche Probleme, die in der Karikatur kritisiert werden.</p>
      <textarea id="cartoonInput" class="cartoon-input" placeholder="- Punkt 1&#10;- Punkt 2&#10;- Punkt 3"></textarea>
      <div class="cartoon-actions">
        <button id="btnCheckCartoon" class="btn btn-primary">Antwort prüfen</button>
        <button id="btnNextCartoon" class="btn btn-muted">Nächste Karikatur</button>
      </div>
      <div id="cartoonSolution" class="explain" hidden></div>
    `;

    const input = document.getElementById("cartoonInput");
    const solution = document.getElementById("cartoonSolution");
    const checkBtn = document.getElementById("btnCheckCartoon");
    const nextBtn = document.getElementById("btnNextCartoon");

    checkBtn.addEventListener("click", () => {
      const points = buildSuggestedPoints(cartoon.imagePath);
      const userHasInput = input.value.trim().length > 0;
      solution.hidden = false;
      solution.innerHTML = `
        <strong>Vorschlag zur Analyse:</strong>
        <ul class="analysis-list">${points.map((p) => `<li>${p}</li>`).join("")}</ul>
        ${!userHasInput ? "<div class=\"analysis-note\">Schreibe zuerst eigene Stichpunkte und vergleiche danach.</div>" : ""}
      `;
      state.app.addXp(2);
    });

    nextBtn.addEventListener("click", () => {
      state.currentCartoon = null;
      renderCartoonAnalysis();
    });
  }

  function pickNextCartoon() {
    if (!state.cartoonImages.length) return null;
    if (state.cartoonImages.length === 1) {
      state.currentCartoon = state.cartoonImages[0];
      return state.currentCartoon;
    }

    const currentPath = state.currentCartoon?.imagePath;
    const pool = state.cartoonImages.filter((item) => item.imagePath !== currentPath);
    state.currentCartoon = pool[Math.floor(Math.random() * pool.length)];
    return state.currentCartoon;
  }

  function buildSuggestedPoints(imagePath) {
    const name = decodeURIComponent(imagePath.split("/").pop() || "")
      .replace(/\.[^.]+$/, "")
      .toLowerCase();

    const points = [
      "Kritik an politischen Entscheidungen und deren Wirkung auf den Alltag der Bürgerinnen und Bürger.",
      "Spannung zwischen politischen Versprechen und der tatsächlichen Umsetzung.",
      "Darstellung eines gesellschaftlichen Problems, das durch staatliches Handeln beeinflusst wird.",
    ];

    const keywordMap = [
      { key: "urlaub", point: "Kritik an Arbeitsbedingungen, Zeitdruck oder fehlender Vereinbarkeit von Beruf und Privatleben." },
      { key: "china", point: "Kritik an Globalisierung, Lieferkettenabhängigkeit und wirtschaftspolitischen Entscheidungen." },
      { key: "suechtig", point: "Kritik an gesellschaftlicher Abhängigkeit, Konsumverhalten oder politischer Regulierung." },
      { key: "dokument", point: "Kritik an Bürokratie, Verwaltungsprozessen oder politischer Entscheidungshemmung." },
      { key: "einsatz", point: "Kritik an staatlicher Prioritätensetzung und öffentlichen Ressourcen." },
      { key: "schwierig", point: "Hinweis auf komplexe politische Konflikte ohne einfache Lösungen." },
    ];

    keywordMap.forEach((entry) => {
      if (name.includes(entry.key)) points.push(entry.point);
    });

    return points.slice(0, 5);
  }

  window.MemoryLab = { init };
})();

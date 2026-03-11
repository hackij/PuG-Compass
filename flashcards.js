(() => {
  const state = {
    app: null,
    filter: "all",
    currentCard: null,
    isFlipped: false,
    els: {},
  };

  function init({ app }) {
    state.app = app;
    state.els = {
      filter: document.getElementById("categoryFilter"),
      card: document.getElementById("flashcard"),
      cardInner: document.querySelector("#flashcard .flashcard-inner"),
      meta: document.getElementById("cardMeta"),
      question: document.getElementById("cardQuestion"),
      answer: document.getElementById("cardAnswer"),
      info: document.getElementById("stackInfo"),
      btnKnow: document.getElementById("btnKnow"),
      btnLearn: document.getElementById("btnLearn"),
      wikiSection: document.getElementById("wikiResearch"),
      wikiFrame: document.getElementById("wikiFrame"),
    };

    wireEvents();
    renderFilter();
    loadCurrentCard();
  }

  function wireEvents() {
    state.els.card.addEventListener("click", (e) => {
      if (e.target.closest("button")) return;
      state.isFlipped = !state.isFlipped;
      state.els.card.classList.toggle("flipped", state.isFlipped);
    });

    state.els.card.addEventListener("keydown", (e) => {
      if (e.key !== "Enter" && e.key !== " ") return;
      e.preventDefault();
      state.isFlipped = !state.isFlipped;
      state.els.card.classList.toggle("flipped", state.isFlipped);
    });

    state.els.filter.addEventListener("change", () => {
      state.filter = state.els.filter.value;
      showFrontSide();
      loadCurrentCard();
    });

    state.els.btnKnow.addEventListener("click", (e) => {
      e.stopPropagation();
      if (!state.currentCard) return;
      showFrontSide();
      state.app.markCardKnown(state.currentCard.id);
      loadCurrentCard();
    });

    state.els.btnLearn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (!state.currentCard) return;
      showFrontSide();
      state.app.deferCard(state.filter, state.currentCard.id);
      loadCurrentCard();
    });

    document.addEventListener("pug:progress", () => {
      showFrontSide();
      renderFilter();
      loadCurrentCard();
    });
  }

  function renderFilter() {
    const options = [{ id: "all", title: "Alle Kategorien" }, ...state.app.getCategoryList()];
    state.els.filter.innerHTML = options
      .map((opt) => `<option value="${opt.id}">${opt.title}</option>`)
      .join("");
    state.els.filter.value = state.filter;
  }

  function loadCurrentCard() {
    showFrontSide();
    state.currentCard = state.app.peekCard(state.filter);

    if (!state.currentCard) {
      state.els.meta.textContent = "Stapel geschafft";
      state.els.question.textContent = "Sehr gut. Du hast in diesem Stapel alles gelernt.";
      state.els.answer.textContent = "Wechsle die Kategorie oder wiederhole später offene Themen.";
      state.els.info.textContent = "0 Karten im Stapel";
      state.els.btnKnow.disabled = true;
      state.els.btnLearn.disabled = true;
      renderWikiResearch(null);
      triggerCardEnterAnimation();
      return;
    }

    state.els.btnKnow.disabled = false;
    state.els.btnLearn.disabled = false;
    state.els.meta.textContent = `${state.currentCard.categoryTitle} · ${state.currentCard.points} Punkte`;
    state.els.question.textContent = state.currentCard.question;
    state.els.answer.textContent = state.currentCard.answer;
    state.els.info.textContent = `${state.app.getQueueSize(state.filter)} Karten im Stapel`;
    renderWikiResearch(state.currentCard);
    triggerCardEnterAnimation();
  }

  function setFilter(categoryId) {
    state.filter = categoryId || "all";
    if (state.els.filter) {
      state.els.filter.value = state.filter;
    }
    showFrontSide();
    loadCurrentCard();
  }

  window.Flashcards = { init, setFilter };

  function triggerCardEnterAnimation() {
    if (!state.els.card) return;
    state.els.card.classList.remove("card-enter");
    // Force reflow so the animation can replay on each new card.
    void state.els.card.offsetWidth;
    state.els.card.classList.add("card-enter");
  }

  function showFrontSide() {
    state.isFlipped = false;
    if (state.els.card) {
      state.els.card.classList.remove("flipped");
    }
  }

  function renderWikiResearch(card) {
    if (!state.els.wikiSection || !state.els.wikiFrame) return;
    const wikiUrl = resolveWikiUrl(card);
    if (!wikiUrl) {
      state.els.wikiFrame.removeAttribute("src");
      state.els.wikiSection.hidden = true;
      return;
    }

    state.els.wikiFrame.src = wikiUrl;
    state.els.wikiSection.hidden = false;
  }

  function resolveWikiUrl(card) {
    if (!card) return "";
    if (typeof card.wiki === "string" && card.wiki.trim()) return "https://de.wikipedia.org/";

    const text = `${card.question || ""} ${card.answer || ""}`;
    const urlMatch = text.match(/https?:\/\/de\.wikipedia\.org\/wiki\/[^\s)]+/i);
    if (urlMatch) return "https://de.wikipedia.org/";

    const refMatch = text.match(/Wikipedia\s+([A-Za-zÄÖÜäöüß0-9 _-]{2,80})/i);
    if (!refMatch) return "";
    return "https://de.wikipedia.org/";
  }
})();

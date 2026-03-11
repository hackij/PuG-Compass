(() => {
  const state = {
    root: null,
    details: null,
    getCategories: null,
    getCardsByCategory: null,
    onOpenCategory: null,
    activeCategoryId: null,
    didInitialRender: false,
    resizeObserver: null,
  };
  const palette = ["#e63946", "#ffcc33", "#a4323c", "#c7a134", "#7c2028", "#d8b24a", "#992a35"];
  const descriptions = {
    A: "Dieses Themenfeld behandelt die Grundlagen der beruflichen Ausbildung in Deutschland, wichtige Bildungswege nach der Ausbildung und zentrale Entwicklungsmöglichkeiten im Berufsleben.",
    B: "Hier geht es um die rechtlichen Regeln im Arbeitsverhältnis, typische Inhalte von Verträgen sowie die Rechte und Pflichten von Arbeitnehmern, Auszubildenden und Arbeitgebern.",
    C: "Diese Kategorie erklärt den Aufbau der sozialen Sicherung in Deutschland und zeigt, wie Kranken-, Renten-, Arbeitslosen-, Pflege- und Unfallversicherung zusammenwirken.",
    D: "Im Mittelpunkt stehen Arbeitsmarkt und Tarifrecht, einschließlich Ursachen von Arbeitslosigkeit, Rolle von Gewerkschaften und Arbeitgeberverbänden sowie Formen des Arbeitskampfs.",
    E: "Dieses Thema vermittelt die politischen Grundstrukturen Deutschlands mit Wahlen, Verfassungsorganen, Parteien und Möglichkeiten, demokratisch Einfluss zu nehmen.",
    F: "Hier werden wirtschaftliche Zusammenhänge wie Konjunktur, Geld- und Fiskalpolitik sowie ordnungspolitische Ziele und Zielkonflikte in einer modernen Volkswirtschaft erklärt.",
  };

  function init({ rootId, detailsId, getCategories, getCardsByCategory, onOpenCategory }) {
    state.root = document.getElementById(rootId);
    state.details = document.getElementById(detailsId);
    state.getCategories = getCategories;
    state.getCardsByCategory = getCardsByCategory;
    state.onOpenCategory = onOpenCategory;

    window.addEventListener("resize", render);
    if ("ResizeObserver" in window && state.root) {
      state.resizeObserver = new ResizeObserver(() => {
        render();
      });
      state.resizeObserver.observe(state.root);
    }
    render();
  }

  function render() {
    if (!state.root || !state.getCategories) return;

    const categories = state.getCategories();
    const width = state.root.clientWidth || 0;
    const height = state.root.clientHeight || 0;
    const hidden = state.root.offsetParent === null;
    if (hidden) return;
    if (width < 240 || height < 240) {
      requestAnimationFrame(render);
      return;
    }
    const cx = width / 2;
    const cy = height / 2;
    const nodeWidth = width < 430 ? 158 : 208;
    const nodeHeight = width < 430 ? 96 : 114;
    const descWidth = width < 430 ? 210 : 268;
    const descHeight = width < 430 ? 112 : 122;
    const baseCategoryRadius = 340;
    const baseDescriptionRadius = 520;
    const maxDescRadius = Math.max(
      180,
      Math.min(width, height) / 2 - (Math.max(descWidth, descHeight) / 2) - 12,
    );
    const ringScale = Math.min(1, maxDescRadius / baseDescriptionRadius);
    const categoryRadius = Math.max(width < 430 ? 142 : 220, baseCategoryRadius * ringScale);
    const descriptionRadius = Math.max(categoryRadius + 78, baseDescriptionRadius * ringScale);

    const animateStaticIntro = !state.didInitialRender;

    state.root.innerHTML = "";

    const center = document.createElement("div");
    center.className = "mindmap-center";
    center.textContent = "Themenübersicht";
    state.root.appendChild(center);

    const catRing = document.createElement("div");
    catRing.className = "mind-ring mind-ring-categories";
    catRing.style.width = `${categoryRadius * 2}px`;
    catRing.style.height = `${categoryRadius * 2}px`;
    catRing.style.left = `${cx - categoryRadius}px`;
    catRing.style.top = `${cy - categoryRadius}px`;
    state.root.appendChild(catRing);

    const descRing = document.createElement("div");
    descRing.className = "mind-ring mind-ring-descriptions";
    descRing.style.width = `${descriptionRadius * 2}px`;
    descRing.style.height = `${descriptionRadius * 2}px`;
    descRing.style.left = `${cx - descriptionRadius}px`;
    descRing.style.top = `${cy - descriptionRadius}px`;
    state.root.appendChild(descRing);

    categories.forEach((cat, index) => {
      const color = palette[index % palette.length];
      const angle = (Math.PI * 2 * index) / categories.length - Math.PI / 2;
      // Alternate tiny radial offset to add visual spacing between neighboring labels.
      const radialOffset = (index % 2 === 0 ? 1 : -1) * Math.min(16, categoryRadius * 0.05);
      const catR = categoryRadius + radialOffset;
      const x = cx + Math.cos(angle) * catR;
      const y = cy + Math.sin(angle) * catR;

      const node = document.createElement("button");
      node.type = "button";
      node.className = "mind-node";
      if (state.activeCategoryId === cat.id) node.classList.add("active");
      node.style.width = `${nodeWidth}px`;
      node.style.left = `${x - nodeWidth / 2}px`;
      node.style.top = `${y - nodeHeight / 2}px`;
      node.style.setProperty("--cat-color", color);
      if (animateStaticIntro) {
        node.style.animationDelay = `${index * 90}ms`;
      } else {
        node.style.animation = "none";
      }

      const percent = Math.round((cat.learned / Math.max(1, cat.total)) * 100);
      const ringRadius = 14;
      const ringCirc = 2 * Math.PI * ringRadius;
      const ringOffset = ringCirc * (1 - percent / 100);
      node.innerHTML = `
        <div class="node-head">
          <h4>${cat.title}</h4>
          <div class="node-progress" aria-label="${percent}% gelernt">
            <svg viewBox="0 0 36 36" class="progress-ring">
              <circle class="progress-ring-track" cx="18" cy="18" r="${ringRadius}"></circle>
              <circle class="progress-ring-value" cx="18" cy="18" r="${ringRadius}" style="stroke-dasharray:${ringCirc};stroke-dashoffset:${ringOffset};"></circle>
            </svg>
            <span>${percent}%</span>
          </div>
        </div>
        <small>${cat.learned} / ${cat.total} gelernt · ${percent}%</small>
        <div class="mini-track"><div class="mini-fill"></div></div>
      `;

      node.addEventListener("click", () => handleCategoryClick(cat.id));
      state.root.appendChild(node);

      const fill = node.querySelector(".mini-fill");
      if (fill) {
        fill.style.width = "0%";
        requestAnimationFrame(() => {
          fill.style.width = `${percent}%`;
        });
      }
    });

    if (state.activeCategoryId) {
      renderDetails(state.activeCategoryId, categories, {
        cx,
        cy,
        width,
        height,
        categoryRadius,
        descriptionRadius,
        nodeWidth,
        descWidth,
        descHeight,
      });
    }

    state.didInitialRender = true;
  }

  function handleCategoryClick(categoryId) {
    if (state.activeCategoryId === categoryId) {
      if (typeof state.onOpenCategory === "function") {
        state.onOpenCategory(categoryId);
      }
      return;
    }

    state.activeCategoryId = categoryId;
    render();
  }

  function renderDetails(categoryId, categories, layout) {
    if (!state.details || !state.getCardsByCategory) return;
    const active = categories.find((c) => c.id === categoryId);
    if (!active) return;

    const {
      cx,
      cy,
      width,
      height,
      categoryRadius,
      nodeWidth,
      descWidth,
      descHeight,
    } = layout;
    const index = categories.findIndex((c) => c.id === categoryId);
    const angle = (Math.PI * 2 * index) / categories.length - Math.PI / 2;
    const nx = cx + Math.cos(angle) * categoryRadius;
    const ny = cy + Math.sin(angle) * categoryRadius;

    const branch = document.createElement("article");
    branch.className = "mind-desc-node";
    const initialLeft = nx - (descWidth / 2);
    const initialTop = ny - descHeight - 26;

    const rootRect = state.root.getBoundingClientRect();
    const viewportPadding = 10;
    const pageLeft = clamp(
      rootRect.left + initialLeft,
      viewportPadding,
      window.innerWidth - descWidth - viewportPadding,
    );
    const pageTop = clamp(
      rootRect.top + initialTop,
      viewportPadding,
      window.innerHeight - descHeight - viewportPadding,
    );
    const targetLeft = pageLeft - rootRect.left;
    const targetTop = pageTop - rootRect.top;

    const popupCenterX = targetLeft + (descWidth / 2);
    const popupBottomY = targetTop + descHeight;
    const dx = popupCenterX - nx;
    const dy = popupBottomY - ny;
    const branchDistance = Math.max(18, Math.hypot(dx, dy) - 8);
    const branchAngle = Math.atan2(dy, dx);

    const branchLine = document.createElement("div");
    branchLine.className = "mind-desc-line";
    branchLine.style.width = `${branchDistance}px`;
    branchLine.style.left = `${nx}px`;
    branchLine.style.top = `${ny}px`;
    branchLine.style.transform = `rotate(${branchAngle}rad)`;
    branchLine.style.background = palette[index % palette.length];
    state.root.appendChild(branchLine);

    branch.style.width = `${descWidth}px`;
    branch.style.left = `${targetLeft}px`;
    branch.style.top = `${targetTop}px`;
    branch.innerHTML = `
      <button type="button" class="mind-desc-close" aria-label="Beschreibung schließen">×</button>
      <h5>${active.title}</h5>
      <p>${descriptions[categoryId] || "Dieses Thema vertieft zentrale Inhalte für die PuG-Prüfung und unterstützt dich beim gezielten Wiederholen."}</p>
      <button type="button" class="mind-desc-link">Zu den Karteikarten der Kategorie</button>
    `;
    state.root.appendChild(branch);

    const closeBtn = branch.querySelector(".mind-desc-close");
    if (closeBtn) {
      closeBtn.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        closeDescription();
      });
    }

    const cardsLink = branch.querySelector(".mind-desc-link");
    if (cardsLink) {
      cardsLink.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (typeof state.onOpenCategory === "function") {
          state.onOpenCategory(active.id);
        }
      });
    }

    state.details.innerHTML = `<div class="detail-chip"><strong>${active.title}</strong><br>${active.learned} / ${active.total} gelernt</div>`;
  }

  function closeDescription() {
    state.activeCategoryId = null;
    if (state.details) {
      state.details.innerHTML = "";
    }
    render();
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  window.Mindmap = { init, render };
})();

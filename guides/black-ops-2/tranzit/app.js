(() => {
  const STORAGE_KEY = "tranzit-tower-of-babble-progress-v1";

  const state = {
    path: "maxis",
    checks: {},
  };

  const progressText = document.getElementById("progressText");
  const stickyStep = document.getElementById("stickyStep");
  const locationSearch = document.getElementById("locationSearch");
  const refGrid = document.getElementById("refGrid");
  const noResults = document.getElementById("noResults");

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        state.path = parsed.path === "richtofen" ? "richtofen" : "maxis";
        state.checks = parsed.checks && typeof parsed.checks === "object" ? parsed.checks : {};
      }
    } catch {
      /* ignore corrupt storage */
    }
  }

  function save() {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ path: state.path, checks: state.checks })
    );
  }

  function stepKey(stepEl) {
    return stepEl.dataset.stepId;
  }

  function relevantSteps() {
    const shared = [...document.querySelectorAll('.step-list[data-path="shared"] .step')];
    const pathPanel = document.getElementById(`panel-${state.path}`);
    const pathSteps = pathPanel ? [...pathPanel.querySelectorAll(".step")] : [];
    return [...shared, ...pathSteps];
  }

  function applyChecks() {
    document.querySelectorAll(".step").forEach((step) => {
      const key = stepKey(step);
      const checked = Boolean(state.checks[key]);
      const box = step.querySelector(":scope > summary .step-check");
      if (box) box.checked = checked;
      step.dataset.done = checked ? "true" : "false";
    });

    document.querySelectorAll("[data-check-id]").forEach((box) => {
      const id = box.getAttribute("data-check-id");
      box.checked = Boolean(state.checks[`sub:${id}`]);
    });
  }

  function updateProgress() {
    const steps = relevantSteps();
    const done = steps.filter((s) => state.checks[stepKey(s)]).length;
    progressText.textContent = `${done} / ${steps.length}`;

    const next = steps.find((s) => !state.checks[stepKey(s)]);
    if (!next) {
      stickyStep.textContent = "All steps checked — nice work";
      stickyStep.dataset.target = "";
      return;
    }
    const title = next.querySelector(".step-title");
    stickyStep.textContent = title ? title.textContent.trim() : "Continue";
    stickyStep.dataset.target = stepKey(next);
  }

  function openStep(step) {
    if (!step) return;
    step.open = true;
    step.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function setPath(path) {
    state.path = path === "richtofen" ? "richtofen" : "maxis";
    const maxisPanel = document.getElementById("panel-maxis");
    const richtofenPanel = document.getElementById("panel-richtofen");
    const tabMaxis = document.getElementById("tab-maxis");
    const tabRichtofen = document.getElementById("tab-richtofen");

    const isMaxis = state.path === "maxis";
    maxisPanel.hidden = !isMaxis;
    richtofenPanel.hidden = isMaxis;

    tabMaxis.setAttribute("aria-selected", String(isMaxis));
    tabMaxis.setAttribute("aria-pressed", String(isMaxis));
    tabRichtofen.setAttribute("aria-selected", String(!isMaxis));
    tabRichtofen.setAttribute("aria-pressed", String(!isMaxis));

    save();
    updateProgress();
  }

  function jumpToPath(path) {
    setPath(path);
    document.getElementById("paths").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function bindSteps() {
    document.querySelectorAll(".step").forEach((step) => {
      const box = step.querySelector(":scope > summary .step-check");
      if (!box) return;

      box.addEventListener("click", (event) => {
        event.stopPropagation();
      });

      box.addEventListener("change", () => {
        const key = stepKey(step);
        state.checks[key] = box.checked;
        step.dataset.done = box.checked ? "true" : "false";
        save();
        updateProgress();
      });
    });

    document.querySelectorAll("[data-check-id]").forEach((box) => {
      box.addEventListener("change", () => {
        const id = box.getAttribute("data-check-id");
        state.checks[`sub:${id}`] = box.checked;
        save();
      });
    });
  }

  function bindPathTabs() {
    document.querySelectorAll("[data-path-tab]").forEach((btn) => {
      btn.addEventListener("click", () => setPath(btn.dataset.pathTab));
    });
    document.querySelectorAll("[data-jump-path]").forEach((btn) => {
      btn.addEventListener("click", () => jumpToPath(btn.dataset.jumpPath));
    });
  }

  function bindSticky() {
    document.getElementById("stickyNext").addEventListener("click", () => {
      const steps = relevantSteps();
      const next = steps.find((s) => !state.checks[stepKey(s)]);
      if (!next) return;
      if (next.closest("#panel-richtofen")) setPath("richtofen");
      if (next.closest("#panel-maxis")) setPath("maxis");
      openStep(next);
    });

    document.getElementById("stickyPrev").addEventListener("click", () => {
      const steps = relevantSteps();
      const completed = steps.filter((s) => state.checks[stepKey(s)]);
      const prev = completed.length ? completed[completed.length - 1] : steps[0];
      if (!prev) return;
      if (prev.closest("#panel-richtofen")) setPath("richtofen");
      if (prev.closest("#panel-maxis")) setPath("maxis");
      openStep(prev);
    });
  }

  function bindReset() {
    document.getElementById("resetProgress").addEventListener("click", () => {
      const ok = window.confirm("Clear all checklist progress for this guide?");
      if (!ok) return;
      state.checks = {};
      save();
      applyChecks();
      updateProgress();
    });
  }

  function bindNavHighlight() {
    const links = [...document.querySelectorAll(".section-nav a")];
    const sections = links
      .map((link) => document.querySelector(link.getAttribute("href")))
      .filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const id = `#${visible.target.id}`;
        links.forEach((link) => {
          link.classList.toggle("active", link.getAttribute("href") === id);
        });
      },
      { rootMargin: "-20% 0px -65% 0px", threshold: [0.1, 0.25, 0.5] }
    );

    sections.forEach((section) => observer.observe(section));
  }

  function bindSearch() {
    let activeFilter = "all";

    function render() {
      const q = (locationSearch.value || "").trim().toLowerCase();
      let shown = 0;
      refGrid.querySelectorAll(".ref-card").forEach((card) => {
        const category = card.dataset.category || "";
        const tags = (card.dataset.tags || "").toLowerCase();
        const text = card.textContent.toLowerCase();
        const matchesFilter =
          activeFilter === "all" ||
          category === activeFilter ||
          tags.includes(activeFilter);
        const matchesQuery = !q || tags.includes(q) || text.includes(q);
        const visible = matchesFilter && matchesQuery;
        card.classList.toggle("hidden", !visible);
        if (visible) shown += 1;
      });
      noResults.hidden = shown !== 0;
    }

    locationSearch.addEventListener("input", render);
    document.querySelectorAll(".filter-chips .chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        activeFilter = chip.dataset.filter || "all";
        document.querySelectorAll(".filter-chips .chip").forEach((c) => {
          c.setAttribute("aria-pressed", String(c === chip));
        });
        render();
      });
    });
  }

  load();
  bindSteps();
  bindPathTabs();
  bindSticky();
  bindReset();
  bindNavHighlight();
  bindSearch();
  applyChecks();
  setPath(state.path);
})();

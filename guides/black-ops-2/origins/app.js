(() => {
  const STORAGE_KEY = "origins-little-lost-girl-progress-v1";

  const ELEMENTS = ["fire", "ice", "lightning", "wind"];

  const VIEWS = ["diagram", "photo"];

  const state = {
    role: null,
    checks: {},
    // default view for every figure that has both a diagram and a screenshot
    view: "diagram",
    // per-figure overrides, keyed by data-media-id
    viewOverrides: {},
  };

  const progressText = document.getElementById("progressText");
  const resetButton = document.getElementById("resetProgress");
  const roleButtons = [...document.querySelectorAll(".role")];
  const tabs = [...document.querySelectorAll(".tab")];
  const checkboxes = [...document.querySelectorAll("[data-check]")];
  const mediaBlocks = [...document.querySelectorAll(".media")];
  const globalViewButtons = [...document.querySelectorAll("#viewSwitch button")];

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        state.role = ELEMENTS.includes(parsed.role) ? parsed.role : null;
        state.checks =
          parsed.checks && typeof parsed.checks === "object" ? parsed.checks : {};
        state.view = VIEWS.includes(parsed.view) ? parsed.view : "diagram";
        state.viewOverrides =
          parsed.viewOverrides && typeof parsed.viewOverrides === "object"
            ? parsed.viewOverrides
            : {};
      }
    } catch {
      /* ignore corrupt or unavailable storage */
    }
  }

  function save() {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          role: state.role,
          checks: state.checks,
          view: state.view,
          viewOverrides: state.viewOverrides,
        })
      );
    } catch {
      /* storage can be blocked; the page still works without it */
    }
  }

  /* ---------- progress ---------- */

  function updateProgress() {
    const done = checkboxes.filter((box) => box.checked).length;
    progressText.textContent = `${done} / ${checkboxes.length}`;
  }

  function applyChecks() {
    checkboxes.forEach((box) => {
      box.checked = Boolean(state.checks[box.dataset.check]);
      const step = box.closest(".egg-step");
      if (step) step.classList.toggle("is-done", box.checked);
    });
    updateProgress();
  }

  checkboxes.forEach((box) => {
    box.addEventListener("change", () => {
      if (box.checked) {
        state.checks[box.dataset.check] = true;
      } else {
        delete state.checks[box.dataset.check];
      }
      const step = box.closest(".egg-step");
      if (step) step.classList.toggle("is-done", box.checked);
      updateProgress();
      save();
    });
  });

  resetButton.addEventListener("click", () => {
    state.checks = {};
    applyChecks();
    save();
  });

  /* ---------- staff tabs ---------- */

  function showStaff(element) {
    tabs.forEach((tab) => {
      const selected = tab.dataset.el === element;
      tab.setAttribute("aria-selected", String(selected));
      const panel = document.getElementById(tab.getAttribute("aria-controls"));
      if (panel) panel.hidden = !selected;
    });
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => showStaff(tab.dataset.el));
    tab.addEventListener("keydown", (event) => {
      const index = tabs.indexOf(tab);
      let next = null;
      if (event.key === "ArrowRight") next = tabs[(index + 1) % tabs.length];
      if (event.key === "ArrowLeft") next = tabs[(index - 1 + tabs.length) % tabs.length];
      if (!next) return;
      event.preventDefault();
      next.focus();
      showStaff(next.dataset.el);
    });
  });

  /* ---------- role picker ---------- */

  function applyRole() {
    if (state.role) {
      document.body.dataset.role = state.role;
    } else {
      delete document.body.dataset.role;
    }
    roleButtons.forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.el === state.role));
    });
  }

  roleButtons.forEach((button) => {
    button.addEventListener("click", () => {
      state.role = state.role === button.dataset.el ? null : button.dataset.el;
      applyRole();
      if (state.role) showStaff(state.role);
      save();
    });
  });

  /* ---------- diagram / photo switching ---------- */

  function viewFor(media) {
    return state.viewOverrides[media.dataset.mediaId] || state.view;
  }

  function applyViews() {
    mediaBlocks.forEach((media) => {
      const view = viewFor(media);
      media.dataset.view = view;
      media.querySelectorAll(".media-bar .switch button").forEach((button) => {
        button.setAttribute("aria-pressed", String(button.dataset.view === view));
      });
    });
    globalViewButtons.forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.viewall === state.view));
    });
  }

  // one figure at a time
  mediaBlocks.forEach((media) => {
    media.querySelectorAll(".media-bar .switch button").forEach((button) => {
      button.addEventListener("click", () => {
        const view = button.dataset.view;
        if (view === state.view) {
          delete state.viewOverrides[media.dataset.mediaId];
        } else {
          state.viewOverrides[media.dataset.mediaId] = view;
        }
        applyViews();
        save();
      });
    });
  });

  // every figure at once — also clears any per-figure overrides
  globalViewButtons.forEach((button) => {
    button.addEventListener("click", () => {
      state.view = button.dataset.viewall;
      state.viewOverrides = {};
      applyViews();
      save();
    });
  });

  /* ---------- section nav highlighting ---------- */

  const navLinks = [...document.querySelectorAll(".section-nav a")];
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          navLinks.forEach((link) => {
            link.classList.toggle(
              "active",
              link.getAttribute("href") === `#${entry.target.id}`
            );
          });
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((section) => spy.observe(section));
  }

  /* ---------- boot ---------- */

  load();
  applyViews();
  applyRole();
  applyChecks();
  showStaff(state.role || "fire");
})();

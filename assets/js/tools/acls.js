(() => {
  const root = document.querySelector("[data-acls-tool]");

  if (!root) {
    return;
  }

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const mobileMenu = window.matchMedia("(max-width: 63.99rem)");
  const sectionToggles = Array.from(root.querySelectorAll(".section-toggle"));
  const tabLists = Array.from(root.querySelectorAll('[role="tablist"]'));
  const navLinks = Array.from(root.querySelectorAll(".acls-nav-link"));
  const sections = Array.from(root.querySelectorAll(".section"));

  const setSectionExpanded = (toggle, expanded) => {
    const contentId = toggle.getAttribute("aria-controls");
    const content = contentId ? document.getElementById(contentId) : null;

    if (!content || !root.contains(content)) {
      return;
    }

    toggle.setAttribute("aria-expanded", String(expanded));
    content.hidden = !expanded;
  };

  sectionToggles.forEach((toggle, index) => {
    setSectionExpanded(toggle, index === 0);
    toggle.addEventListener("click", () => {
      const expanded = toggle.getAttribute("aria-expanded") === "true";
      setSectionExpanded(toggle, !expanded);
      const section = toggle.closest(".section");
      if (section) {
        setCurrentNav(section.id);
      }
    });
  });

  const tabsForList = (tabList) => Array.from(tabList.querySelectorAll(':scope > [role="tab"]'));

  const activateTab = (tab, focus = false) => {
    const tabList = tab.closest('[role="tablist"]');

    if (!tabList) {
      return;
    }

    tabsForList(tabList).forEach((candidate) => {
      const selected = candidate === tab;
      const panelId = candidate.dataset.tab;
      const panel = panelId ? document.getElementById(panelId) : null;

      candidate.setAttribute("aria-selected", String(selected));
      candidate.tabIndex = selected ? 0 : -1;

      if (panel && root.contains(panel)) {
        panel.hidden = !selected;
      }
    });

    if (focus) {
      tab.focus();
    }
  };

  tabLists.forEach((tabList) => {
    const tabs = tabsForList(tabList);
    const selected = tabs.find((tab) => tab.getAttribute("aria-selected") === "true") || tabs[0];

    if (selected) {
      activateTab(selected);
    }

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        activateTab(tab);
        const panelId = tab.getAttribute("aria-controls");
        if (panelId) {
          setCurrentNav(panelId);
        }
      });
      tab.addEventListener("keydown", (event) => {
        const currentIndex = tabs.indexOf(tab);
        let nextIndex = currentIndex;

        if (event.key === "ArrowRight") {
          nextIndex = (currentIndex + 1) % tabs.length;
        } else if (event.key === "ArrowLeft") {
          nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
        } else if (event.key === "Home") {
          nextIndex = 0;
        } else if (event.key === "End") {
          nextIndex = tabs.length - 1;
        } else {
          return;
        }

        event.preventDefault();
        const nextTab = tabs[nextIndex];
        activateTab(nextTab, true);
        const panelId = nextTab.getAttribute("aria-controls");
        if (panelId) {
          setCurrentNav(panelId);
        }
      });
    });
  });

  function setCurrentNav(targetId) {
    navLinks.forEach((link) => {
      const current = link.getAttribute("href") === `#${targetId}`;
      if (current) {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  const searchForm = root.querySelector("[data-search-form]");
  const searchInput = root.querySelector("#acls-search-input");
  const searchClear = root.querySelector("[data-search-clear]");
  const searchStatus = root.querySelector("#acls-search-status");
  const noResults = root.querySelector("[data-no-results]");
  let searchSnapshot = null;

  const selectedTabForList = (tabList) => tabsForList(tabList).find((tab) => tab.getAttribute("aria-selected") === "true");

  const captureSearchSnapshot = () => ({
    sections: sectionToggles.map((toggle) => [toggle, toggle.getAttribute("aria-expanded") === "true"]),
    tabs: tabLists.map((tabList) => [tabList, selectedTabForList(tabList)?.id || ""])
  });

  const restoreSearchSnapshot = () => {
    if (!searchSnapshot) {
      return;
    }

    searchSnapshot.sections.forEach(([toggle, expanded]) => setSectionExpanded(toggle, expanded));
    searchSnapshot.tabs.forEach(([tabList, tabId]) => {
      const tab = tabId ? document.getElementById(tabId) : null;
      if (tab && tabList.contains(tab)) {
        activateTab(tab);
      }
    });
    searchSnapshot = null;
  };

  const runSearch = (announce = true) => {
    if (!searchInput || !searchClear || !searchStatus || !noResults) {
      return;
    }

    const query = searchInput.value.trim().toLocaleLowerCase();

    if (!query) {
      sections.forEach((section) => {
        section.hidden = false;
      });
      restoreSearchSnapshot();
      searchClear.hidden = true;
      noResults.hidden = true;
      searchStatus.textContent = announce ? `All ${sections.length} study sections are shown.` : "";
      return;
    }

    if (!searchSnapshot) {
      searchSnapshot = captureSearchSnapshot();
    }

    let matches = 0;

    sections.forEach((section) => {
      const matching = section.textContent.toLocaleLowerCase().includes(query);
      section.hidden = !matching;

      if (!matching) {
        return;
      }

      matches += 1;
      const toggle = section.querySelector(".section-toggle");
      if (toggle) {
        setSectionExpanded(toggle, true);
      }

      const panels = Array.from(section.querySelectorAll('.algorithm-content[role="tabpanel"]'));
      const matchingPanel = panels.find((panel) => panel.textContent.toLocaleLowerCase().includes(query));
      if (matchingPanel) {
        const tab = section.querySelector(`[role="tab"][aria-controls="${matchingPanel.id}"]`);
        if (tab) {
          activateTab(tab);
        }
      }
    });

    searchClear.hidden = false;
    noResults.hidden = matches !== 0;
    searchStatus.textContent = matches === 1
      ? `1 study section matches “${searchInput.value.trim()}”.`
      : `${matches} study sections match “${searchInput.value.trim()}”.`;
  };

  const clearSearch = (announce = true) => {
    if (!searchInput) {
      return;
    }
    searchInput.value = "";
    runSearch(announce);
  };

  if (searchForm && searchInput && searchClear) {
    searchForm.addEventListener("submit", (event) => {
      event.preventDefault();
      runSearch();
    });
    searchInput.addEventListener("input", () => runSearch());
    searchInput.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && searchInput.value) {
        event.preventDefault();
        clearSearch();
      }
    });
    searchClear.addEventListener("click", () => {
      clearSearch();
      searchInput.focus();
    });
    runSearch(false);
  }

  const menuOpenButton = root.querySelector("[data-menu-trigger]");
  const menuCloseButtons = Array.from(root.querySelectorAll("[data-menu-close]"));
  const sidebar = root.querySelector("#acls-sidebar");
  const menuBackdrop = root.querySelector(".acls-menu-backdrop");
  const mainContent = root.querySelector(".acls-main");
  let menuIsOpen = false;
  let menuReturnFocus = null;

  const setInert = (element, inert) => {
    if (!element) {
      return;
    }
    element.inert = inert;
    if (inert) {
      element.setAttribute("inert", "");
    } else {
      element.removeAttribute("inert");
    }
  };

  const closeMenu = (restoreFocus = true) => {
    menuIsOpen = false;
    root.dataset.menuOpen = "false";
    menuOpenButton?.setAttribute("aria-expanded", "false");
    if (menuBackdrop) {
      menuBackdrop.hidden = true;
    }
    setInert(mainContent, false);

    if (sidebar && mobileMenu.matches) {
      setInert(sidebar, true);
      sidebar.setAttribute("aria-hidden", "true");
      sidebar.setAttribute("role", "complementary");
      sidebar.removeAttribute("aria-modal");
    }

    if (restoreFocus && menuReturnFocus instanceof HTMLElement) {
      menuReturnFocus.focus();
    }
  };

  const openMenu = () => {
    if (!mobileMenu.matches || !sidebar) {
      return;
    }

    menuReturnFocus = document.activeElement;
    menuIsOpen = true;
    root.dataset.menuOpen = "true";
    menuOpenButton?.setAttribute("aria-expanded", "true");
    setInert(sidebar, false);
    sidebar.setAttribute("role", "dialog");
    sidebar.setAttribute("aria-modal", "true");
    sidebar.setAttribute("aria-hidden", "false");
    setInert(mainContent, true);
    if (menuBackdrop) {
      menuBackdrop.hidden = false;
    }
    sidebar.querySelector(".acls-sidebar-close")?.focus();
  };

  const syncMenuMode = () => {
    if (!sidebar) {
      return;
    }

    if (mobileMenu.matches) {
      closeMenu(false);
    } else {
      menuIsOpen = false;
      root.dataset.menuOpen = "false";
      menuOpenButton?.setAttribute("aria-expanded", "false");
      setInert(sidebar, false);
      setInert(mainContent, false);
      sidebar.removeAttribute("aria-hidden");
      sidebar.setAttribute("role", "complementary");
      sidebar.removeAttribute("aria-modal");
      if (menuBackdrop) {
        menuBackdrop.hidden = true;
      }
    }
  };

  menuOpenButton?.addEventListener("click", openMenu);
  menuCloseButtons.forEach((button) => button.addEventListener("click", () => closeMenu()));
  if (typeof mobileMenu.addEventListener === "function") {
    mobileMenu.addEventListener("change", syncMenuMode);
  } else {
    mobileMenu.addListener(syncMenuMode);
  }
  syncMenuMode();

  root.addEventListener("keydown", (event) => {
    if (!menuIsOpen || !sidebar) {
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      closeMenu();
      return;
    }

    if (event.key !== "Tab") {
      return;
    }

    const focusable = Array.from(sidebar.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'))
      .filter((element) => !element.hidden);

    if (!focusable.length) {
      event.preventDefault();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  const revealTarget = (targetId, scroll = true) => {
    const target = document.getElementById(targetId);

    if (!target || !root.contains(target)) {
      return false;
    }

    if (searchInput?.value) {
      clearSearch(false);
    }

    const section = target.classList.contains("section") ? target : target.closest(".section");
    if (section) {
      section.hidden = false;
      const toggle = section.querySelector(".section-toggle");
      if (toggle) {
        setSectionExpanded(toggle, true);
      }
    }

    if (target.matches('.algorithm-content[role="tabpanel"]')) {
      const tab = root.querySelector(`[role="tab"][aria-controls="${target.id}"]`);
      if (tab) {
        activateTab(tab);
      }
    }

    setCurrentNav(targetId);

    if (scroll) {
      target.scrollIntoView({
        block: "start",
        behavior: reducedMotion.matches ? "auto" : "smooth"
      });
    }

    return true;
  };

  navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");
      if (!href?.startsWith("#")) {
        return;
      }

      event.preventDefault();
      const targetId = href.slice(1);
      if (window.location.hash !== href) {
        window.history.pushState(null, "", href);
      }
      const wasMenuOpen = menuIsOpen;
      revealTarget(targetId);
      if (wasMenuOpen) {
        closeMenu(false);
        const target = document.getElementById(targetId);
        const focusTarget = target?.classList.contains("section")
          ? target.querySelector(".section-toggle")
          : target;
        if (focusTarget instanceof HTMLElement) {
          focusTarget.focus({ preventScroll: true });
        }
      }
    });
  });

  const hashTarget = () => {
    const value = window.location.hash.slice(1);
    try {
      return decodeURIComponent(value);
    } catch {
      return value;
    }
  };

  window.addEventListener("hashchange", () => {
    const targetId = hashTarget();
    if (targetId) {
      revealTarget(targetId);
    }
  });

  const initialTarget = hashTarget();
  if (initialTarget) {
    window.setTimeout(() => revealTarget(initialTarget), 0);
  } else {
    setCurrentNav("algorithms");
  }

  const notesDialog = root.querySelector("#acls-notes-dialog");
  const notesOpenButton = root.querySelector("[data-notes-open]");
  const notesForm = root.querySelector("[data-notes-form]");
  const notesText = root.querySelector("#acls-notes-text");
  const notesStatus = root.querySelector("[data-notes-status]");
  const notesStorageMessage = root.querySelector("#acls-notes-storage");
  const notesSaveButton = root.querySelector("[data-notes-save]");
  const notesStorageKey = "acls-study-notes:v1";

  const storageIsAvailable = (() => {
    try {
      const testKey = `${notesStorageKey}:test`;
      window.localStorage.setItem(testKey, "1");
      window.localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  })();

  if (notesText && storageIsAvailable) {
    try {
      notesText.value = window.localStorage.getItem(notesStorageKey) || "";
    } catch {
      notesText.value = "";
    }
  }

  if (!storageIsAvailable) {
    if (notesStorageMessage) {
      notesStorageMessage.textContent = "Local browser storage is unavailable. Notes cannot be saved on this device.";
    }
    if (notesSaveButton) {
      notesSaveButton.disabled = true;
    }
  }

  const closeNotes = (result = "") => {
    if (!notesDialog) {
      return;
    }
    if (typeof notesDialog.close === "function" && notesDialog.open) {
      notesDialog.close(result);
    } else {
      notesDialog.removeAttribute("open");
    }
  };

  const openNotes = () => {
    if (!notesDialog || notesDialog.hasAttribute("open")) {
      return;
    }

    if (typeof notesDialog.showModal === "function") {
      notesDialog.showModal();
    } else {
      notesDialog.setAttribute("open", "");
    }
    notesText?.focus();
  };

  notesOpenButton?.addEventListener("click", openNotes);
  notesText?.addEventListener("input", () => {
    if (notesStatus) {
      notesStatus.textContent = "";
    }
  });

  notesForm?.addEventListener("submit", (event) => {
    const action = event.submitter?.value;

    if (action !== "save") {
      if (typeof notesDialog?.close !== "function") {
        event.preventDefault();
        closeNotes("cancel");
      }
      return;
    }

    event.preventDefault();

    if (!storageIsAvailable || !notesText || !notesStatus) {
      return;
    }

    try {
      window.localStorage.setItem(notesStorageKey, notesText.value);
      notesStatus.textContent = "Saved on this device.";
      window.setTimeout(() => closeNotes("saved"), 500);
    } catch {
      notesStatus.textContent = "Your note could not be saved. Browser storage may be full or unavailable.";
      notesText.focus();
    }
  });

  window.addEventListener("storage", (event) => {
    if (event.key === notesStorageKey && notesText && !notesDialog?.open) {
      notesText.value = event.newValue || "";
    }
  });
})();

document.addEventListener("DOMContentLoaded", () => {
  const scheduleInput = document.getElementById("schedule");

  if (scheduleInput && typeof flatpickr !== "undefined") {
    flatpickr(scheduleInput, {
      dateFormat: "d/m/Y",
      allowInput: false,
      static: true,
      disableMobile: true,
      position: "auto center"
    });
  }

  const projectsGrid = document.querySelector(".projects-grid");
  const nextButton = document.querySelector(".projects-next");
  const prevButton = document.querySelector(".projects-prev");

  if (projectsGrid && nextButton && prevButton) {
    const getScrollStep = () => {
      const firstCard = projectsGrid.querySelector(".project-card");

      if (!firstCard) {
        return projectsGrid.clientWidth * 0.9;
      }

      const gridStyles = window.getComputedStyle(projectsGrid);
      const gap = parseFloat(gridStyles.columnGap || gridStyles.gap || "0");
      return firstCard.getBoundingClientRect().width + gap;
    };

    const updateProjectButtons = () => {
      const maxScrollLeft = projectsGrid.scrollWidth - projectsGrid.clientWidth;
      const atStart = projectsGrid.scrollLeft <= 4;
      const atEnd = projectsGrid.scrollLeft >= maxScrollLeft - 4;

      prevButton.classList.toggle("is-visible", !atStart);
      prevButton.setAttribute("aria-hidden", String(atStart));
      prevButton.tabIndex = atStart ? -1 : 0;

      nextButton.classList.toggle("is-hidden", atEnd);
      nextButton.setAttribute("aria-hidden", String(atEnd));
      nextButton.tabIndex = atEnd ? -1 : 0;
    };

    nextButton.addEventListener("click", () => {
      projectsGrid.scrollBy({ left: getScrollStep(), behavior: "smooth" });
    });

    prevButton.addEventListener("click", () => {
      projectsGrid.scrollBy({ left: -getScrollStep(), behavior: "smooth" });
    });

    projectsGrid.addEventListener("scroll", updateProjectButtons, { passive: true });
    window.addEventListener("resize", updateProjectButtons);
    updateProjectButtons();
  }

  const announcementContainer = document.querySelector(".announcement-container");

  if (!announcementContainer) {
    return;
  }

  const isMobileViewport = () => window.matchMedia("(max-width: 767px)").matches;
  const hasAnnouncementOverflow = () => announcementContainer.scrollWidth > announcementContainer.clientWidth + 4;
  const getAnnouncementItems = () => Array.from(announcementContainer.querySelectorAll(".announcement-item"));

  const ensureAnnouncementLoopClone = () => {
    if (announcementContainer.querySelector(".announcement-item.is-clone")) {
      return;
    }

    const firstItem = announcementContainer.querySelector(".announcement-item");

    if (!firstItem) {
      return;
    }

    const clone = firstItem.cloneNode(true);
    clone.classList.add("is-clone");
    clone.setAttribute("aria-hidden", "true");
    announcementContainer.appendChild(clone);
  };

  let announcementInterval = null;
  let announcementResumeTimer = null;
  let announcementResetTimer = null;

  const scrollAnnouncementRight = () => {
    const items = getAnnouncementItems();

    if (!items.length) {
      return;
    }

    const firstItemWidth = items[0].getBoundingClientRect().width;

    if (firstItemWidth <= 0) {
      return;
    }

    const currentIndex = Math.floor((announcementContainer.scrollLeft + 1) / firstItemWidth);
    const nextIndex = currentIndex + 1;

    const cloneIndex = items.length - 1;

    if (nextIndex >= cloneIndex) {
      // Move right into the cloned first slide.
      announcementContainer.scrollTo({ left: nextIndex * firstItemWidth, behavior: "smooth" });

      // Then reset instantly to the real first slide (same visual state).
      if (announcementResetTimer) {
        clearTimeout(announcementResetTimer);
      }

      announcementResetTimer = window.setTimeout(() => {
        announcementContainer.scrollTo({ left: 0, behavior: "auto" });
        announcementResetTimer = null;
      }, 700);

      return;
    }

    announcementContainer.scrollTo({ left: nextIndex * firstItemWidth, behavior: "smooth" });
  };

  const stopAnnouncementAutoScroll = () => {
    if (announcementInterval) {
      clearInterval(announcementInterval);
      announcementInterval = null;
    }

    if (announcementResumeTimer) {
      clearTimeout(announcementResumeTimer);
      announcementResumeTimer = null;
    }

    if (announcementResetTimer) {
      clearTimeout(announcementResetTimer);
      announcementResetTimer = null;
    }

  };

  const startAnnouncementAutoScroll = () => {
    stopAnnouncementAutoScroll();
    ensureAnnouncementLoopClone();

    if (!isMobileViewport() || !hasAnnouncementOverflow()) {
      return;
    }

    announcementInterval = setInterval(scrollAnnouncementRight, 2000);
  };

  const restartAnnouncementAutoScroll = () => {
    stopAnnouncementAutoScroll();

    if (!isMobileViewport() || !hasAnnouncementOverflow()) {
      return;
    }

    announcementResumeTimer = setTimeout(() => {
      startAnnouncementAutoScroll();
    }, 2000);
  };

  announcementContainer.addEventListener("touchstart", restartAnnouncementAutoScroll, { passive: true });
  announcementContainer.addEventListener("pointerdown", restartAnnouncementAutoScroll);

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopAnnouncementAutoScroll();
      return;
    }

    startAnnouncementAutoScroll();
  });

  window.addEventListener("resize", startAnnouncementAutoScroll);
  startAnnouncementAutoScroll();
});

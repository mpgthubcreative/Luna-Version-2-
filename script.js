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

  if (!projectsGrid || !nextButton || !prevButton) {
    return;
  }

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
});

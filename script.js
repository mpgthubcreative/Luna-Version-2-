document.addEventListener("DOMContentLoaded", () => {
  const scheduleInput = document.getElementById("schedule");

  if (!scheduleInput || typeof flatpickr === "undefined") {
    return;
  }

  flatpickr(scheduleInput, {
    dateFormat: "d/m/Y",
    allowInput: false,
    static: true,
    disableMobile: true,
    position: "auto center"
  });
});

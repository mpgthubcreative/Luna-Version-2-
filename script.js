document.addEventListener("DOMContentLoaded", () => {
  const hasWebsiteSelect = document.getElementById("hasWebsite");
  const websiteLinkField = document.getElementById("websiteLinkField");
  const websiteLinkInput = document.getElementById("websiteLink");

  if (hasWebsiteSelect && websiteLinkField && websiteLinkInput) {
    const toggleWebsiteField = () => {
      const showWebsiteField = hasWebsiteSelect.value === "Yes";

      websiteLinkField.hidden = !showWebsiteField;
      websiteLinkField.classList.toggle("is-hidden", !showWebsiteField);
      websiteLinkInput.required = showWebsiteField;

      if (!showWebsiteField) {
        websiteLinkInput.value = "";
      }
    };

    hasWebsiteSelect.addEventListener("change", toggleWebsiteField);
    toggleWebsiteField();
  }
});

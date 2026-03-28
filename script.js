const MESSENGER_WEB_URL = "https://www.facebook.com/messages/t/930938550107926?text=Hi%20I%20want%20to%20know%20more%20about%20your%20services";
const MESSENGER_APP_URL = "fb-messenger://user-thread/930938550107926";
const MOBILE_DEVICE_REGEX = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i;

function loadExternalScript(src) {
  const script = document.createElement("script");
  script.async = true;
  script.src = src;
  document.head.appendChild(script);
}

function initGoogleTagManager() {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    "gtm.start": Date.now(),
    event: "gtm.js",
  });

  loadExternalScript("https://www.googletagmanager.com/gtm.js?id=GTM-KF7H22VF");
}

function initMetaPixel() {
  if (window.fbq) {
    return;
  }

  const fbq = function () {
    if (fbq.callMethod) {
      fbq.callMethod.apply(fbq, arguments);
    } else {
      fbq.queue.push(arguments);
    }
  };

  fbq.queue = [];
  fbq.loaded = true;
  fbq.version = "2.0";
  fbq.push = fbq;

  window.fbq = fbq;
  window._fbq = fbq;

  loadExternalScript("https://connect.facebook.net/en_US/fbevents.js");
  window.fbq("init", "1431804088682629");
  window.fbq("track", "PageView");
}

function scheduleTrackingLoad() {
  const initTracking = () => {
    initGoogleTagManager();
    initMetaPixel();
  };

  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(initTracking, { timeout: 3000 });
    return;
  }

  window.setTimeout(initTracking, 2500);
}

document.addEventListener("DOMContentLoaded", () => {
  const hasWebsiteSelect = document.getElementById("hasWebsite");
  const websiteLinkField = document.getElementById("websiteLinkField");
  const websiteLinkInput = document.getElementById("websiteLink");
  const messengerLinks = document.querySelectorAll(".js-open-messenger");

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

  messengerLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      if (!MOBILE_DEVICE_REGEX.test(window.navigator.userAgent)) {
        return;
      }

      event.preventDefault();
      window.location.href = MESSENGER_APP_URL;

      window.setTimeout(() => {
        window.location.href = MESSENGER_WEB_URL;
      }, 1500);
    });
  });
});

if (document.readyState === "complete") {
  scheduleTrackingLoad();
} else {
  window.addEventListener("load", scheduleTrackingLoad, { once: true });
}

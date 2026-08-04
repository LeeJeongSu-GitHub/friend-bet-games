(function attachPwaManager(root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.PwaManager = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function createPwaManager() {
  "use strict";

  function setup(options = {}) {
    const installButton = options.installButton;
    const updateBanner = options.updateBanner;
    const updateButton = options.updateButton;
    const dismissUpdateButton = options.dismissUpdateButton;
    const serviceWorkerUrl = options.serviceWorkerUrl || "./sw.js";
    const notify = options.notify || (() => {});
    let installPrompt = null;
    let registration = null;
    let reloading = false;
    let reloadForUpdate = false;

    const standalone =
      window.matchMedia?.("(display-mode: standalone)").matches ||
      window.navigator.standalone === true;
    if (installButton) installButton.hidden = true;
    if (updateBanner) updateBanner.hidden = true;

    window.addEventListener("beforeinstallprompt", (event) => {
      event.preventDefault();
      installPrompt = event;
      if (installButton && !standalone) installButton.hidden = false;
    });

    window.addEventListener("appinstalled", () => {
      installPrompt = null;
      if (installButton) installButton.hidden = true;
      notify("홈 화면에 설치했어요.");
    });

    installButton?.addEventListener("click", async () => {
      if (!installPrompt) return;
      installButton.disabled = true;
      try {
        await installPrompt.prompt();
        await installPrompt.userChoice;
      } finally {
        installPrompt = null;
        installButton.hidden = true;
        installButton.disabled = false;
      }
    });

    function showUpdate() {
      if (updateBanner) updateBanner.hidden = false;
    }

    updateButton?.addEventListener("click", () => {
      if (!registration?.waiting) return;
      updateButton.disabled = true;
      reloadForUpdate = true;
      registration.waiting.postMessage({ type: "SKIP_WAITING" });
    });
    dismissUpdateButton?.addEventListener("click", () => {
      if (updateBanner) updateBanner.hidden = true;
    });

    if (!("serviceWorker" in navigator) || !/^https?:$/.test(location.protocol)) {
      return { getRegistration: () => registration };
    }

    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (!reloadForUpdate || reloading) return;
      reloading = true;
      location.reload();
    });

    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register(serviceWorkerUrl, { updateViaCache: "none" })
        .then((registered) => {
          registration = registered;
          if (registration.waiting && navigator.serviceWorker.controller) {
            showUpdate();
          }
          registration.addEventListener("updatefound", () => {
            const worker = registration.installing;
            worker?.addEventListener("statechange", () => {
              if (worker.state === "installed" && navigator.serviceWorker.controller) {
                showUpdate();
              }
            });
          });
          return registration.update();
        })
        .catch(() => {
          // Installation and offline support never block the games.
        });
    });

    return { getRegistration: () => registration };
  }

  return { setup };
});

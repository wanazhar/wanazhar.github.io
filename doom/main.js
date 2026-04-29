(() => {
  const DEFAULT_BUNDLE_URL = "./assets/doom.jsdos";

  const elements = {
    dos: document.querySelector("#dos"),
    gameShell: document.querySelector("#gameShell"),
    emptyState: document.querySelector("#emptyState"),
    startButton: document.querySelector("#startButton"),
    emptyStartButton: document.querySelector("#emptyStartButton"),
    fullscreenButton: document.querySelector("#fullscreenButton"),
    touchToggleButton: document.querySelector("#touchToggleButton"),
    helpButton: document.querySelector("#helpButton"),
    helpPanel: document.querySelector("#helpPanel"),
    bundlePicker: document.querySelector("#bundlePicker"),
    touchOverlay: document.querySelector("#touchOverlay"),
    dropLayer: document.querySelector("#dropLayer"),
    statusDot: document.querySelector("#statusDot"),
    statusTitle: document.querySelector("#statusTitle"),
    statusText: document.querySelector("#statusText"),
  };

  let commandInterface = null;
  let currentBundleObjectUrl = null;
  const activeVirtualKeys = new Set();

  const keyMeta = {
    ArrowUp: { key: "ArrowUp", code: "ArrowUp", keyCode: 38 },
    ArrowDown: { key: "ArrowDown", code: "ArrowDown", keyCode: 40 },
    ArrowLeft: { key: "ArrowLeft", code: "ArrowLeft", keyCode: 37 },
    ArrowRight: { key: "ArrowRight", code: "ArrowRight", keyCode: 39 },
    ControlLeft: { key: "Control", code: "ControlLeft", keyCode: 17, ctrlKey: true },
    ShiftLeft: { key: "Shift", code: "ShiftLeft", keyCode: 16, shiftKey: true },
    AltLeft: { key: "Alt", code: "AltLeft", keyCode: 18, altKey: true },
    Space: { key: " ", code: "Space", keyCode: 32 },
    Escape: { key: "Escape", code: "Escape", keyCode: 27 },
    Enter: { key: "Enter", code: "Enter", keyCode: 13 },
    Tab: { key: "Tab", code: "Tab", keyCode: 9 },
  };

  function setStatus(kind, title, text) {
    elements.statusDot.classList.remove("ready", "running", "error");
    if (kind) elements.statusDot.classList.add(kind);
    elements.statusTitle.textContent = title;
    elements.statusText.innerHTML = text;
  }

  function showEmptyState(show) {
    elements.emptyState.classList.toggle("hide", !show);
  }

  async function doesBundleExist(url) {
    try {
      const response = await fetch(url, { method: "HEAD", cache: "no-store" });
      if (response.ok) return true;

      // Some static hosts do not handle HEAD consistently. Try a tiny GET as fallback.
      const fallback = await fetch(url, {
        method: "GET",
        cache: "no-store",
        headers: { Range: "bytes=0-0" },
      });
      return fallback.ok;
    } catch (_error) {
      return false;
    }
  }

  function resetDosStage() {
    elements.dos.innerHTML = "";
  }

  async function startDoom(bundleUrl = DEFAULT_BUNDLE_URL, { skipExistenceCheck = false } = {}) {
    if (typeof window.Dos !== "function") {
      setStatus(
        "error",
        "js-dos unavailable",
        "Could not load js-dos from the CDN. Check your internet connection or vendor the js-dos files locally."
      );
      showEmptyState(true);
      return;
    }

    setStatus("", "Checking bundle", "Looking for the DOOM js-dos bundle...");

    if (!skipExistenceCheck) {
      const exists = await doesBundleExist(bundleUrl);
      if (!exists) {
        setStatus(
          "error",
          "Bundle missing",
          "Add <code>doom/assets/doom.jsdos</code> or load a local <code>.jsdos</code> file."
        );
        showEmptyState(true);
        return;
      }
    }

    try {
      showEmptyState(false);
      resetDosStage();
      setStatus("", "Booting", "Starting js-dos...");

      commandInterface = await window.Dos(elements.dos, {
        url: bundleUrl,
        kiosk: true,
        autoStart: true,
        pathPrefix: "https://v8.js-dos.com/latest/emulators/",
        onEvent: (event, arg) => {
          if (event === "emu-error" || event === "ci-err" || event === "bnd-error") {
            console.error("js-dos event", event, arg);
          }
        },
      });

      setStatus("running", "Running", "DOOM is live. Click inside the game if the keyboard does not respond.");
      focusGameCanvas();
    } catch (error) {
      console.error(error);
      setStatus(
        "error",
        "Boot failed",
        "The bundle was found, but js-dos could not start it. Rebuild the bundle and make sure it contains <code>.jsdos/dosbox.conf</code>."
      );
      showEmptyState(true);
    }
  }

  function focusGameCanvas() {
    const canvas = elements.gameShell.querySelector("canvas");
    if (canvas) {
      canvas.setAttribute("tabindex", "0");
      canvas.focus({ preventScroll: true });
    }
  }

  function toggleHelp() {
    const nextHidden = !elements.helpPanel.hidden;
    elements.helpPanel.hidden = nextHidden;
    elements.helpButton.setAttribute("aria-expanded", String(!nextHidden));
  }

  function setTouchOverlay(enabled) {
    elements.touchOverlay.classList.toggle("enabled", enabled);
    elements.touchToggleButton.setAttribute("aria-pressed", String(enabled));
    elements.touchToggleButton.textContent = enabled ? "Hide touch" : "Touch controls";
  }

  async function enterFullscreen() {
    try {
      if (!document.fullscreenElement) {
        await elements.gameShell.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
      focusGameCanvas();
    } catch (error) {
      console.warn("Fullscreen request failed", error);
      setStatus("error", "Fullscreen blocked", "Your browser blocked fullscreen. Try tapping inside the game first.");
    }
  }

  function eventTargetForKeys() {
    return elements.gameShell.querySelector("canvas") || elements.dos || document.body;
  }

  function createKeyboardEvent(type, keyName) {
    const meta = keyMeta[keyName];
    if (!meta) return null;

    const event = new KeyboardEvent(type, {
      key: meta.key,
      code: meta.code,
      bubbles: true,
      cancelable: true,
      ctrlKey: Boolean(meta.ctrlKey || activeVirtualKeys.has("ControlLeft")),
      shiftKey: Boolean(meta.shiftKey || activeVirtualKeys.has("ShiftLeft")),
      altKey: Boolean(meta.altKey || activeVirtualKeys.has("AltLeft")),
      metaKey: false,
    });

    // Some browser game libraries still read legacy keyCode/which values.
    Object.defineProperty(event, "keyCode", { get: () => meta.keyCode });
    Object.defineProperty(event, "which", { get: () => meta.keyCode });
    return event;
  }

  function dispatchVirtualKey(type, keyName) {
    const event = createKeyboardEvent(type, keyName);
    if (!event) return;

    const target = eventTargetForKeys();
    target.dispatchEvent(event);
    document.dispatchEvent(event);
    window.dispatchEvent(event);
  }

  function pressVirtualKey(button) {
    const keyName = button.dataset.key;
    if (!keyName || activeVirtualKeys.has(keyName)) return;

    activeVirtualKeys.add(keyName);
    button.classList.add("active");
    focusGameCanvas();
    dispatchVirtualKey("keydown", keyName);
  }

  function releaseVirtualKey(button) {
    const keyName = button.dataset.key;
    if (!keyName) return;

    activeVirtualKeys.delete(keyName);
    button.classList.remove("active");
    dispatchVirtualKey("keyup", keyName);
  }

  function releaseAllVirtualKeys() {
    document.querySelectorAll(".touch-button.active").forEach((button) => {
      releaseVirtualKey(button);
    });
    activeVirtualKeys.clear();
  }

  function wireTouchControls() {
    const buttons = document.querySelectorAll(".touch-button[data-key]");
    buttons.forEach((button) => {
      button.addEventListener("contextmenu", (event) => event.preventDefault());
      button.addEventListener("pointerdown", (event) => {
        event.preventDefault();
        button.setPointerCapture?.(event.pointerId);
        pressVirtualKey(button);
      });
      button.addEventListener("pointerup", (event) => {
        event.preventDefault();
        releaseVirtualKey(button);
      });
      button.addEventListener("pointercancel", () => releaseVirtualKey(button));
      button.addEventListener("pointerleave", () => releaseVirtualKey(button));
      button.addEventListener("lostpointercapture", () => releaseVirtualKey(button));
    });

    window.addEventListener("blur", releaseAllVirtualKeys);
  }

  function handleBundleFile(file) {
    if (!file) return;
    if (currentBundleObjectUrl) {
      URL.revokeObjectURL(currentBundleObjectUrl);
    }
    currentBundleObjectUrl = URL.createObjectURL(file);
    setStatus("ready", "Local bundle loaded", `${file.name} is ready for this browser session.`);
    startDoom(currentBundleObjectUrl, { skipExistenceCheck: true });
  }

  function wireDragAndDrop() {
    const showDrop = () => elements.dropLayer.classList.add("visible");
    const hideDrop = () => elements.dropLayer.classList.remove("visible");

    ["dragenter", "dragover"].forEach((type) => {
      window.addEventListener(type, (event) => {
        event.preventDefault();
        showDrop();
      });
    });

    ["dragleave", "dragend"].forEach((type) => {
      window.addEventListener(type, (event) => {
        event.preventDefault();
        if (event.target === document.body || type === "dragend") hideDrop();
      });
    });

    window.addEventListener("drop", (event) => {
      event.preventDefault();
      hideDrop();
      const [file] = Array.from(event.dataTransfer?.files || []);
      handleBundleFile(file);
    });
  }

  function detectCoarsePointer() {
    return window.matchMedia?.("(hover: none), (pointer: coarse)").matches ?? false;
  }

  function wireUi() {
    elements.startButton.addEventListener("click", () => startDoom());
    elements.emptyStartButton.addEventListener("click", () => startDoom());
    elements.fullscreenButton.addEventListener("click", enterFullscreen);
    elements.helpButton.addEventListener("click", toggleHelp);
    elements.touchToggleButton.addEventListener("click", () => {
      setTouchOverlay(!elements.touchOverlay.classList.contains("enabled"));
    });
    elements.bundlePicker.addEventListener("change", (event) => {
      const [file] = Array.from(event.target.files || []);
      handleBundleFile(file);
      event.target.value = "";
    });

    elements.gameShell.addEventListener("click", focusGameCanvas);
  }

  async function initialBundleCheck() {
    const exists = await doesBundleExist(DEFAULT_BUNDLE_URL);
    if (exists) {
      setStatus("ready", "Bundle found", "Press Start DOOM to boot <code>assets/doom.jsdos</code>.");
    } else {
      setStatus(
        "error",
        "Bundle missing",
        "Add <code>doom/assets/doom.jsdos</code>, or load a local <code>.jsdos</code> bundle."
      );
    }
  }

  function init() {
    wireUi();
    wireTouchControls();
    wireDragAndDrop();
    setTouchOverlay(detectCoarsePointer());
    initialBundleCheck();

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) releaseAllVirtualKeys();
    });

    // Keep a reference for debugging in the browser console.
    window.doomPage = {
      start: startDoom,
      get commandInterface() {
        return commandInterface;
      },
    };
  }

  init();
})();

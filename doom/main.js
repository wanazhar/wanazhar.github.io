(() => {
  const DEFAULT_BUNDLE_URL = "./assets/doom.jsdos";
  const ALT_BUNDLE_URL = "./assets/doom_old.jsdos";
  const LEGACY_BUNDLE_URL = "https://thedoggybrad.github.io/doom_on_js-dos/DOOM-@evilution.zip";
  const LEGACY_API_URL = "./vendor/js-dos-api.js";

  const elements = {
    dos: document.querySelector("#dos"),
    gameShell: document.querySelector("#gameShell"),
    emptyState: document.querySelector("#emptyState"),
    startButton: document.querySelector("#startButton"),
    altStartButton: document.querySelector("#altStartButton"),
    emptyStartButton: document.querySelector("#emptyStartButton"),
    fullscreenButton: document.querySelector("#fullscreenButton"),
    touchToggleButton: document.querySelector("#touchToggleButton"),
    saveButton: document.querySelector("#saveButton"),
    loadButton: document.querySelector("#loadButton"),
    bundlePicker: document.querySelector("#bundlePicker"),
    touchOverlay: document.querySelector("#touchOverlay"),
    statusDot: document.querySelector("#statusDot"),
    statusTitle: document.querySelector("#statusTitle"),
  };

  let commandInterface = null;
  let legacyDosbox = null;
  let currentBundleObjectUrl = null;
  let activeRunId = 0;
  let legacyApiPromise = null;
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

  function setStatus(kind, title) {
    elements.statusDot.className = "dot " + (kind || "");
    elements.statusTitle.textContent = title;
  }

  function showEmptyState(show) {
    elements.emptyState.classList.toggle("hidden", !show);
  }

  function isAppleTouchDevice() {
    return (
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
    );
  }

  function isCoarsePointer() {
    return window.matchMedia("(pointer: coarse)").matches;
  }

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const existing = document.querySelector(`script[src="${src}"]`);
      if (existing) {
        existing.addEventListener("load", resolve, { once: true });
        existing.addEventListener("error", reject, { once: true });
        if (existing.dataset.loaded === "true") resolve();
        return;
      }

      const script = document.createElement("script");
      script.src = src;
      script.async = true;
      script.onload = () => {
        script.dataset.loaded = "true";
        resolve();
      };
      script.onerror = () => reject(new Error(`Failed to load ${src}`));
      document.head.appendChild(script);
    });
  }

  function loadLegacyApi() {
    if (typeof window.Dosbox === "function") return Promise.resolve();
    if (!legacyApiPromise) legacyApiPromise = loadScript(LEGACY_API_URL);
    return legacyApiPromise;
  }

  async function stopCurrentEmulator() {
    if (commandInterface) {
      try {
        if (typeof commandInterface.stop === "function") {
          await commandInterface.stop();
        }
      } catch (error) {
        console.warn("Failed to stop previous js-dos instance", error);
      } finally {
        commandInterface = null;
      }
    }

    legacyDosbox = null;
  }

  function getDosOptions(bundleUrl, runId) {
    return {
      url: bundleUrl,
      kiosk: true,
      autoStart: true,
      countDownStart: 0,
      backend: "dosbox",
      backendLocked: true,
      noCloud: true,
      noNetworking: true,
      pathPrefix: "https://v8.js-dos.com/latest/emulators/",
      onEvent: (event, arg) => {
        if (event === "emu-error" || event === "ci-err" || event === "bnd-error") {
          console.error("js-dos event", event, arg);
          if (runId === activeRunId) setStatus("error", "Error! (｡•́︿•̀｡)");
        }
        if (event === "ci-ready" && runId === activeRunId) {
          setStatus("running", "Playing! ♡");
          focusGameCanvas();
        }
      },
    };
  }

  async function startDoomV8(bundleUrl = DEFAULT_BUNDLE_URL, label = "Booting... ૮₍ ˃ ⤙ ˂ ₎ა") {
    if (typeof window.Dos !== "function") {
      setStatus("error", "Failed to load js-dos v8");
      return;
    }

    const runId = activeRunId + 1;
    activeRunId = runId;

    try {
      showEmptyState(false);
      await stopCurrentEmulator();
      elements.dos.innerHTML = "";
      setStatus("running", label);

      commandInterface = await window.Dos(elements.dos, getDosOptions(bundleUrl, runId));
      focusGameCanvas();
    } catch (error) {
      console.error(error);
      if (runId === activeRunId) {
        setStatus("error", "Boot failed (´•̥ ᵔ •̥`) ");
        showEmptyState(true);
      }
    }
  }

  async function startDoomLegacy() {
    const runId = activeRunId + 1;
    activeRunId = runId;

    try {
      showEmptyState(false);
      await stopCurrentEmulator();
      elements.dos.innerHTML = "";
      setStatus("running", "Booting iPad-safe legacy engine...");

      await loadLegacyApi();
      if (runId !== activeRunId) return;

      legacyDosbox = new window.Dosbox({
        id: "dos",
        onload: (dosbox) => {
          setStatus("running", "Loading external reference DOOM zip...");
          dosbox.run(LEGACY_BUNDLE_URL, "./DOOM/DOOM.EXE");
          window.setTimeout(() => {
            if (runId === activeRunId) {
              setStatus("running", "Playing! ♡");
              focusGameCanvas();
            }
          }, 4000);
        },
        onrun: () => {
          if (runId === activeRunId) {
            setStatus("running", "Playing! ♡");
            focusGameCanvas();
          }
        },
      });

      const startControl = legacyDosbox?.ui?.start;
      if (startControl && typeof startControl.trigger === "function") {
        startControl.trigger("click");
      } else if (legacyDosbox?.downloadScript) {
        legacyDosbox.downloadScript();
      }
    } catch (error) {
      console.error(error);
      if (runId === activeRunId) {
        setStatus("error", "Legacy boot failed (｡•́︿•̀｡)");
        showEmptyState(true);
      }
    }
  }

  function startDoom(bundleUrl = DEFAULT_BUNDLE_URL) {
    if (isAppleTouchDevice() && bundleUrl === DEFAULT_BUNDLE_URL) {
      return startDoomLegacy();
    }
    return startDoomV8(bundleUrl);
  }

  function focusGameCanvas() {
    const canvas = elements.gameShell.querySelector("canvas");
    if (canvas) {
      canvas.setAttribute("tabindex", "0");
      canvas.focus({ preventScroll: true });
    }
  }

  function setTouchOverlay(enabled) {
    elements.touchOverlay.classList.toggle("hidden", !enabled);
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
    }
  }

  function dispatchVirtualKey(type, keyName) {
    const meta = keyMeta[keyName];
    if (!meta) return;

    const event = new KeyboardEvent(type, {
      key: meta.key,
      code: meta.code,
      bubbles: true,
      cancelable: true,
      ctrlKey: activeVirtualKeys.has("ControlLeft"),
      shiftKey: activeVirtualKeys.has("ShiftLeft"),
      altKey: activeVirtualKeys.has("AltLeft"),
    });

    Object.defineProperty(event, "keyCode", { get: () => meta.keyCode });
    Object.defineProperty(event, "which", { get: () => meta.keyCode });

    const target = elements.gameShell.querySelector("canvas") || document.body;
    target.dispatchEvent(event);
  }

  function pressVirtualKey(button) {
    const keyName = button.dataset.key;
    if (!keyName || activeVirtualKeys.has(keyName)) return;

    activeVirtualKeys.add(keyName);
    button.classList.add("active");
    dispatchVirtualKey("keydown", keyName);
  }

  function releaseVirtualKey(button) {
    const keyName = button.dataset.key;
    if (!keyName) return;

    activeVirtualKeys.delete(keyName);
    button.classList.remove("active");
    dispatchVirtualKey("keyup", keyName);
  }

  function wireTouchControls() {
    const buttons = document.querySelectorAll(".touch-btn[data-key]");
    buttons.forEach((button) => {
      button.addEventListener("pointerdown", (e) => {
        e.preventDefault();
        button.setPointerCapture(e.pointerId);
        pressVirtualKey(button);
      });
      button.addEventListener("pointerup", (e) => {
        e.preventDefault();
        releaseVirtualKey(button);
      });
      button.addEventListener("pointercancel", () => releaseVirtualKey(button));
    });
  }

  function init() {
    elements.startButton.addEventListener("click", () => startDoom(DEFAULT_BUNDLE_URL));
    elements.altStartButton.addEventListener("click", () => startDoomV8(ALT_BUNDLE_URL, "Booting js-dos v8 alt bundle..."));
    elements.emptyStartButton.addEventListener("click", () => startDoom(DEFAULT_BUNDLE_URL));
    elements.fullscreenButton.addEventListener("click", enterFullscreen);
    elements.touchToggleButton.addEventListener("click", () => {
      setTouchOverlay(elements.touchOverlay.classList.contains("hidden"));
    });

    elements.saveButton.addEventListener("click", async () => {
      if (commandInterface) {
        if (typeof commandInterface.persist === "function") {
          const { data } = await commandInterface.persist();
          const blob = new Blob([data], { type: "application/octet-stream" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "doom-save.jsdos";
          a.click();
          URL.revokeObjectURL(url);
        } else if (typeof commandInterface.save === "function") {
          await commandInterface.save();
          setStatus("ready", "Saved locally ♡");
        }
      } else if (legacyDosbox) {
        setStatus("ready", "Legacy engine: use browser storage ♡");
      }
    });

    elements.loadButton.addEventListener("click", () => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".jsdos";
      input.onchange = async (e) => {
        const file = e.target.files[0];
        if (file) {
          if (commandInterface) {
            alert("To load a save, please use the 'Load .jsdos' button below with your save file!");
          } else {
            alert("Save loading is only available in the js-dos v8 mode. Use Alt Version first, then load.");
          }
        }
      };
      input.click();
    });

    elements.bundlePicker.addEventListener("change", (event) => {
      const file = event.target.files[0];
      if (file) {
        if (currentBundleObjectUrl) URL.revokeObjectURL(currentBundleObjectUrl);
        currentBundleObjectUrl = URL.createObjectURL(file);
        startDoomV8(currentBundleObjectUrl, "Booting uploaded .jsdos...");
      }
    });

    wireTouchControls();

    if (isAppleTouchDevice() || isCoarsePointer()) {
      setTouchOverlay(true);
    }

    setStatus("ready", "Ready! ૮ ˶ᵔ ᵕ ᵔ˶ ა");
  }

  init();
})();

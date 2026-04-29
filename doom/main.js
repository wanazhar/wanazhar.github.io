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
    saveButton: document.querySelector("#saveButton"),
    loadButton: document.querySelector("#loadButton"),
    bundlePicker: document.querySelector("#bundlePicker"),
    touchOverlay: document.querySelector("#touchOverlay"),
    statusDot: document.querySelector("#statusDot"),
    statusTitle: document.querySelector("#statusTitle"),
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

  function getDosOptions(bundleUrl) {
    return {
      url: bundleUrl,
      kiosk: true,
      autoStart: true,
      backend: "dosbox",
      backendLocked: true,
      noCloud: true,
      noNetworking: true,
      pathPrefix: "https://v8.js-dos.com/latest/emulators/",
      onEvent: (event, arg) => {
        if (event === "emu-error" || event === "ci-err" || event === "bnd-error") {
          console.error("js-dos event", event, arg);
          setStatus("error", "Error! (｡•́︿•̀｡)");
        }
        if (event === "ci-ready") {
          setStatus("running", "Playing! ♡");
          focusGameCanvas();
        }
      },
    };
  }

  async function startDoom(bundleUrl = DEFAULT_BUNDLE_URL) {
    if (typeof window.Dos !== "function") {
      setStatus("error", "Failed to load js-dos");
      return;
    }

    try {
      showEmptyState(false);
      elements.dos.innerHTML = "";
      setStatus("running", "Booting... ૮₍ ˃ ⤙ ˂ ₎ა");

      commandInterface = await window.Dos(elements.dos, getDosOptions(bundleUrl));
      focusGameCanvas();
    } catch (error) {
      console.error(error);
      setStatus("error", "Boot failed (´•̥ ᵔ •̥`) ");
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
    elements.startButton.addEventListener("click", () => startDoom());
    elements.emptyStartButton.addEventListener("click", () => startDoom());
    elements.fullscreenButton.addEventListener("click", enterFullscreen);
    elements.touchToggleButton.addEventListener("click", () => {
      setTouchOverlay(elements.touchOverlay.classList.contains("hidden"));
    });

    elements.saveButton.addEventListener("click", async () => {
      if (commandInterface) {
        const { data } = await commandInterface.persist();
        const blob = new Blob([data], { type: "application/octet-stream" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "doom-save.jsdos";
        a.click();
        URL.revokeObjectURL(url);
      }
    });

    elements.loadButton.addEventListener("click", () => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".jsdos";
      input.onchange = async (e) => {
        const file = e.target.files[0];
        if (file && commandInterface) {
          const reader = new FileReader();
          reader.onload = async (re) => {
            const data = new Uint8Array(re.target.result);
            // This is a simplified load, for full support we'd need to restart with this data
            // but js-dos v8 handles persistence mostly through the initial bundle or indexeddb
            alert("To load a save, please use the 'Load .jsdos' button below with your save file!");
          };
          reader.readAsArrayBuffer(file);
        }
      };
      input.click();
    });

    elements.bundlePicker.addEventListener("change", (event) => {
      const file = event.target.files[0];
      if (file) {
        if (currentBundleObjectUrl) URL.revokeObjectURL(currentBundleObjectUrl);
        currentBundleObjectUrl = URL.createObjectURL(file);
        startDoom(currentBundleObjectUrl);
      }
    });

    wireTouchControls();

    if (isAppleTouchDevice() || window.matchMedia("(pointer: coarse)").matches) {
      setTouchOverlay(true);
    }

    setStatus("ready", "Ready! ૮ ˶ᵔ ᵕ ᵔ˶ ა");
  }

  init();
})();

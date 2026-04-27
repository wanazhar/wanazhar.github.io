export function setupHud({
  landmarks,
  player,
  trainSystem,
  requestRender,
  focusLandmark,
  refocusPlayer,
  setCameraMode,
  toggleTour,
  cycleTimeMode,
  boardTrain,
  tourismContent,
  routes,
  questSystem,
  saveSystem,
  setRoute,
  fastTravel,
  resetProgress
}) {
  const fpsEl = document.getElementById('fps');
  const pixelRatioEl = document.getElementById('pixel-ratio');
  const voxelCountEl = document.getElementById('voxel-count');
  const generatedChunksEl = document.getElementById('generated-chunks');
  const generatedVisibleEl = document.getElementById('generated-visible');
  const generatedAuthoredEl = document.getElementById('generated-authored');
  const totalAuthoredEl = document.getElementById('total-authored');
  const visibleBudgetEl = document.getElementById('visible-budget');
  const stampCountEl = document.getElementById('stamp-count');
  const tourStateEl = document.getElementById('tour-state');
  const tourNextEl = document.getElementById('tour-next');
  const renderStateEl = document.getElementById('render-state');
  const buttons = document.getElementById('landmark-buttons');
  const toast = document.getElementById('toast');
  const joystick = document.getElementById('touch-joystick');
  const stick = document.getElementById('touch-stick');
  const landmarkButtons = new Map();
  const boardTrainButton = document.getElementById('btn-board-train');
  const routeSelector = document.getElementById('route-selector');
  const stationSelector = document.getElementById('station-selector');
  const guidebookPanel = document.getElementById('guidebook-panel');
  const questPanel = document.getElementById('quest-panel');
  const tipsPanel = document.getElementById('tips-panel');
  const guidebookTitle = document.getElementById('guidebook-title');
  const guidebookNote = document.getElementById('guidebook-note');
  const guidebookDetails = document.getElementById('guidebook-details');
  const highlightList = document.getElementById('highlight-list');
  const questList = document.getElementById('quest-list');
  const tipsList = document.getElementById('tips-list');

  landmarks.forEach((landmark) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = landmark.name.replace('Petronas Twin Towers', 'Petronas').replace('National ', '');
    button.title = landmark.name;
    button.addEventListener('click', () => {
      focusLandmark(landmark);
      setGuidebook(landmark);
      showToast(`Focused: ${landmark.name}`);
    });
    landmarkButtons.set(landmark.name, button);
    buttons.appendChild(button);
  });

  const keepTouchOnOverlay = (element) => {
    if (!element) return;
    element.addEventListener('touchstart', (event) => event.preventDefault(), { passive: false });
    element.addEventListener('touchmove', (event) => event.preventDefault(), { passive: false });
  };

  const bindHoldButton = (id, key, { toastOnDown } = {}) => {
    const element = document.getElementById(id);
    if (!element) return;

    const down = (event) => {
      event.preventDefault();
      element.setPointerCapture?.(event.pointerId);
      element.classList.add('is-active');
      player.setVirtualKey(key, true);
      trainSystem.wake();
      if (toastOnDown) showToast(toastOnDown);
      requestRender();
    };

    const up = (event) => {
      event.preventDefault();
      element.releasePointerCapture?.(event.pointerId);
      element.classList.remove('is-active');
      player.setVirtualKey(key, false);
      requestRender();
    };

    element.addEventListener('pointerdown', down);
    element.addEventListener('pointerup', up);
    element.addEventListener('pointercancel', up);
    element.addEventListener('lostpointercapture', up);
    keepTouchOnOverlay(element);
  };

  const bindTapButton = (id, onTap) => {
    const element = document.getElementById(id);
    if (!element) return;
    element.addEventListener('pointerdown', (event) => {
      event.preventDefault();
      element.classList.add('is-active');
      onTap();
      requestRender();
    });
    element.addEventListener('pointerup', () => element.classList.remove('is-active'));
    element.addEventListener('pointercancel', () => element.classList.remove('is-active'));
    keepTouchOnOverlay(element);
  };

  bindHoldButton('btn-touch-jump', 'jump');
  bindHoldButton('btn-touch-sprint', 'sprint', { toastOnDown: 'Sprint held. Push the left thumb-stick to run.' });

  bindTapButton('btn-touch-focus', () => {
    refocusPlayer?.();
    showToast('Camera refocused on the explorer.');
  });

  bindTapButton('btn-touch-trains', () => {
    const permanent = trainSystem.togglePermanentMotion();
    showToast(permanent ? 'Continuous train motion enabled.' : 'Train motion now auto-pauses when idle.');
  });

  bindTapButton('btn-camera-walk', () => setCameraMode?.('walk'));
  bindTapButton('btn-camera-landmark', () => setCameraMode?.('landmark'));
  bindTapButton('btn-camera-skyline', () => setCameraMode?.('skyline'));
  bindTapButton('btn-tour', () => toggleTour?.());
  bindTapButton('btn-time', () => cycleTimeMode?.());
  bindTapButton('btn-board-train', () => boardTrain?.());
  bindTapButton('btn-guidebook', () => togglePanel(guidebookPanel));
  bindTapButton('btn-quests', () => {
    renderQuests();
    togglePanel(questPanel);
  });
  bindTapButton('btn-tips', () => togglePanel(tipsPanel));
  bindTapButton('btn-save-now', () => {
    saveSystem?.persist();
    showToast('Progress saved on this device.');
  });
  bindTapButton('btn-reset-progress', () => {
    resetProgress?.();
    showToast('Progress reset.');
  });

  routes?.forEach((route) => {
    const option = document.createElement('option');
    option.value = route.id;
    option.textContent = route.name;
    routeSelector.appendChild(option);
  });
  if (saveSystem?.data.activeRoute) routeSelector.value = saveSystem.data.activeRoute;
  routeSelector.addEventListener('change', () => {
    setRoute?.(routeSelector.value);
    requestRender();
  });

  trainSystem.stations.forEach((station) => {
    const option = document.createElement('option');
    option.value = station.name;
    option.textContent = `${station.label}: ${station.name}`;
    stationSelector.appendChild(option);
  });
  stationSelector.addEventListener('change', () => {
    fastTravel?.(stationSelector.value);
    requestRender();
  });

  function togglePanel(panel) {
    if (!panel) return;
    const nextHidden = !panel.hidden;
    [guidebookPanel, questPanel, tipsPanel].forEach((item) => {
      if (item && item !== panel && window.matchMedia('(max-width: 860px)').matches) item.hidden = true;
    });
    panel.hidden = nextHidden;
    requestRender();
  }

  function closePanel(panel) {
    if (!panel) return;
    panel.hidden = true;
    requestRender();
  }

  [guidebookPanel, questPanel, tipsPanel].forEach((panel) => {
    panel?.addEventListener('pointerdown', (event) => event.stopPropagation());
  });

  document.querySelectorAll('[data-close-panel]').forEach((button) => {
    button.addEventListener('click', () => closePanel(document.getElementById(button.dataset.closePanel)));
  });

  document.querySelectorAll('[data-collapse-panel]').forEach((button) => {
    const panel = document.getElementById(button.dataset.collapsePanel);
    if (!panel) return;
    button.addEventListener('click', (event) => {
      event.stopPropagation();
      const collapsed = panel.classList.toggle('is-collapsed');
      button.textContent = collapsed ? '+' : '−';
      button.setAttribute('aria-label', collapsed ? `Restore ${panel.id}` : `Minimize ${panel.id}`);
      requestRender();
    });
  });

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') [guidebookPanel, questPanel, tipsPanel].forEach(closePanel);
  });

  function setGuidebook(landmark) {
    if (!landmark) return;
    guidebookTitle.textContent = landmark.name;
    guidebookNote.textContent = landmark.note ?? 'Tourism stop in the stylized KL guide.';
    guidebookDetails.innerHTML = '';
    [
      ['District', landmark.district],
      ['Best time', landmark.bestTime],
      ['Category', landmark.category],
      ['Tip', landmark.tip]
    ].forEach(([label, value]) => {
      const dt = document.createElement('dt');
      dt.textContent = label;
      const dd = document.createElement('dd');
      dd.textContent = value ?? '-';
      guidebookDetails.append(dt, dd);
    });
    highlightList.innerHTML = '';
    tourismContent?.zones?.forEach((zone) => {
      const item = document.createElement('p');
      item.textContent = `${zone.name}: ${zone.summary}`;
      highlightList.appendChild(item);
    });
  }

  function renderQuests() {
    questList.innerHTML = '';
    questSystem?.summaries().forEach((quest) => {
      const item = document.createElement('p');
      item.className = quest.complete ? 'is-complete' : '';
      item.textContent = `${quest.complete ? 'Done' : `${quest.progress}/${quest.target}`} · ${quest.name}: ${quest.description}`;
      questList.appendChild(item);
    });
  }

  function renderTips() {
    tipsList.innerHTML = '';
    [...(tourismContent?.tips ?? []), ...(tourismContent?.facts ?? []), ...(tourismContent?.glossary ?? []).map((item) => `${item.term}: ${item.meaning}`)].forEach((text) => {
      const item = document.createElement('p');
      item.textContent = text;
      tipsList.appendChild(item);
    });
  }
  setGuidebook(landmarks[0]);
  renderTips();

  if (joystick && stick) {
    const radius = 46;
    let activePointerId = null;
    let origin = { x: 0, y: 0 };

    const setStick = (x, y) => {
      const distance = Math.hypot(x, y);
      const limited = distance > radius ? radius / distance : 1;
      const dx = x * limited;
      const dy = y * limited;
      const axisX = dx / radius;
      const axisY = -dy / radius;
      stick.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;
      player.setVirtualAxis(axisX, axisY);
      trainSystem.wake();
      requestRender();
    };

    const resetStick = () => {
      activePointerId = null;
      stick.style.transform = 'translate(-50%, -50%)';
      player.setVirtualAxis(0, 0);
      joystick.classList.remove('is-active');
      requestRender();
    };

    joystick.addEventListener('pointerdown', (event) => {
      event.preventDefault();
      activePointerId = event.pointerId;
      joystick.setPointerCapture?.(event.pointerId);
      const rect = joystick.getBoundingClientRect();
      origin = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
      joystick.classList.add('is-active');
      setStick(event.clientX - origin.x, event.clientY - origin.y);
    });

    joystick.addEventListener('pointermove', (event) => {
      if (event.pointerId !== activePointerId) return;
      event.preventDefault();
      setStick(event.clientX - origin.x, event.clientY - origin.y);
    });

    joystick.addEventListener('pointerup', (event) => {
      if (event.pointerId !== activePointerId) return;
      event.preventDefault();
      joystick.releasePointerCapture?.(event.pointerId);
      resetStick();
    });

    joystick.addEventListener('pointercancel', resetStick);
    joystick.addEventListener('lostpointercapture', resetStick);
    keepTouchOnOverlay(joystick);
  }

  let toastTimer = 0;
  function showToast(message) {
    toast.textContent = message;
    toast.style.opacity = '1';
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.style.opacity = '0.75';
    }, 2200);
  }

  const formatCompact = (value) => (Number.isFinite(value) ? Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(value) : '--');
  let baseVisibleVoxelCount = 0;

  function setVoxelStats(stats) {
    baseVisibleVoxelCount = stats.total;
    const generated = stats.generatedDetail;
    const generatedVisible = generated?.visibleRendered ?? 0;
    voxelCountEl.textContent = formatCompact(baseVisibleVoxelCount + generatedVisible);
    if (!generated) return;
    generatedAuthoredEl.textContent = formatCompact(generated.authoredTotal);
    totalAuthoredEl.textContent = formatCompact(stats.total + generated.authoredTotal);
    visibleBudgetEl.textContent = formatCompact(generated.visibleBudget);
  }

  function setProgress(progress) {
    stampCountEl.textContent = `${progress.count}/${progress.total}`;
    landmarks.forEach((landmark) => {
      landmarkButtons.get(landmark.name)?.classList.toggle('is-visited', progress.isVisited(landmark));
    });
    renderQuests();
  }

  function setTour({ active, nextName, distance, progressText }) {
    const tourButton = document.getElementById('btn-tour');
    tourButton.textContent = active ? 'Cancel Tour' : 'Start KL Tour';
    tourStateEl.textContent = progressText ?? 'Off';
    tourNextEl.textContent = active && nextName ? `Next destination: ${nextName} · ${Math.round(distance)}m` : 'Next destination: none';
  }

  function setTimeMode(mode) {
    document.getElementById('btn-time').textContent = mode;
  }

  function setBoardTrainAvailable(available) {
    boardTrainButton.hidden = !available;
  }

  function update({ fps, pixelRatio, running, trainsActive, generatedDetail }) {
    fpsEl.textContent = fps > 0 ? String(Math.round(fps)) : '--';
    pixelRatioEl.textContent = `${pixelRatio.toFixed(2)}x`;
    renderStateEl.textContent = running ? (trainsActive ? 'Active + transit' : 'Active') : 'Paused';
    if (generatedDetail) {
      const visibleTotal = baseVisibleVoxelCount + generatedDetail.visibleRendered;
      voxelCountEl.textContent = formatCompact(visibleTotal);
      generatedChunksEl.textContent = `${generatedDetail.activeChunks}/${generatedDetail.loadedChunks}`;
      generatedVisibleEl.textContent = `${formatCompact(generatedDetail.visibleRendered)}/${formatCompact(generatedDetail.visibleAuthored)}`;
      generatedAuthoredEl.textContent = formatCompact(generatedDetail.authoredTotal);
      visibleBudgetEl.textContent = formatCompact(generatedDetail.visibleBudget);
    }
  }

  return {
    setVoxelStats,
    setProgress,
    setTour,
    setTimeMode,
    setBoardTrainAvailable,
    update,
    showToast,
    setGuidebook,
    renderQuests
  };
}

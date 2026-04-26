export function setupPhotoMode({ renderer, scene, camera, controls, hudRoot, landmarks, applyPreset, requestRender, showToast }) {
  const root = document.getElementById('photo-mode');
  const toggle = document.getElementById('btn-photo-mode');
  const exit = document.getElementById('btn-photo-exit');
  const shot = document.getElementById('btn-photo-shot');
  const fov = document.getElementById('photo-fov');
  const presets = document.getElementById('photo-presets');
  let active = false;

  const presetNames = ['Skyline', 'Petronas', 'Merdeka', 'KL Tower', 'Tour Poster'];
  presetNames.forEach((name) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = name;
    button.addEventListener('click', () => {
      const landmark = landmarks.find((item) => item.name.includes(name.replace('KL Tower', 'KL Tower').replace('Merdeka', 'Merdeka 118')));
      applyPreset(name, landmark);
      showToast(`Photo preset: ${name}`);
      requestRender();
    });
    presets.appendChild(button);
  });

  function setActive(value) {
    active = value;
    root.hidden = !active;
    hudRoot.classList.toggle('is-photo-clean', active);
    showToast(active ? 'Photo mode enabled.' : 'Photo mode closed.');
    requestRender();
  }

  toggle.addEventListener('click', () => setActive(true));
  exit.addEventListener('click', () => setActive(false));
  fov.addEventListener('input', () => {
    camera.fov = Number(fov.value);
    camera.updateProjectionMatrix();
    requestRender();
  });
  shot.addEventListener('click', () => {
    controls.update();
    renderer.render(scene, camera);
    const data = renderer.domElement.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = data;
    link.download = `voxel-kl-${Date.now()}.png`;
    if ('download' in link) link.click();
    else window.open(data, '_blank', 'noopener');
  });

  return { setActive, get active() { return active; } };
}

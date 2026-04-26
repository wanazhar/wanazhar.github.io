import { captionForLandmark } from '../data/postcards.js';

export function setupPhotoMode({ renderer, scene, camera, controls, hudRoot, landmarks, postcards, getCurrentLandmark, getTimeMode, applyPreset, requestRender, showToast, onCapture }) {
  const root = document.getElementById('photo-mode');
  const toggle = document.getElementById('btn-photo-mode');
  const exit = document.getElementById('btn-photo-exit');
  const shot = document.getElementById('btn-photo-shot');
  const fov = document.getElementById('photo-fov');
  const presets = document.getElementById('photo-presets');
  const template = document.getElementById('postcard-template');
  const caption = document.getElementById('postcard-caption');
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

  postcards?.forEach((item) => {
    const option = document.createElement('option');
    option.value = item.id;
    option.textContent = item.name;
    template.appendChild(option);
  });

  function updateCaption() {
    const selected = postcards?.find((item) => item.id === template.value);
    caption.textContent = selected?.caption ?? captionForLandmark(getCurrentLandmark?.(), getTimeMode?.());
  }
  template.addEventListener('change', updateCaption);
  updateCaption();

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
    onCapture?.({ postcardId: template.value, caption: caption.textContent });
    showToast(`Postcard captured: ${caption.textContent}`);
  });

  return { setActive, get active() { return active; } };
}

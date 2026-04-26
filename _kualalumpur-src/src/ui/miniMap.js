export function setupMiniMap({ canvas, terrain, landmarks, player, onLandmarkClick }) {
  const ctx = canvas.getContext('2d');
  const size = 180;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const dots = [];

  function resize() {
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function toMap(position) {
    const span = terrain.max - terrain.min;
    return {
      x: ((position.x - terrain.min) / span) * size,
      y: ((position.z - terrain.min) / span) * size
    };
  }

  function draw({ nextLandmark, visited }) {
    dots.length = 0;
    ctx.clearRect(0, 0, size, size);
    ctx.fillStyle = 'rgba(5, 12, 24, 0.72)';
    ctx.fillRect(0, 0, size, size);
    ctx.strokeStyle = 'rgba(255,255,255,0.12)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i += 1) {
      const p = (i / 4) * size;
      ctx.beginPath();
      ctx.moveTo(p, 0);
      ctx.lineTo(p, size);
      ctx.moveTo(0, p);
      ctx.lineTo(size, p);
      ctx.stroke();
    }

    for (const landmark of landmarks) {
      const p = toMap(landmark.position);
      const isNext = nextLandmark?.name === landmark.name;
      dots.push({ landmark, x: p.x, y: p.y });
      ctx.fillStyle = visited?.(landmark) ? '#ffd166' : '#68e1fd';
      ctx.strokeStyle = isNext ? '#ffffff' : 'rgba(0,0,0,0.45)';
      ctx.lineWidth = isNext ? 3 : 1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, isNext ? 5.5 : 3.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }

    const p = toMap(player.group.position);
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(player.heading);
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(0, -8);
    ctx.lineTo(5, 6);
    ctx.lineTo(0, 3);
    ctx.lineTo(-5, 6);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    ctx.fillStyle = 'rgba(255,255,255,0.82)';
    ctx.font = '700 11px system-ui, sans-serif';
    ctx.fillText('N', size - 17, 16);
  }

  canvas.addEventListener('pointerdown', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const hit = dots.find((dot) => Math.hypot(dot.x - x, dot.y - y) < 10);
    if (hit) onLandmarkClick?.(hit.landmark);
  });

  resize();
  window.addEventListener('resize', resize);

  return { draw };
}

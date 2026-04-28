import './styles.css';
import { Game } from './core/Game.js';

const root = document.getElementById('app');
const game = new Game(root);

game.start().catch((error) => {
  console.error(error);
  root.innerHTML = `
    <main style="display:grid;place-items:center;height:100%;padding:24px;background:#f7f4ed;color:#0d0d0d;font-family:system-ui,sans-serif">
      <section style="max-width:720px;border:1px solid #0d0d0d;padding:24px;background:#fff">
        <p style="text-transform:uppercase;letter-spacing:.18em;font-size:11px;margin:0 0 12px">Emir's Car World failed to start</p>
        <pre style="white-space:pre-wrap;font-size:12px">${error?.stack || error}</pre>
      </section>
    </main>
  `;
});

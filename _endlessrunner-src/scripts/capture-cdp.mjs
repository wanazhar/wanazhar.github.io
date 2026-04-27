import fs from 'node:fs/promises';

const [,, url, out, widthArg = '1440', heightArg = '900', waitArg = '2500'] = process.argv;
if (!url || !out) throw new Error('Usage: node capture-cdp.mjs <url> <out.png> [width] [height] [waitMs]');

const width = Number(widthArg);
const height = Number(heightArg);
const waitMs = Number(waitArg);

async function delay(ms) { return new Promise((resolve) => setTimeout(resolve, ms)); }

async function fetchJson(url, options) {
  const res = await fetch(url, options);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}: ${await res.text()}`);
  return res.json();
}

async function waitForChrome() {
  for (let i = 0; i < 120; i += 1) {
    try {
      return await fetchJson('http://127.0.0.1:9222/json/version');
    } catch {
      await delay(250);
    }
  }
  throw new Error('Chrome DevTools endpoint did not become ready');
}

function connect(wsUrl) {
  const ws = new WebSocket(wsUrl);
  let nextId = 1;
  const pending = new Map();
  const listeners = new Map();

  ws.addEventListener('message', (event) => {
    const message = JSON.parse(event.data);
    if (message.id && pending.has(message.id)) {
      const { resolve, reject } = pending.get(message.id);
      pending.delete(message.id);
      if (message.error) reject(new Error(JSON.stringify(message.error)));
      else resolve(message.result);
      return;
    }
    if (message.method && listeners.has(message.method)) {
      for (const listener of listeners.get(message.method)) listener(message.params);
    }
  });

  return new Promise((resolve, reject) => {
    ws.addEventListener('open', () => {
      resolve({
        send(method, params = {}) {
          const id = nextId++;
          ws.send(JSON.stringify({ id, method, params }));
          return new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
        },
        on(method, listener) {
          if (!listeners.has(method)) listeners.set(method, new Set());
          listeners.get(method).add(listener);
        },
        close() { ws.close(); }
      });
    }, { once: true });
    ws.addEventListener('error', reject, { once: true });
  });
}

await waitForChrome();
const target = await fetchJson(`http://127.0.0.1:9222/json/new?${encodeURIComponent(url)}`, { method: 'PUT' });
const cdp = await connect(target.webSocketDebuggerUrl);
const consoleMessages = [];
cdp.on('Runtime.consoleAPICalled', (params) => {
  consoleMessages.push(params.args.map((arg) => arg.value ?? arg.description ?? '').join(' '));
});
cdp.on('Runtime.exceptionThrown', (params) => {
  consoleMessages.push(`EXCEPTION: ${params.exceptionDetails?.text ?? 'unknown'} ${params.exceptionDetails?.exception?.description ?? ''}`);
});

await cdp.send('Page.enable');
await cdp.send('Runtime.enable');
await cdp.send('Emulation.setDeviceMetricsOverride', {
  width,
  height,
  deviceScaleFactor: 1,
  mobile: false
});
await cdp.send('Page.bringToFront');
await delay(waitMs);
const state = await cdp.send('Runtime.evaluate', {
  expression: 'window.__runnerGame ? window.__runnerGame.stateManager.getState() : null',
  returnByValue: true
});
console.log('State:', JSON.stringify(state.result.value));
if (consoleMessages.length) console.log(consoleMessages.join('\n'));
const result = await cdp.send('Page.captureScreenshot', { format: 'png', fromSurface: true, captureBeyondViewport: false });
await fs.writeFile(out, Buffer.from(result.data, 'base64'));
cdp.close();
process.exit(0);

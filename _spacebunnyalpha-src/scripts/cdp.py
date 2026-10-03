#!/usr/bin/env python3
"""A small, correct Chrome DevTools Protocol client.

Hand-rolling WebSocket framing worked for a handful of calls and then
desynchronised: unsolicited CDP events arrive interleaved with responses, and
once responses are read out of order every later lookup returns the wrong
payload. That surfaced as valid JavaScript evaluations intermittently failing
with "Uncaught".

This uses the `websockets` library and pairs request ids to responses properly,
so events are drained and discarded rather than confusing the caller.

Also provides the helpers the visual tooling needs: wait-for-readiness,
evaluate, and screenshot.
"""

import asyncio
import base64
import json
import urllib.request

DEBUG = "http://127.0.0.1:9222"


class Browser:
    def __init__(self):
        self.proc = None
        self.ws = None
        self._id = 0
        self._pending = {}
        self._pump = None

    async def __aenter__(self):
        await self.connect()
        return self

    async def __aexit__(self, *exc):
        await self.close()

    async def connect(self, url):
        req = urllib.request.Request(f"{DEBUG}/json/new?{url}", method="PUT")
        self.proc = json.load(urllib.request.urlopen(req, timeout=20))
        import websockets

        self.ws = await websockets.connect(
            self.proc["webSocketDebuggerUrl"], max_size=64 * 1024 * 1024, ping_interval=None
        )
        # One reader task owns the socket; every response is routed to whoever
        # is waiting on its id, and events are dropped.
        self._pump = asyncio.create_task(self._read_loop())
        await self.call("Runtime.enable")
        return self

    async def _read_loop(self):
        try:
            async for raw in self.ws:
                try:
                    msg = json.loads(raw)
                except Exception:
                    continue
                ident = msg.get("id")
                if ident is None:
                    # An event. Nobody is waiting on it.
                    continue
                fut = self._pending.pop(ident, None)
                if fut is not None and not fut.done():
                    fut.set_result(msg)
        except Exception:
            pass

    async def call(self, method, params=None, timeout=60):
        self._id += 1
        ident = self._id
        fut = asyncio.get_running_loop().create_future()
        self._pending[ident] = fut
        payload = {"id": ident, "method": method}
        if params:
            payload["params"] = params
        await self.ws.send(json.dumps(payload))
        try:
            return await asyncio.wait_for(fut, timeout=timeout)
        except asyncio.TimeoutError:
            self._pending.pop(ident, None)
            raise

    async def evaluate(self, expr, timeout=60):
        msg = await self.call(
            "Runtime.evaluate",
            {"expression": expr, "returnByValue": True, "awaitPromise": True},
            timeout=timeout,
        )
        result = msg.get("result", {})
        if result.get("exceptionDetails"):
            return {"__error__": result["exceptionDetails"].get("text")}
        return result.get("result", {}).get("value")

    # The debug browser is shared with other work on this machine, and its
    # socket does drop mid-session. One retry turns a dead connection into a
    # slow call rather than a cascade of fake "Uncaught" errors, which look
    # exactly like application bugs and are not.
    async def try_evaluate(self, expr, attempts=3, timeout=60):
        for attempt in range(attempts):
            try:
                value = await self.evaluate(expr, timeout=timeout)
                if value is not None and not (isinstance(value, dict) and value.get("__error__")):
                    return value
            except Exception as exc:
                if attempt == attempts - 1:
                    return {"__error__": f"cdp dropped: {type(exc).__name__}"}
                await asyncio.sleep(1.5)
        return value

    async def screenshot(self, path):
        msg = await self.call("Page.captureScreenshot", {"format": "png"}, timeout=90)
        with open(path, "wb") as f:
            f.write(base64.b64decode(msg["result"]["data"]))

    async def close(self):
        try:
            if self._pump:
                self._pump.cancel()
            if self.ws:
                await self.ws.close()
            if self.proc:
                urllib.request.urlopen(
                    urllib.request.Request(f"{DEBUG}/json/close/{self.proc['id']}"), timeout=5
                )
        except Exception:
            pass


async def open_game(url, ready_timeout=120):
    """Opens the game, waits for it to boot, and dismisses the title card."""
    b = Browser()
    await b.connect(url)
    await b.call("Page.navigate", {"url": url})

    loop = asyncio.get_running_loop()
    deadline = loop.time() + ready_timeout
    while loop.time() < deadline:
        ready = await b.try_evaluate(
            "!!document.querySelector('.title-start') && typeof window.__sba === 'object'",
            attempts=1,
            timeout=15,
        )
        if ready is True:
            break
        await asyncio.sleep(1.5)
    else:
        raise RuntimeError("the game never became ready")

    await b.try_evaluate("document.querySelector('.title-start').click()", attempts=2, timeout=20)
    await settle(b, 30)
    return b


async def settle(b, frames=45):
    """Pumps requestAnimationFrame.

    Headless Chrome throttles rAF to roughly 1fps, so waiting on wall-clock time
    does not advance the game. Driving frames from inside the page in one shot is
    far quicker than round-tripping each frame over CDP: a single evaluate
    walks N frames and resolves when they have all run.
    """
    if frames <= 0:
        return
    try:
        await b.try_evaluate(
            f"""new Promise(resolve => {{
              let n = 0;
              const tick = () => {{
                n += 1;
                if (n >= {frames}) return resolve(n);
                requestAnimationFrame(tick);
              }};
              requestAnimationFrame(tick);
            }})""",
            timeout=max(20, frames * 0.6),
        )
    except Exception:
        pass
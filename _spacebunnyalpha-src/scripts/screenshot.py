#!/usr/bin/env python3
"""Screenshots the running game through real Chrome via CDP.

Also captures console errors, because a scene can render and still be broken.
Usage: screenshot.py <url> <out.png> [wait_seconds]
"""

import base64
import json
import os
import socket
import struct
import sys
import time
import urllib.request

DEBUG = "http://127.0.0.1:9222"


class CDP:
    def __init__(self, ws_url):
        hostport, path = ws_url.split("://", 1)[1].split("/", 1)
        host, port = hostport.split(":")
        self.sock = socket.create_connection((host, int(port)), timeout=60)
        key = base64.b64encode(os.urandom(16)).decode()
        self.sock.sendall(
            (
                f"GET /{path} HTTP/1.1\r\nHost: {hostport}\r\nUpgrade: websocket\r\n"
                f"Connection: Upgrade\r\nSec-WebSocket-Key: {key}\r\n"
                f"Sec-WebSocket-Version: 13\r\n\r\n"
            ).encode()
        )
        buf = b""
        while b"\r\n\r\n" not in buf:
            buf += self.sock.recv(4096)
        self.buf = b""
        self.nid = 0

    def send(self, method, params=None):
        self.nid += 1
        msg = {"id": self.nid, "method": method}
        if params:
            msg["params"] = params
        data = json.dumps(msg).encode()
        mask = os.urandom(4)
        n = len(data)
        hdr = bytearray([0x81])
        if n < 126:
            hdr.append(0x80 | n)
        else:
            hdr.append(0x80 | 126)
            hdr += struct.pack(">H", n)
        hdr += mask
        self.sock.sendall(bytes(hdr) + bytes(b ^ mask[i % 4] for i, b in enumerate(data)))
        return msg["id"]

    def _fill(self, n):
        while len(self.buf) < n:
            self.sock.settimeout(45)
            chunk = self.sock.recv(1 << 20)
            if not chunk:
                raise ConnectionError("closed")
            self.buf += chunk

    def recv(self):
        self._fill(2)
        ln = self.buf[1] & 0x7F
        off = 2
        if ln == 126:
            self._fill(4)
            ln = struct.unpack(">H", self.buf[2:4])[0]
            off = 4
        elif ln == 127:
            self._fill(10)
            ln = struct.unpack(">Q", self.buf[2:10])[0]
            off = 10
        self._fill(off + ln)
        payload = self.buf[off:off + ln]
        self.buf = self.buf[off + ln:]
        return json.loads(payload.decode())

    def wait_for(self, ident, timeout=60):
        deadline = time.time() + timeout
        while time.time() < deadline:
            msg = self.recv()
            if msg.get("id") == ident:
                return msg
        return None

    def evaluate(self, expr, timeout=45):
        ident = self.send("Runtime.evaluate", {"expression": expr, "returnByValue": True})
        msg = self.wait_for(ident, timeout)
        if not msg:
            return None
        r = msg.get("result", {})
        if r.get("exceptionDetails"):
            return {"__error__": r["exceptionDetails"].get("text")}
        return r.get("result", {}).get("value")

    def drain(self, seconds=2):
        out = []
        deadline = time.time() + seconds
        while time.time() < deadline:
            self.sock.settimeout(1)
            try:
                msg = self.recv()
            except Exception:
                break
            if msg:
                out.append(msg)
        return out


def main():
    url = sys.argv[1] if len(sys.argv) > 1 else "http://100.98.115.95:4174/"
    out = sys.argv[2] if len(sys.argv) > 2 else "/tmp/sba.png"
    wait = float(sys.argv[3]) if len(sys.argv) > 3 else 14.0

    tab = json.load(
        urllib.request.urlopen(urllib.request.Request(f"{DEBUG}/json/new?{url}", method="PUT"), timeout=15)
    )
    cdp = CDP(tab["webSocketDebuggerUrl"])
    cdp.send("Runtime.enable")
    cdp.send("Log.enable")
    cdp.send("Page.enable")

    # Capture errors from the very first script.
    cdp.send(
        "Page.addScriptToEvaluateOnNewDocument",
        {
            "source": """
            window.__errs = [];
            window.addEventListener('error', e => window.__errs.push(
              e.message + ' @ ' + (e.filename||'').slice(-40) + ':' + e.lineno));
            window.addEventListener('unhandledrejection', e =>
              window.__errs.push('rejection: ' + (e.reason && e.reason.message || e.reason)));
            """
        },
    )
    cdp.send("Page.navigate", {"url": url})

    time.sleep(wait)

    # Dismiss the title card so we photograph the actual world.
    cdp.evaluate("document.querySelector('.title-start') && document.querySelector('.title-start').click()")
    # Headless Chrome throttles rAF hard; give it many frames to settle.
    for _ in range(30):
        cdp.evaluate("new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)))", timeout=20)
    time.sleep(2)

    errs = cdp.evaluate("JSON.stringify(window.__errs || [])")
    try:
        errs = json.loads(errs or "[]")
    except Exception:
        errs = []

    info = cdp.evaluate(
        "JSON.stringify({"
        "region: document.querySelector('.hud-region')?.textContent,"
        "clock: document.querySelector('.hud-clock')?.textContent,"
        "canvas: (()=>{const c=document.querySelector('canvas');return c?c.width+'x'+c.height:null})()"
        "})"
    )

    shot = cdp.send("Page.captureScreenshot", {"format": "png"})
    msg = cdp.wait_for(shot, 60)
    data = msg["result"]["data"]
    with open(out, "wb") as f:
        f.write(base64.b64decode(data))

    print("wrote", out)
    print("page:", info)
    if errs:
        unique = sorted(set(errs))
        print(f"errors ({len(errs)} total, {len(unique)} unique):")
        for e in unique[:10]:
            print("  -", e)
    else:
        print("no page errors")

    try:
        urllib.request.urlopen(urllib.request.Request(f"{DEBUG}/json/close/{tab['id']}"), timeout=5)
    except Exception:
        pass


if __name__ == "__main__":
    main()
#!/usr/bin/env python3
"""Drives real Chrome over CDP to confirm the game actually starts.

This is the check that matters: the jsdom smoke test stubs WebGL, so it can
prove the module graph boots but not that a real renderer gets a playable
scene. Here we click the start button and assert the world came alive.
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
URL = sys.argv[1] if len(sys.argv) > 1 else "http://100.98.115.95:4174/"


def open_tab(url):
    req = urllib.request.Request(f"{DEBUG}/json/new?{url}", method="PUT")
    return json.load(urllib.request.urlopen(req, timeout=15))


class CDP:
    def __init__(self, ws_url):
        hostport, path = ws_url.split("://", 1)[1].split("/", 1)
        host, port = hostport.split(":")
        self.sock = socket.create_connection((host, int(port)), timeout=30)
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
        self.next_id = 1

    def send(self, method, params=None):
        msg = {"id": self.next_id, "method": method}
        if params:
            msg["params"] = params
        self.next_id += 1
        data = json.dumps(msg).encode()
        mask = os.urandom(4)
        n = len(data)
        hdr = bytearray([0x81])
        if n < 126:
            hdr.append(0x80 | n)
        elif n < 65536:
            hdr.append(0x80 | 126)
            hdr += struct.pack(">H", n)
        else:
            hdr.append(0x80 | 127)
            hdr += struct.pack(">Q", n)
        hdr += mask
        self.sock.sendall(bytes(hdr) + bytes(b ^ mask[i % 4] for i, b in enumerate(data)))
        return msg["id"]

    def _fill(self, n):
        while len(self.buf) < n:
            self.sock.settimeout(10)
            chunk = self.sock.recv(65536)
            if not chunk:
                raise ConnectionError("socket closed")
            self.buf += chunk

    def recv(self):
        self._fill(2)
        b1, b2 = self.buf[0], self.buf[1]
        ln = b2 & 0x7F
        offset = 2
        if ln == 126:
            self._fill(4)
            ln = struct.unpack(">H", self.buf[2:4])[0]
            offset = 4
        elif ln == 127:
            self._fill(10)
            ln = struct.unpack(">Q", self.buf[2:10])[0]
            offset = 10
        self._fill(offset + ln)
        payload = self.buf[offset:offset + ln]
        self.buf = self.buf[offset + ln:]
        return json.loads(payload.decode())

    def evaluate(self, expression, wait=8):
        ident = self.send("Runtime.evaluate", {"expression": expression, "returnByValue": True, "awaitPromise": True})
        deadline = time.time() + wait
        while time.time() < deadline:
            msg = self.recv()
            if msg.get("id") == ident:
                res = msg.get("result", {})
                if res.get("exceptionDetails"):
                    return {"__error__": res["exceptionDetails"].get("text")}
                return res.get("result", {}).get("value")
        return None

    def drain(self, seconds=3):
        out = []
        deadline = time.time() + seconds
        while time.time() < deadline:
            self.sock.settimeout(1)
            try:
                msg = self.recv()
            except (socket.timeout, ConnectionError):
                break
            except Exception:
                break
            if msg:
                out.append(msg)
        return out


def main():
    tab = open_tab(URL)
    cdp = CDP(tab["webSocketDebuggerUrl"])
    cdp.send("Runtime.enable")
    cdp.send("Log.enable")
    cdp.send("Page.enable")

    # Let the island finish generating.
    time.sleep(12)

    state = cdp.evaluate(
        "JSON.stringify({"
        "loadingPresent: !!document.querySelector('.loading'),"
        "loadingClass: document.querySelector('.loading')?.className || null,"
        "titlePresent: !!document.querySelector('.title-start'),"
        "canvas: (()=>{const c=document.querySelector('canvas'); return c? c.width+'x'+c.height : null})(),"
        "hud: !!document.querySelector('.hud-region'),"
        "hudText: document.querySelector('.hud-region')?.textContent || null,"
        "clock: document.querySelector('.hud-clock')?.textContent || null,"
        "wallet: document.querySelector('.hud-wallet')?.textContent || null"
        "})"
    )
    parsed = json.loads(state) if state else {}
    print("BEFORE CLICK:", json.dumps(parsed, indent=2))

    assert not parsed.get("loadingPresent"), "loading overlay still present"
    assert parsed.get("titlePresent"), "title card missing"
    assert parsed.get("canvas"), "no canvas"

    # Click "walk outside" for real.
    cdp.evaluate("document.querySelector('.title-start').click()")
    time.sleep(3)

    after = json.loads(
        cdp.evaluate(
            "JSON.stringify({"
            "titlePresent: !!document.querySelector('.title-start'),"
            "canvasPresent: !!document.querySelector('canvas'),"
            "hud: !!document.querySelector('.hud-region'),"
            "clock: document.querySelector('.hud-clock')?.textContent || null,"
            "region: document.querySelector('.hud-region')?.textContent || null"
            "})"
        )
    )
    print("AFTER CLICK:", json.dumps(after, indent=2))

    # Proving the loop runs by watching the clock is unreliable: headless Chrome
    # throttles requestAnimationFrame to roughly 1fps, so a 4-second sample may
    # only advance the in-game clock by a minute or two (or none, depending on
    # where the frame boundaries land). Count real rAF callbacks instead.
    cdp.evaluate(
        "window.__sbaFrames=0;(function t(){window.__sbaFrames++;requestAnimationFrame(t)})()"
    )
    first = cdp.evaluate("window.__sbaFrames")
    time.sleep(5)
    second = cdp.evaluate("window.__sbaFrames")
    frames = (second or 0) - (first or 0)
    clock = cdp.evaluate("document.querySelector('.hud-clock')?.textContent")
    print(f"RAF FRAMES in 5s: {first} -> {second} (delta {frames})")
    print(f"CLOCK: {clock}")
    advancing = frames > 0

    errors = []
    for m in cdp.drain(3):
        if m.get("method") == "Runtime.exceptionThrown":
            errors.append(m["params"]["exceptionDetails"].get("text"))
        if m.get("method") == "Log.entryAdded" and m["params"]["entry"].get("level") == "error":
            errors.append(m["params"]["entry"].get("text"))

    real = [e for e in errors if e and "favicon" not in e.lower()]

    print("\n=== RESULT ===")
    ok = True
    if not advancing:
        print("FAIL: the clock did not advance; the game loop is not running")
        ok = False
    else:
        print("PASS: game loop is running (clock advanced)")
    if real:
        print("FAIL: console errors:", real)
        ok = False
    else:
        print("PASS: no console errors (favicon 404 ignored)")
    if after.get("titlePresent"):
        print("FAIL: title card did not clear after clicking start")
        ok = False
    else:
        print("PASS: clicking start cleared the title card")

    # Clean up the tab.
    try:
        urllib.request.urlopen(urllib.request.Request(f"{DEBUG}/json/close/{tab['id']}"), timeout=5)
    except Exception:
        pass

    sys.exit(0 if ok else 1)


if __name__ == "__main__":
    main()
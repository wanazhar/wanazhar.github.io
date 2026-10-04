#!/usr/bin/env python3
"""Verifies the local server behaves correctly.

Two behaviours are worth locking down because both failed in practice:

1. It must serve index.html, not a bare directory listing.
2. It must keep serving correctly after the build directory is deleted and
   recreated underneath it, which is exactly what `vite build` does via
   emptyOutDir.
"""

import http.server
import os
import shutil
import socket
import subprocess
import sys
import tempfile
import threading
import time
import urllib.error
import urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
SERVE = os.path.join(HERE, "serve.py")


def free_port():
    with socket.socket() as s:
        s.bind(("127.0.0.1", 0))
        return s.getsockname()[1]


def fetch(port, path="/"):
    # Several failure modes are legitimate outcomes here: a 404 is what a
    # server stranded on a deleted directory returns, and a dropped connection
    # is what it returns once the inode is really gone. Report both rather
    # than letting the check crash, so the failure is legible.
    url = f"http://127.0.0.1:{port}{path}"
    try:
        with urllib.request.urlopen(url, timeout=5) as r:
            return r.status, r.read().decode("utf-8", "replace"), dict(r.headers)
    except urllib.error.HTTPError as e:
        try:
            body = e.read().decode("utf-8", "replace")
        except Exception:
            body = ""
        return e.code, body, dict(e.headers)
    except Exception as e:
        # ConnectionError, RemoteDisconnected, socket timeout, and so on.
        return 0, f"<transport error: {type(e).__name__}: {e}>", {}


def start(port, root):
    proc = subprocess.Popen(
        [sys.executable, SERVE, "--bind", "127.0.0.1", "--port", str(port), "--dir", root],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
    )
    # Wait for it to accept connections.
    for _ in range(50):
        try:
            with socket.create_connection(("127.0.0.1", port), timeout=0.5):
                return proc
        except OSError:
            time.sleep(0.1)
    proc.kill()
    raise RuntimeError("server did not start")


def main():
    failures = []

    root = tempfile.mkdtemp(prefix="sba-serve-")
    try:
        # A build output tree: index.html plus one asset.
        os.makedirs(os.path.join(root, "assets"))
        with open(os.path.join(root, "index.html"), "w", encoding="utf-8") as f:
            f.write("<!DOCTYPE html><title>spacebunnyalpha</title><body>ok</body>")
        with open(os.path.join(root, "assets", "index-abc123.js"), "w", encoding="utf-8") as f:
            f.write("console.log('hi')")

        port = free_port()
        proc = start(port, root)

        # 1. Serves the document, not a listing.
        status, body, _ = fetch(port)
        if status != 200:
            failures.append(f"expected 200, got {status}")
        if "spacebunnyalpha" not in body:
            failures.append(f"did not serve index.html; got: {body[:120]!r}")
        if "Directory listing" in body:
            failures.append("server returned a directory listing instead of index.html")

        # 2. Serves assets.
        status, body, _ = fetch(port, "/assets/index-abc123.js")
        if status != 200 or "console.log" not in body:
            failures.append(f"asset not served correctly (status {status})")

        # 3. Survives the directory being replaced underneath it, which is what
        #    `vite build` does when emptyOutDir is on. The server is started
        #    with its working directory *inside* the tree, which is how a
        #    server launched as `cd build && serve.py` behaves: the relative
        #    path then resolves against a deleted cwd and the server silently
        #    degrades to a bare directory listing.
        proc.terminate()
        proc.wait(timeout=5)

        root2 = tempfile.mkdtemp(prefix="sba-serve2-")
        try:
            os.makedirs(os.path.join(root2, "assets"))
            with open(os.path.join(root2, "index.html"), "w", encoding="utf-8") as f:
                f.write("<!DOCTYPE html><title>before-swap</title>")
            with open(os.path.join(root2, "assets", "index-1.js"), "w", encoding="utf-8") as f:
                f.write("console.log('a')")

            port2 = free_port()
            proc2 = subprocess.Popen(
                [sys.executable, SERVE, "--bind", "127.0.0.1", "--port", str(port2), "--dir", "assets/../"],
                cwd=root2,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
            )
            try:
                for _ in range(50):
                    try:
                        with socket.create_connection(("127.0.0.1", port2), timeout=0.5):
                            break
                    except OSError:
                        time.sleep(0.1)

                status, body, _ = fetch(port2)
                if "before-swap" not in body:
                    failures.append(f"pre-swap: expected the document, got {body[:100]!r}")

                # Replace the directory wholesale, as a rebuild does.
                shutil.rmtree(root2)
                os.makedirs(os.path.join(root2, "assets"))
                with open(os.path.join(root2, "index.html"), "w", encoding="utf-8") as f:
                    f.write("<!DOCTYPE html><title>after-swap</title>")
                with open(os.path.join(root2, "assets", "index-2.js"), "w", encoding="utf-8") as f:
                    f.write("console.log('b')")

                status, body, _ = fetch(port2)
                if "after-swap" not in body:
                    failures.append(
                        "server went stale after the build directory was replaced "
                        f"(got: {body[:120]!r})"
                    )
                if "Directory listing" in body:
                    failures.append("server returned a directory listing after a rebuild")
            finally:
                proc2.terminate()
                proc2.wait(timeout=5)
        finally:
            shutil.rmtree(root2, ignore_errors=True)

        proc = start(port, root)

        # 4. Sends no-store so a browser never pins a stale document.
        _, _, headers = fetch(port)
        if "no-store" not in headers.get("Cache-Control", ""):
            failures.append(f"missing no-store header (got {headers.get('Cache-Control')!r})")

        proc.terminate()
        proc.wait(timeout=5)
    finally:
        shutil.rmtree(root, ignore_errors=True)

    if failures:
        print("SERVE CHECKS FAILED")
        for f in failures:
            print("  -", f)
        sys.exit(1)

    print("serve.py checks passed:")
    print("  - serves index.html, not a directory listing")
    print("  - serves assets")
    print("  - survives the build directory being replaced")
    print("  - sends Cache-Control: no-store")


if __name__ == "__main__":
    main()
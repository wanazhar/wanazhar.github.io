#!/usr/bin/env python3
"""Static server for spacebunnyalpha, tuned for local/tailnet play.

Two details here exist because of real failures, not taste:

1. `Cache-Control: no-store` — iOS Safari aggressively caches a plain static
   index.html, so without this a rebuilt game keeps serving a stale bundle
   reference and a fix appears not to have landed.

2. The document root is re-resolved *per request* rather than captured once at
   startup. Vite builds with `emptyOutDir`, which deletes and recreates the
   output directory. A server holding the original path would keep serving the
   old, now-unlinked inode and fall back to a bare directory listing.

Binds to a single address by default so the server is only reachable on the
address you actually asked for.
"""

import argparse
import http.server
import os
import socketserver
import sys


class Handler(http.server.SimpleHTTPRequestHandler):
    # Absolute path to serve. Assigned by main().
    root = "/"

    def translate_path(self, path):
        # Re-resolve every request so a rebuild that replaces the directory
        # does not strand us on a stale handle.
        self.directory = self.root
        return super().translate_path(path)

    def end_headers(self):
        # Never let a browser reuse a stale document or asset.
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        self.send_header("X-Content-Type-Options", "nosniff")
        super().end_headers()

    def log_message(self, fmt, *args):
        sys.stderr.write("%s %s\n" % (self.address_string(), fmt % args))


class Server(socketserver.ThreadingTCPServer):
    allow_reuse_address = True
    daemon_threads = True


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--bind", default="127.0.0.1", help="address to bind (default: 127.0.0.1)")
    parser.add_argument("--port", type=int, default=4174, help="port (default: 4174)")
    parser.add_argument("--dir", default=".", help="directory to serve (default: current)")
    args = parser.parse_args()

    # Store an absolute path so the server does not depend on staying in the
    # same working directory.
    Handler.root = os.path.abspath(args.dir)

    # Detach the process from its original working directory. If it was started
    # from inside the tree being served and a rebuild deletes that tree, the
    # kernel keeps the old directory alive for the process but every new path
    # resolution can then fail in confusing ways. Moving to "/" removes that
    # coupling entirely.
    os.chdir("/")

    if not os.path.isdir(Handler.root):
        print(f"warning: {Handler.root} does not exist yet", file=sys.stderr)

    with Server((args.bind, args.port), Handler) as httpd:
        print(f"serving {Handler.root} at http://{args.bind}:{args.port}/", flush=True)
        httpd.serve_forever()


if __name__ == "__main__":
    main()
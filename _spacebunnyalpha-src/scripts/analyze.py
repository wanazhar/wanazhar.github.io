#!/usr/bin/env python3
"""Reports the colour statistics of a screenshot.

"Looks green" is a subjective claim. This answers it numerically: the dominant
colours, their share of the frame, and their saturation and lightness, which is
where the Ghibli look lives (light and desaturated, not dark and vivid).

Usage: analyze.py <image.png> [--crop x0,y0,x1,y1]
"""

import struct
import sys
import zlib


def read_png(path):
    with open(path, "rb") as f:
        data = f.read()
    assert data[:8] == b"\x89PNG\r\n\x1a\n", "not a PNG"
    pos = 8
    width = height = bitdepth = colortype = None
    idat = b""
    while pos < len(data):
        length = struct.unpack(">I", data[pos:pos + 4])[0]
        ctype = data[pos + 4:pos + 8]
        chunk = data[pos + 8:pos + 8 + length]
        if ctype == b"IHDR":
            width, height, bitdepth, colortype = struct.unpack(">IIBB", chunk[:10])
        elif ctype == b"IDAT":
            idat += chunk
        elif ctype == b"IEND":
            break
        pos += 12 + length
    raw = zlib.decompress(idat)
    channels = {0: 1, 2: 3, 3: 1, 4: 2, 6: 4}[colortype]
    assert bitdepth == 8, f"unsupported bit depth {bitdepth}"
    stride = width * channels
    out = bytearray(height * stride)
    prev = bytearray(stride)
    pos = 0
    for y in range(height):
        ft = raw[pos]
        pos += 1
        line = bytearray(raw[pos:pos + stride])
        pos += stride
        if ft == 1:
            for i in range(channels, stride):
                line[i] = (line[i] + line[i - channels]) & 0xFF
        elif ft == 2:
            for i in range(stride):
                line[i] = (line[i] + prev[i]) & 0xFF
        elif ft == 3:
            for i in range(stride):
                a = line[i - channels] if i >= channels else 0
                line[i] = (line[i] + ((a + prev[i]) >> 1)) & 0xFF
        elif ft == 4:
            for i in range(stride):
                a = line[i - channels] if i >= channels else 0
                b = prev[i]
                c = prev[i - channels] if i >= channels else 0
                p = a + b - c
                pa, pb, pc = abs(p - a), abs(p - b), abs(p - c)
                pr = a if (pa <= pb and pa <= pc) else (b if pb <= pc else c)
                line[i] = (line[i] + pr) & 0xFF
        out[y * stride:(y + 1) * stride] = line
        prev = line
    return width, height, channels, out


def analyse(path, crop=None):
    width, height, channels, px = read_png(path)
    x0, y0, x1, y1 = 0, 0, width, height
    if crop:
        x0, y0, x1, y1 = crop
        x1, y1 = min(x1, width), min(y1, height)

    tally = {}
    total = 0
    sats = []
    lights = []
    hues = {}

    step = max(1, (x1 - x0) // 200)
    for y in range(y0, y1, step):
        for x in range(x0, x1, step):
            i = (y * width + x) * channels
            r, g, b = px[i], px[i + 1], px[i + 2]
            key = (r >> 4, g >> 4, b >> 4)
            tally[key] = tally.get(key, 0) + 1
            total += 1

            mx, mn = max(r, g, b), min(r, g, b)
            l = (mx + mn) / 2 / 255
            lights.append(l)
            if mx == mn:
                sats.append(0.0)
                continue
            # HSL saturation: chroma over lightness, clamped. The earlier
            # version divided by a denominator that could go negative or
            # near zero on mid-tone greys, which produced nonsense values.
            d = mx - mn
            s = (mx - mn) / 255 / (1 - abs(2 * l - 1)) if l not in (0, 1) else 0.0
            sats.append(min(1.0, max(0.0, s)))
            if mx == r:
                h = ((g - b) / d) % 6
            elif mx == g:
                h = (b - r) / d + 2
            else:
                h = (r - g) / d + 4
            h *= 60
            hb = int(h // 30) * 30
            hues[hb] = hues.get(hb, 0) + 1

    print(f"{path}: {width}x{height}")
    print(f"mean lightness: {sum(lights)/len(lights):.3f}   mean saturation: {sum(sats)/len(sats):.3f}")
    print()
    print("dominant colours (quantised to 16 levels per channel):")
    for (r, g, b), n in sorted(tally.items(), key=lambda kv: -kv[1])[:10]:
        hexv = f"#{r:x}{r:x}{g:x}{g:x}{b:x}{b:x}"
        print(f"  {hexv}  {n/total*100:5.1f}%")
    print()
    print("hue distribution (deg -> share):")
    for hb, n in sorted(hues.items(), key=lambda kv: -kv[1])[:8]:
        print(f"  {hb:3d}  {n/total*100:5.1f}%")


if __name__ == "__main__":
    path = sys.argv[1]
    crop = None
    if len(sys.argv) > 3 and sys.argv[2] == "--crop":
        crop = tuple(int(v) for v in sys.argv[3].split(","))
    analyse(path, crop)
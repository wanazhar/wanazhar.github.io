# DOOM on GitHub Pages - instruction.md

This package gives you a static `/doom` page for GitHub Pages using js-dos.

The app includes:

- Static `doom/index.html`, `doom/styles.css`, and `doom/main.js`
- Non-obstructive mobile/touchscreen overlay
- Drag-and-drop `.jsdos` bundle support
- Fullscreen button
- Accessibility-friendly labels and keyboard focus
- A starter bundle template in `bundle-workdir/`
- A helper script at `tools/build-jsdos-bundle.sh`

## Important legal note

This zip intentionally does **not** include DOOM game data, `DOOM.EXE`, `DOOM1.WAD`, `DOOM.WAD`, or any commercial game files.

To actually play DOOM, you need to add your own legally obtained js-dos bundle:

```text
doom/assets/doom.jsdos
```

You can use a legally obtained shareware DOOM package or your own purchased copy. Do not publish commercial game data publicly unless you have the right to do so.

---

## Fast deployment to `wanazhar.github.io/doom/`

1. Unzip this package.
2. Copy the `doom/` folder into the root of your `wanazhar.github.io` repository.
3. Also copy the root `.nojekyll` file into the root of your repository if you do not already have one.
4. Add your legal bundle here:

```text
doom/assets/doom.jsdos
```

5. Commit and push:

```bash
git add doom .nojekyll
git commit -m "Add DOOM GitHub Pages experiment"
git push
```

6. Open:

```text
https://wanazhar.github.io/doom/
```

---

## How to create `doom.jsdos`

A `.jsdos` file is just a zip archive containing the DOS game files and a required config file:

```text
.jsdos/dosbox.conf
DOOM.EXE
DOOM1.WAD
other support files...
```

I included a starter folder:

```text
bundle-workdir/
  .jsdos/dosbox.conf
  PUT_LEGAL_DOOM_FILES_HERE.txt
```

### Option A: Use the helper script

1. Put your legal DOOM files into `bundle-workdir/`.
2. Make sure the executable is named `DOOM.EXE`.
3. From the unzipped package root, run:

```bash
bash tools/build-jsdos-bundle.sh
```

This creates:

```text
doom/assets/doom.jsdos
```

Then copy or commit the `doom/` folder to your GitHub Pages repo.

### Option B: Manual zip method

From inside `bundle-workdir/`, zip the contents, including the hidden `.jsdos` folder:

```bash
cd bundle-workdir
zip -r ../doom/assets/doom.jsdos .
```

The archive must contain `.jsdos/dosbox.conf` at the archive root.

---

## Local testing

Because js-dos/WebAssembly should be served over HTTP, do not test by double-clicking `index.html`.

Use a simple local server from the unzipped package root:

```bash
python3 -m http.server 8080
```

Then open:

```text
http://localhost:8080/doom/
```

---

## Touchscreen controls

The mobile overlay appears automatically on coarse-pointer devices such as phones and tablets.

Touch controls:

| Touch button | Keyboard equivalent |
|---|---|
| ▲ | Arrow Up |
| ▼ | Arrow Down |
| ◀ | Arrow Left |
| ▶ | Arrow Right |
| Fire | Ctrl |
| Use | Space |
| Run | Shift |
| Strafe | Alt |
| Esc | Escape |
| Enter | Enter |
| Map | Tab |

The overlay is translucent and positioned at the screen edges to avoid blocking gameplay.

---

## Troubleshooting

### “Bundle missing”

Make sure this file exists exactly:

```text
doom/assets/doom.jsdos
```

File name is case-sensitive on GitHub Pages.

### “Boot failed”

Your `.jsdos` bundle may be missing the required config file:

```text
.jsdos/dosbox.conf
```

Or your config may point to the wrong executable name. The starter config runs:

```text
DOOM.EXE
```

### Keyboard does not respond

Click inside the game area once, then try again. Browser focus sometimes stays on the page controls instead of the emulator canvas.

### Mobile controls do not respond

Tap inside the game area once, then use the overlay. Also try fullscreen mode.

### GitHub Pages shows old version

Hard refresh your browser, or wait a minute for GitHub Pages cache to update.

---

## Project structure

```text
.
├── .nojekyll
├── instruction.md
├── README.md
├── bundle-workdir/
│   ├── .jsdos/
│   │   └── dosbox.conf
│   └── PUT_LEGAL_DOOM_FILES_HERE.txt
├── tools/
│   └── build-jsdos-bundle.sh
└── doom/
    ├── index.html
    ├── styles.css
    ├── main.js
    ├── manifest.webmanifest
    ├── instruction.md
    └── assets/
        └── PUT_DOOM_BUNDLE_HERE.txt
```


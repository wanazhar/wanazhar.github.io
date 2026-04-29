# DOOM on GitHub Pages - Cute Anime UI Edition

This folder is a static `/doom` page for GitHub Pages.

## What's new in this version

- Cute anime-inspired pastel UI
- Cleaner glassmorphism panels
- Improved touch overlay layout for phones and tablets
- iPad / iPhone safe mode support remains included
- Touch controls are less obstructive and easier to understand

## Important

This deployed version includes a public DOOM v1.9 shareware `doom.jsdos` bundle at:

```text
./assets/doom.jsdos
```

It contains `DOOM1.WAD`, not the commercial `DOOM.WAD`. You can still use **Load local .jsdos** to test another legal bundle from your device.

## Quick deploy

1. Copy the `doom/` folder into your GitHub Pages repository.
2. Make sure your legal bundle exists at `doom/assets/doom.jsdos`.
3. Commit and push.
4. Open:

```text
https://wanazhar.github.io/doom/
```

## If you are on iPad / iPhone

The page automatically uses safe mode for Apple touch devices.
You can also force it manually with:

```text
https://wanazhar.github.io/doom/?safe=1
```

## Main controls

### Keyboard

- Move: Arrow keys
- Fire: Ctrl
- Use/open: Space
- Run: Shift
- Strafe modifier: Alt
- Map: Tab
- Menu: Esc

### Touch overlay

- Left cluster: movement pad
- Right cluster: action buttons
- Top-right mini buttons: menu, enter, map

## Local testing

If you do not want to upload a bundle yet, use **Load local .jsdos** and pick a local bundle from your device.

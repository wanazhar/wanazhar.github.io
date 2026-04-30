# DOOM shareware bundles

`doom.jsdos` and `doom_old.jsdos` are js-dos v8 bundles built from the public DOOM v1.9 shareware archive and contain `DOOM1.WAD`, not commercial `DOOM.WAD`.

`doom-legacy.zip` is the same shareware game data repacked for the older js-dos v3/asm.js loader. The iPad/Safari path uses this legacy engine because it avoids the js-dos v8 WebAssembly backend crash seen on real iPad Safari.

The v8 bundles use an iPad/Safari-safe DOSBox config: conservative video mode, normal CPU core, fixed cycles, disabled EMS/IPX/MIDI/OPL, and `DOOM.EXE -nomusic`.

See `SOURCE.txt` for the exact source URL and checksum.

## External reference mode

The live iPad/Safari legacy path currently loads thedoggybrad's external `DOOM-@evilution.zip` URL directly instead of copying that archive into this repository. The local `doom-legacy.zip` remains the shareware fallback/test bundle.

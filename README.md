![Frames to Video Header](assets/stv.png)

# Frames to Video — Figma Plugin

Turn any sequence of Figma frames into a video and insert it directly into the canvas as a native video fill.

---

## Features

- **Frame selection** — pick any frames on the page and reorder them with Up / Down controls
- **FPS control** — set playback speed from 1 to 10 FPS with one click
- **Duration preview** — see the total video length update in real time as you adjust FPS or reorder frames
- **Size mismatch warning** — alerts you when selected frames have different dimensions
- **Native video fill** — inserts the result inside a Figma Frame using the built-in `VIDEO` fill type, so it plays in prototype mode
- **Adaptive bitrate** — automatically adjusts compression to keep design content crisp

---

## Installation (Development)

1. Open **Figma Desktop** (the plugin requires the desktop app)
2. Go to **Plugins → Development → Import plugin from manifest...**
3. Select the `manifest.json` file from this folder
4. The plugin will appear under **Plugins → Development → Frames to Video**

---

## File Structure

```
frames-to-video/
├── manifest.json   ← Figma plugin manifest
├── code.js         ← Plugin sandbox code (runs in Figma's JS environment)
├── ui.html         ← Plugin UI (runs in an iframe)
└── README.md
```

---

## How to Use

1. **Select frames** on the Figma canvas before opening the plugin
2. **Open the plugin** from Plugins → Development → Frames to Video
3. **Reorder frames** if needed using the Up / Down arrows next to each frame name
4. **Set the FPS** — the duration label updates automatically
5. Click **Render video** — progress is shown stage by stage (export → load → render → insert)
6. The video is placed as a Frame on the current page, centered in the viewport

---

## Important Notes

### Frame ordering
Frames are auto-sorted by position (left-to-right, top-to-bottom) when the plugin opens. Use the Up / Down buttons to override the order before rendering.

### Frame dimensions
All frames should have the same width and height. If they differ, the plugin shows a warning — the output video will use the dimensions of the first frame and other frames will be stretched to fit.

### Video encoding
The plugin encodes video in **WebM** format using the best available codec in the environment (VP9 → VP8 → browser default). The bitrate is calculated as:

```
bitrate = min(width × height × 30 × 2, 50 000 000) bps
```

This keeps design-heavy content sharp while avoiding unnecessarily large files.

### Video fill & prototypes
The inserted Frame uses `type: 'VIDEO'` as its fill. This means:
- In the **editor**, Figma shows a static thumbnail
- In **prototype mode**, the video plays automatically on the frame

### Figma API version
Requires Figma Plugin API **1.0.0** or later. `figma.createVideoAsync` must be available. If it isn't (older Figma versions), the plugin falls back to inserting a static image of the first frame.

---

## Development

No build step required. Edit `code.js` and `ui.html` directly and reload the plugin in Figma with **⌘⌥P** (Mac) or **Ctrl+Alt+P** (Windows).

---

## Credits

Plugin by [asierleoz.com](https://asierleoz.com)

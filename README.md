![Story to Video Header](assets/stv.png)

# Story to Video — Figma Plugin

Turn any sequence of Figma frames into an animated video or GIF and insert it directly into the canvas.

---

## Features

- **Frame selection** — pick any frames on the page and reorder them with Up / Down controls
- **FPS control** — set playback speed from 1 to 10 FPS with one click
- **Loops** — repeat the animation any number of times (0 = play once, 1 = play twice, etc.)
- **Rewind** — ping-pong mode plays the sequence forward then backward (1 2 3 4 3 2 1)
- **Export format** — choose between MP4 (native video fill) or GIF (image fill)
- **Duration preview** — total length updates in real time as you adjust FPS, loops, or rewind
- **Size mismatch warning** — alerts you when selected frames have different dimensions
- **Adaptive bitrate** — automatically adjusts compression to keep design content crisp

---

## Installation (Development)

1. Open **Figma Desktop** (the plugin requires the desktop app)
2. Go to **Plugins → Development → Import plugin from manifest...**
3. Select the `manifest.json` file from this folder
4. The plugin will appear under **Plugins → Development → Story to Video**

---

## File Structure

```
story-to-video/
├── manifest.json   ← Figma plugin manifest
├── code.js         ← Plugin sandbox code (runs in Figma's JS environment)
├── ui.html         ← Plugin UI (runs in an iframe)
└── README.md
```

---

## How to Use

1. **Select frames** on the Figma canvas before opening the plugin
2. **Open the plugin** from Plugins → Development → Story to Video
3. **Reorder frames** if needed using the Up / Down arrows next to each frame name
4. **Set the FPS** — the duration label updates automatically
5. **Set Loops** — enter how many extra times the animation should repeat (0 = play once)
6. **Enable Rewind** — toggle on to play forward then backward each cycle
7. **Choose Format** — MP4 for a native video fill, GIF for an image fill
8. Click **Render MP4** or **Export GIF** — progress is shown stage by stage
9. The result is placed as a Frame on the current page, centered in the viewport

---

## Important Notes

### Loops
A value of `0` plays the sequence once. A value of `N` repeats the full sequence `N` additional times. With Rewind enabled, one cycle is the full forward+backward sequence, and that whole cycle is repeated.

### Rewind
Creates a ping-pong animation. For frames `[1, 2, 3, 4]`, the output sequence is `[1, 2, 3, 4, 3, 2, 1]`. Combined with loops, the cycle repeats: `[1, 2, 3, 4, 3, 2, 1, 1, 2, 3, 4, 3, 2, 1, ...]`.

### Frame ordering
Frames are auto-sorted by position (left-to-right, top-to-bottom) when the plugin opens. Use the Up / Down buttons to override the order before rendering.

### Frame dimensions
All frames should have the same width and height. If they differ, the plugin shows a warning — the output will use the dimensions of the first frame and other frames will be stretched to fit.

### MP4 format
Encoded using the best available codec in the environment (MP4/AVC → VP9 → VP8 → WebM fallback). The result is inserted as a `VIDEO` fill:
- In the **editor**, Figma shows a static thumbnail
- In **prototype mode**, the video plays automatically

### GIF format
Encoded entirely in the browser using median-cut color quantization (256 colours) and LZW compression. The result is inserted as an `IMAGE` fill. Figma displays the first frame as a static image in the editor — the full animated GIF data is preserved, so exporting the asset from Figma produces the complete animation.

### Figma API version
Requires Figma Plugin API **1.0.0** or later. For MP4, `figma.createVideoAsync` is used when available, with a static image fallback for older Figma versions.

---

## Development

No build step required. Edit `code.js` and `ui.html` directly and reload the plugin in Figma with **⌘⌥P** (Mac) or **Ctrl+Alt+P** (Windows).

---

## Credits

Plugin by [asierleoz.com](https://asierleoz.com)

figma.showUI(__html__, { width: 380, height: 560, title: "Frames to Video" });

function sendSelection() {
  const frames = figma.currentPage.selection.filter(n =>
    n.type === 'FRAME' || n.type === 'COMPONENT' 
  );

  // Sort by canvas position: left → right, then top → bottom.
  // This makes the order independent of how the user clicked to select them.
  const sorted = frames.slice().sort((a, b) => {
    if (Math.round(a.x) !== Math.round(b.x)) return a.x - b.x;
    return a.y - b.y;
  });

  figma.ui.postMessage({
    type: 'selection',
    frames: sorted.map(f => ({
      id: f.id,
      name: f.name,
      width: Math.round(f.width),
      height: Math.round(f.height),
    }))
  });
}

figma.on('selectionchange', sendSelection);
sendSelection();

figma.ui.onmessage = async (msg) => {

  if (msg.type === 'export-frames') {
    try {
      const { frameIds } = msg;
      const results = [];

      for (let i = 0; i < frameIds.length; i++) {
        const node = figma.getNodeById(frameIds[i]);
        if (!node) {
          figma.ui.postMessage({ type: 'export-progress', done: i + 1, total: frameIds.length });
          continue;
        }
        const bytes = await node.exportAsync({ format: 'PNG' });
        results.push({
          id: frameIds[i],
          bytes,   // Uint8Array — transferred directly to UI
          width:  Math.round(node.width),
          height: Math.round(node.height),
        });
        figma.ui.postMessage({ type: 'export-progress', done: i + 1, total: frameIds.length });
      }

      figma.ui.postMessage({ type: 'frames-exported', frames: results });
    } catch (err) {
      figma.ui.postMessage({ type: 'error', message: err.message || String(err) });
    }
  }

  if (msg.type === 'insert-video') {
    try {
      const { bytes, width, height } = msg;
      const uint8 = new Uint8Array(bytes);

      let fill;
      if (typeof figma.createVideoAsync === 'function') {
        const video = await figma.createVideoAsync(uint8);
        fill = { type: 'VIDEO', videoHash: video.hash, scaleMode: 'FILL' };
      } else {
        const image = figma.createImage(uint8);
        fill = { type: 'IMAGE', imageHash: image.hash, scaleMode: 'FILL' };
      }

      const frame = figma.createFrame();
      frame.resize(width, height);
      frame.name = 'Frames Video';
      frame.fills = [fill];

      const center = figma.viewport.center;
      frame.x = center.x - width  / 2;
      frame.y = center.y - height / 2;

      figma.currentPage.appendChild(frame);
      figma.currentPage.selection = [frame];
      figma.viewport.scrollAndZoomIntoView([frame]);

      figma.ui.postMessage({ type: 'done' });
    } catch (err) {
      figma.ui.postMessage({ type: 'error', message: err.message || String(err) });
    }
  }

};

import { PNG } from "pngjs";

export type BoundingBoxOptions = {
  mergeAll?: boolean;
  padding?: number;
  clusterDistance?: number; // pixels; if provided, groups nearby BBs into clusters
};

export function createBoundingBoxDiff(
  actualImg: PNG,
  diffImg: PNG,
  options?: BoundingBoxOptions
): PNG {
  const width = actualImg.width;
  const height = actualImg.height;
  const result = new PNG({ width, height });
  const mergeAll = options?.mergeAll ?? true; // default: merge small boxes into one big box
  const padding = Math.max(0, options?.padding ?? 0);
  const clusterDistance = options?.clusterDistance;

  // Copy actual image as base
  actualImg.data.copy(result.data);

  // Find all diff pixels
  const diffPixels: boolean[][] = Array(height)
    .fill(null)
    .map(() => Array(width).fill(false));
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (width * y + x) << 2;
      // Check if this pixel was marked as different (red color from pixelmatch)
      if (diffImg.data[idx] > 200 && diffImg.data[idx + 1] < 100) {
        diffPixels[y][x] = true;
      }
    }
  }

  // Find connected regions and draw bounding boxes
  const visited: boolean[][] = Array(height)
    .fill(null)
    .map(() => Array(width).fill(false));
  let boxNumber = 1;
  const boxes: Array<{
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
  }> = [];

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (diffPixels[y][x] && !visited[y][x]) {
        // Find bounding box for this region
        const bbox = findBoundingBox(diffPixels, visited, x, y, width, height);
        boxes.push(bbox);
      }
    }
  }

  if (boxes.length === 0) return result;

  if (mergeAll) {
    if (
      typeof clusterDistance === "number" &&
      isFinite(clusterDistance) &&
      clusterDistance >= 0
    ) {
      // Cluster boxes that are within clusterDistance of each other
      const clusters = clusterBoundingBoxes(boxes, clusterDistance);
      let label = 1;
      for (const c of clusters) {
        const merged = applyPaddingClamp(c, padding, width, height);
        drawRectangle(result, merged, width);
        const scale = 2;
        const labelY = Math.max(0, merged.minY - (5 * scale + 2));
        drawText(result, `BB${label}`, merged.minX, labelY, width, scale);
        label++;
      }
    } else {
      // Merge into a single union bounding box
      const union = boxes.reduce(
        (acc, b) => ({
          minX: Math.min(acc.minX, b.minX),
          maxX: Math.max(acc.maxX, b.maxX),
          minY: Math.min(acc.minY, b.minY),
          maxY: Math.max(acc.maxY, b.maxY),
        }),
        boxes[0]
      );

      const merged = applyPaddingClamp(union, padding, width, height);
      drawRectangle(result, merged, width);
      const scale = 2;
      const labelY = Math.max(0, merged.minY - (5 * scale + 2));
      drawText(result, `BB1`, merged.minX, labelY, width, scale);
    }
  } else {
    // Draw each individual box
    for (const bbox of boxes) {
      drawRectangle(result, bbox, width);
      const scale = 2;
      const labelY = Math.max(0, bbox.minY - (5 * scale + 2));
      drawText(result, `BB${boxNumber}`, bbox.minX, labelY, width, scale);
      boxNumber++;
    }
  }

  return result;
}

function applyPaddingClamp(
  b: { minX: number; maxX: number; minY: number; maxY: number },
  padding: number,
  width: number,
  height: number
) {
  return {
    minX: Math.max(0, b.minX - padding),
    maxX: Math.min(width - 1, b.maxX + padding),
    minY: Math.max(0, b.minY - padding),
    maxY: Math.min(height - 1, b.maxY + padding),
  };
}

function boxesAreWithinDistance(
  a: { minX: number; maxX: number; minY: number; maxY: number },
  b: { minX: number; maxX: number; minY: number; maxY: number },
  d: number
) {
  // Compute separation along X
  let dx = 0;
  if (a.maxX < b.minX) dx = b.minX - a.maxX;
  else if (b.maxX < a.minX) dx = a.minX - b.maxX;
  else dx = 0; // overlap on X

  // Compute separation along Y
  let dy = 0;
  if (a.maxY < b.minY) dy = b.minY - a.maxY;
  else if (b.maxY < a.minY) dy = a.minY - b.maxY;
  else dy = 0; // overlap on Y

  // Use Chebyshev distance (dilation-like): within distance if both gaps <= d
  return Math.max(dx, dy) <= d;
}

function mergeBox(
  a: { minX: number; maxX: number; minY: number; maxY: number },
  b: { minX: number; maxX: number; minY: number; maxY: number }
) {
  return {
    minX: Math.min(a.minX, b.minX),
    maxX: Math.max(a.maxX, b.maxX),
    minY: Math.min(a.minY, b.minY),
    maxY: Math.max(a.maxY, b.maxY),
  };
}

function clusterBoundingBoxes(
  boxes: Array<{ minX: number; maxX: number; minY: number; maxY: number }>,
  distance: number
) {
  const n = boxes.length;
  const visited = new Array(n).fill(false);
  const clusters: Array<{
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
  }> = [];

  for (let i = 0; i < n; i++) {
    if (visited[i]) continue;
    visited[i] = true;
    // Start a new cluster with box i
    let clusterBox = { ...boxes[i] };
    const queue = [i];
    while (queue.length) {
      const idx = queue.shift()!;
      for (let j = 0; j < n; j++) {
        if (visited[j]) continue;
        if (boxesAreWithinDistance(boxes[idx], boxes[j], distance)) {
          visited[j] = true;
          queue.push(j);
          clusterBox = mergeBox(clusterBox, boxes[j]);
        }
      }
    }
    clusters.push(clusterBox);
  }
  return clusters;
}

function findBoundingBox(
  diffPixels: boolean[][],
  visited: boolean[][],
  startX: number,
  startY: number,
  width: number,
  height: number
) {
  let minX = startX,
    maxX = startX,
    minY = startY,
    maxY = startY;
  const queue: [number, number][] = [[startX, startY]];
  visited[startY][startX] = true;

  while (queue.length > 0) {
    const [x, y] = queue.shift()!;
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);

    // Check 4-connected neighbors
    const neighbors = [
      [x - 1, y],
      [x + 1, y],
      [x, y - 1],
      [x, y + 1],
    ];
    for (const [nx, ny] of neighbors) {
      if (
        nx >= 0 &&
        nx < width &&
        ny >= 0 &&
        ny < height &&
        diffPixels[ny][nx] &&
        !visited[ny][nx]
      ) {
        visited[ny][nx] = true;
        queue.push([nx, ny]);
      }
    }
  }

  return { minX, maxX, minY, maxY };
}

function drawRectangle(
  img: PNG,
  bbox: { minX: number; maxX: number; minY: number; maxY: number },
  width: number
) {
  const lineWidth = 2;

  // Draw horizontal lines (top and bottom)
  for (let x = bbox.minX; x <= bbox.maxX; x++) {
    for (let t = 0; t < lineWidth; t++) {
      // Top
      if (bbox.minY + t < img.height) {
        const idx = (width * (bbox.minY + t) + x) << 2;
        img.data[idx] = 0;
        img.data[idx + 1] = 255;
        img.data[idx + 2] = 0;
        img.data[idx + 3] = 255;
      }
      // Bottom
      if (bbox.maxY - t >= 0) {
        const idx = (width * (bbox.maxY - t) + x) << 2;
        img.data[idx] = 0;
        img.data[idx + 1] = 255;
        img.data[idx + 2] = 0;
        img.data[idx + 3] = 255;
      }
    }
  }

  // Draw vertical lines (left and right)
  for (let y = bbox.minY; y <= bbox.maxY; y++) {
    for (let t = 0; t < lineWidth; t++) {
      // Left
      if (bbox.minX + t < width) {
        const idx = (width * y + bbox.minX + t) << 2;
        img.data[idx] = 0;
        img.data[idx + 1] = 255;
        img.data[idx + 2] = 0;
        img.data[idx + 3] = 255;
      }
      // Right
      if (bbox.maxX - t >= 0) {
        const idx = (width * y + bbox.maxX - t) << 2;
        img.data[idx] = 0;
        img.data[idx + 1] = 255;
        img.data[idx + 2] = 0;
        img.data[idx + 3] = 255;
      }
    }
  }
}

function drawText(
  img: PNG,
  text: string,
  x: number,
  y: number,
  width: number,
  scale: number = 1
) {
  // Simple bitmap font (5x5 pixels per character)
  const font: { [key: string]: number[][] } = {
    B: [
      [1, 1, 1, 1, 0],
      [1, 0, 0, 0, 1],
      [1, 1, 1, 1, 0],
      [1, 0, 0, 0, 1],
      [1, 1, 1, 1, 0],
    ],
    " ": [
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
    ],
    "0": [
      [0, 1, 1, 1, 0],
      [1, 0, 0, 0, 1],
      [1, 0, 0, 0, 1],
      [1, 0, 0, 0, 1],
      [0, 1, 1, 1, 0],
    ],
    "1": [
      [0, 0, 1, 0, 0],
      [0, 1, 1, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 1, 1, 1, 0],
    ],
    "2": [
      [0, 1, 1, 1, 0],
      [1, 0, 0, 0, 1],
      [0, 0, 1, 1, 0],
      [0, 1, 0, 0, 0],
      [1, 1, 1, 1, 1],
    ],
    "3": [
      [1, 1, 1, 1, 0],
      [0, 0, 0, 0, 1],
      [0, 1, 1, 1, 0],
      [0, 0, 0, 0, 1],
      [1, 1, 1, 1, 0],
    ],
    "4": [
      [1, 0, 0, 1, 0],
      [1, 0, 0, 1, 0],
      [1, 1, 1, 1, 1],
      [0, 0, 0, 1, 0],
      [0, 0, 0, 1, 0],
    ],
    "5": [
      [1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0],
      [1, 1, 1, 1, 0],
      [0, 0, 0, 0, 1],
      [1, 1, 1, 1, 0],
    ],
    "6": [
      [0, 1, 1, 1, 0],
      [1, 0, 0, 0, 0],
      [1, 1, 1, 1, 0],
      [1, 0, 0, 0, 1],
      [0, 1, 1, 1, 0],
    ],
    "7": [
      [1, 1, 1, 1, 1],
      [0, 0, 0, 1, 0],
      [0, 0, 1, 0, 0],
      [0, 1, 0, 0, 0],
      [0, 1, 0, 0, 0],
    ],
    "8": [
      [0, 1, 1, 1, 0],
      [1, 0, 0, 0, 1],
      [0, 1, 1, 1, 0],
      [1, 0, 0, 0, 1],
      [0, 1, 1, 1, 0],
    ],
    "9": [
      [0, 1, 1, 1, 0],
      [1, 0, 0, 0, 1],
      [0, 1, 1, 1, 1],
      [0, 0, 0, 0, 1],
      [0, 1, 1, 1, 0],
    ],
  };

  const safeScale = Math.max(1, Math.floor(scale));
  let offsetX = 0;
  for (const char of text) {
    const glyph = font[char];
    if (!glyph) {
      offsetX += 6 * safeScale;
      continue;
    }

    const glyphHeight = glyph.length;
    const glyphWidth = glyph[0]?.length ?? 5;
    for (let row = 0; row < glyphHeight; row++) {
      for (let col = 0; col < glyphWidth; col++) {
        if (!glyph[row][col]) continue;
        // draw a safeScale x safeScale block per pixel to scale up
        for (let sy = 0; sy < safeScale; sy++) {
          const py = y + row * safeScale + sy;
          if (py < 0 || py >= img.height) continue;
          for (let sx = 0; sx < safeScale; sx++) {
            const px = x + offsetX + col * safeScale + sx;
            if (px < 0 || px >= width) continue;
            const idx = (width * py + px) << 2;
            img.data[idx] = 0;
            img.data[idx + 1] = 255;
            img.data[idx + 2] = 0;
            img.data[idx + 3] = 255;
          }
        }
      }
    }
    // advance with +1 spacing column, scaled
    offsetX += (glyphWidth + 1) * safeScale;
  }
}

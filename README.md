# test-ui

## Getting started

Instal dependencies:
`npm i`

To start UI:
`npm run dev`

To set up Playwright:
`npx playwright install`

To run tests with existing/empty baselines:
`npm run test`

To run tests with replacing existing baseline images with the current run’s screenshots. Use when: The UI changed intentionally and your old baselines are now outdated.
`test:overwrite:baselines`

# Bounding Box Drawing Logic (drawing.ts)

## Overview

The module converts a Pixelmatch-generated diff image into annotated bounding boxes that highlight visual changes. It:

1. Copies the actual screenshot into a result canvas.
2. Identifies differing pixels (expects Pixelmatch red marking: high R, low G).
3. Flood-fills connected diff pixels into regions (4-connectivity) producing raw bounding boxes.
4. Optionally merges boxes: either single union or clustered unions based on `clusterDistance`.
5. Applies optional padding and clamps boxes to image bounds.
6. Renders red rectangle outlines and scaled labels (BB1, BB2, …) above each box.

## Core Function

`createBoundingBoxDiff(actualImg, diffImg, options)` orchestrates the full pipeline. Options:

- `mergeAll` (default true): If true, merge raw boxes; if false, draw each raw box.
- `clusterDistance`: When provided with `mergeAll: true`, groups nearby/overlapping boxes into clusters (Chebyshev distance criterion) and draws one box per cluster.
- `padding`: Extra pixels added outward in all directions for final boxes.

### Steps Inside

1. Collect diff pixels into a boolean grid.
2. Iterate through grid; when an unvisited diff pixel is found, call `findBoundingBox` to BFS the region and record its min/max extents.
3. If no boxes → return image unchanged.
4. If `mergeAll`:
   - If `clusterDistance` set → call `clusterBoundingBoxes` to form clusters, then draw each cluster union.
   - Else → compute one union across all boxes.
5. Else (no merging) draw each raw box individually.
6. For each final box: apply `applyPaddingClamp`, outline via `drawRectangle`, label via `drawText` (scaled bitmap font).

## Helper Functions

- `findBoundingBox(diffPixels, visited, startX, startY, width, height)`: BFS flood fill from a starting pixel; tracks min/max X/Y. Marks visited to prevent duplicate processing.
- `applyPaddingClamp(box, padding, width, height)`: Expands box by padding and clamps coordinates to image bounds.
- `boxesAreWithinDistance(a, b, d)`: Computes Chebyshev gap (max of horizontal/vertical separations). Returns true if both axis gaps ≤ d (overlap yields 0).
- `mergeBox(a, b)`: Returns union of two boxes.
- `clusterBoundingBoxes(boxes, distance)`: Performs a BFS-like clustering: starting from each unvisited box, absorbs all boxes within `distance` recursively, merging into a growing union.

## Rendering Functions

- `drawRectangle(img, bbox, width)`: Draws 2-pixel thick red outline (RGB: 255,0,0) on all four edges.
- `drawText(img, text, x, y, width, scale)`: Renders a simple 5x5 bitmap font; each active font pixel becomes a `scale x scale` red block. Auto-advances with 1 column spacing scaled. Label positioned above box: `labelY = max(0, minY - (5*scale + 2))`.

## Label Scaling

Labels use `scale = 2` when invoked in `createBoundingBoxDiff` to improve readability. Scaling increases both glyph size and horizontal advance proportionally.

## Clustering Logic Detail

Clustering treats boxes as nodes in a graph; edges exist when `boxesAreWithinDistance` ≤ `clusterDistance`. Each cluster is found via queue-driven expansion and merged on-the-fly, minimizing second passes.

## Usage Example

```ts
const annotated = createBoundingBoxDiff(actualPng, diffPng, {
  mergeAll: true,
  clusterDistance: 12, // group close regions
  padding: 4, // inflate final boxes
});
```

To force a single box for all changes:

```ts
createBoundingBoxDiff(actual, diff, { mergeAll: true }); // no clusterDistance
```

To keep all raw boxes separate:

```ts
createBoundingBoxDiff(actual, diff, { mergeAll: false });
```

## Performance Notes

- BFS region detection cost is proportional to number of diff pixels; clustering cost is O(n^2) worst-case for n regions (acceptable for small region counts typical in UI diffs).
- Scaling text adds negligible overhead versus pixel scanning.

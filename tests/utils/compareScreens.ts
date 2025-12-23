import fs from "fs";
import path from "path";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";
import { createBoundingBoxDiff, BoundingBoxOptions } from "./drawing";

export const BASELINE_DIR = path.join(process.cwd(), "tests", "baselines");
export const ARTIFACT_DIR = path.join(process.cwd(), "test-artifacts");

export function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

export type CompareResult = {
  diff: number;
  baselinePath?: string;
  actualPath?: string;
  diffPath?: string;
};

export async function compareScreenshot(
  buffer: Buffer,
  name: string,
  options?: {
    threshold?: number;
    includeAA?: boolean;
    mergeBoundingBoxes?: boolean;
    boxPadding?: number;
    clusterDistance?: number;
  }
): Promise<CompareResult> {
  const threshold = options?.threshold ?? 0.1;
  const includeAA = options?.includeAA ?? false;
  const mergeBoundingBoxes = options?.mergeBoundingBoxes ?? true;
  const boxPadding = options?.boxPadding ?? 0;
  const clusterDistance = options?.clusterDistance;

  ensureDir(BASELINE_DIR);
  ensureDir(ARTIFACT_DIR);

  const baselinePath = path.join(BASELINE_DIR, `${name}.png`);
  const actualPath = path.join(ARTIFACT_DIR, `${name}.actual.png`);
  const diffPath = path.join(ARTIFACT_DIR, `${name}.diff.png`);

  fs.writeFileSync(actualPath, buffer);

  // If baseline screenshots donn't exist or it is update mode, create the new baseline screenshots
  const overwrite = process.env.UPDATE_BASELINES === "1";
  if (overwrite || !fs.existsSync(baselinePath)) {
    fs.writeFileSync(baselinePath, buffer);
    return { diff: 0 };
  }

  const baselineImg = PNG.sync.read(fs.readFileSync(baselinePath));
  const actualImg = PNG.sync.read(fs.readFileSync(actualPath));

  if (
    baselineImg.width !== actualImg.width ||
    baselineImg.height !== actualImg.height
  ) {
    throw new Error(
      `Image size mismatch for ${name}: baseline ${baselineImg.width}x${baselineImg.height} vs actual ${actualImg.width}x${actualImg.height}`
    );
  }

  const diffImg = new PNG({
    width: baselineImg.width,
    height: baselineImg.height,
  });

  // Count the number of mismatched pixels
  const mismatch: number = pixelmatch(
    baselineImg.data,
    actualImg.data,
    diffImg.data,
    baselineImg.width,
    baselineImg.height,
    {
      threshold,
      includeAA,
    }
  );

  // Convert filled diff areas to bounding box edges only
  const boundingBoxImg = createBoundingBoxDiff(actualImg, diffImg, {
    mergeAll: mergeBoundingBoxes,
    padding: boxPadding,
    clusterDistance,
  });

  // Create image with highlighted differences
  fs.writeFileSync(diffPath, PNG.sync.write(boundingBoxImg));
  return { diff: mismatch, baselinePath: baselinePath, actualPath, diffPath };
}

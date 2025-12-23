import { test, expect } from "@playwright/test";
import { compareScreenshot, ARTIFACT_DIR } from "./utils/compareScreens";
import fs from "fs";
import path from "path";

const SENSITIVITY = 0.1;
const INCLUDE_AA = false;

const pagesToTest = [
  { name: "home", path: "/" },
  { name: "product-detail", path: "/product/1" },
  { name: "cart", path: "/cart" },
  { name: "profile", path: "/profile" },
];

test.describe("Visual Regression Tests", () => {
  test.beforeAll(() => {
    if (!fs.existsSync(ARTIFACT_DIR)) {
      fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
    }
  });

  for (const pageInfo of pagesToTest) {
    test(`Screenshot Comparison: ${pageInfo.name}`, async ({ page }) => {
      console.log(`Testing page: ${pageInfo.name}`);

      await page.goto(pageInfo.path);
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(500);

      const screenshot = await page.screenshot({ fullPage: true });
      const osName = process.platform;
      const screenshotName = `${pageInfo.name}-${osName}`;

      const result = await compareScreenshot(screenshot, screenshotName, {
        threshold: SENSITIVITY,
        includeAA: INCLUDE_AA,
        mergeBoundingBoxes: true,
        clusterDistance: 300,
        boxPadding: 4,
      });

      console.log(`Diff for ${pageInfo.name}: ${result.diff} pixels`);

      if (result.diff > 0) {
        const flagPath = path.join(process.cwd(), "diff_detected.txt");
        if (!fs.existsSync(flagPath)) {
          fs.writeFileSync(flagPath, "Changes detected");
          console.log("Changes detected");
        }
      }
    });
  }
});

const { test, expect } = require("@playwright/test");

test.beforeEach(async ({ context, page }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  const errors = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));
  page.__consoleErrors = errors;
});

test.afterEach(async ({ page }) => {
  expect(page.__consoleErrors).toEqual([]);
});

test("opens a seeded friend challenge and shares the next challenge link", async ({ page }) => {
  await page.goto(
    "/?challenge=1&game=stack&level=hard&seed=24681357&score=3&by=%EB%AF%BC%EC%A7%80",
  );

  const challengeBar = page.getByRole("region", { name: /민지님의 탑 쌓기 도전장/ });
  await expect(challengeBar).toBeVisible();
  await expect(challengeBar).toContainText("목표 3층");

  const box = await challengeBar.boundingBox();
  const viewport = page.viewportSize();
  expect(box.x).toBeGreaterThanOrEqual(0);
  expect(box.x + box.width).toBeLessThanOrEqual(viewport.width);

  await challengeBar.getByRole("button", { name: "같은 조건으로 도전" }).click();
  const guideStart = page.getByRole("button", { name: "게임 시작" });
  try {
    await guideStart.waitFor({ state: "visible", timeout: 1000 });
    await guideStart.click();
  } catch {
    // Returning players may already have completed this guide.
  }
  await page.waitForTimeout(350);
  const stackCanvas = page.getByLabel("좌우로 움직이는 블록을 눌러 탑 위에 쌓는 게임 영역");
  const resultDialog = page.getByRole("dialog").filter({ hasText: "친구 도전 · 탑 쌓기" });
  for (let attempt = 0; attempt < 20 && !(await resultDialog.isVisible()); attempt += 1) {
    await stackCanvas.click({ position: { x: 8, y: 8 }, force: true });
    await page.waitForTimeout(90);
  }
  await expect(resultDialog).toBeVisible({ timeout: 7000 });
  await expect(resultDialog).toContainText("민지님의 목표");

  await resultDialog.getByRole("button", { name: "결과 공유" }).click();
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toContain(
    "challenge=1",
  );
  const copied = await page.evaluate(() => navigator.clipboard.readText());
  expect(copied).toContain("game=stack");
  expect(copied).toContain("level=hard");

  const downloadPromise = page.waitForEvent("download");
  await resultDialog.getByRole("button", { name: "이미지 저장" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/^ddak-result-\d+\.png$/);
});

test("shows and completes the custom install prompt", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => {
    const event = new Event("beforeinstallprompt");
    event.prompt = async () => {};
    event.userChoice = Promise.resolve({ outcome: "accepted", platform: "web" });
    window.dispatchEvent(event);
  });

  const installButton = page.getByRole("button", { name: "앱 설치" });
  await expect(installButton).toBeVisible();
  await installButton.click();
  await expect(installButton).toBeHidden();
});

test("serves the install manifest, PNG icons, and active service worker", async ({ page, request }) => {
  await page.goto("/");
  const manifest = await (await request.get("/manifest.webmanifest?v=35")).json();
  expect(manifest.icons.map((icon) => icon.sizes)).toEqual([
    "192x192",
    "512x512",
    "512x512",
  ]);
  expect(manifest.shortcuts).toHaveLength(3);

  for (const icon of ["icon-192.png", "icon-512.png", "icon-maskable-512.png"]) {
    const response = await request.get(`/icons/${icon}`);
    expect(response.ok()).toBeTruthy();
    expect(response.headers()["content-type"]).toContain("image/png");
  }

  await expect
    .poll(() =>
      page.evaluate(async () => {
        const registration = await navigator.serviceWorker.ready;
        return registration.active?.scriptURL || "";
      }),
    )
    .toContain("sw.js?v=35");
});

test("reloads the app from the service worker cache while offline", async ({ context, page }) => {
  await page.goto("/");
  await page.evaluate(async () => navigator.serviceWorker.ready);
  await page.reload();
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

  try {
    await context.setOffline(true);
    await page.reload({ waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("button", { name: /같이 하기/ })).toBeVisible();
  } finally {
    await context.setOffline(false);
  }
});

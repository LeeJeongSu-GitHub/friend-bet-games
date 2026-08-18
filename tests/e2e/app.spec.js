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

async function installFakeOnlinePeer(page) {
  await page.addInitScript(() => {
    class FakeEmitter {
      constructor() {
        this.listeners = new Map();
      }

      on(type, listener) {
        const listeners = this.listeners.get(type) || [];
        listeners.push(listener);
        this.listeners.set(type, listeners);
      }

      emit(type, value) {
        (this.listeners.get(type) || []).forEach((listener) => listener(value));
      }
    }

    class FakeConnection extends FakeEmitter {
      constructor() {
        super();
        this.peer = "online-friend";
        this.open = true;
        this.readyRounds = new Set();
        this.rpsMatches = new Set();
        this.telepathyRounds = new Set();
        this.drawingRounds = new Set();
      }

      send(message) {
        const room = message?.room;
        if (message?.type !== "state" || !room) return;
        window.__FAKE_LAST_ROOM__ = room;
        const guest = room.players.find((player) => player.id === this.peer);
        if (
          room.status === "lobby" &&
          guest &&
          !guest.ready &&
          !this.readyRounds.has(room.round)
        ) {
          this.readyRounds.add(room.round);
          window.setTimeout(
            () => this.emit("data", { type: "ready", ready: true }),
            20,
          );
        }
        const telepathyKey = `${room.round}:${room.activity?.round || 0}`;
        if (
          room.status === "playing" &&
          room.activity?.kind === "telepathy" &&
          room.activity.phase === "choosing" &&
          !room.activity.submittedIds.includes(this.peer) &&
          !this.telepathyRounds.has(telepathyKey)
        ) {
          this.telepathyRounds.add(telepathyKey);
          window.setTimeout(() => this.emit("data", {
            type: "action",
            action: "telepathy-choice",
            payload: { choice: 0 },
          }), 30);
        }
        const drawingKey = `${room.round}:${room.activity?.round || 0}`;
        if (
          room.status === "playing" &&
          room.activity?.kind === "drawing" &&
          room.activity.phase === "drawing" &&
          !this.drawingRounds.has(drawingKey)
        ) {
          this.drawingRounds.add(drawingKey);
          if (room.activity.drawerId === this.peer) {
            window.setTimeout(() => this.emit("data", {
              type: "action",
              action: "drawing-stroke",
              payload: {
                color: "#e85d4a",
                width: 6,
                points: [{ x: 0.15, y: 0.2 }, { x: 0.75, y: 0.7 }],
              },
            }), 80);
          } else {
            (window.OnlineActivityLogic?.DRAWING_WORDS || []).forEach((entry, index) => {
              window.setTimeout(() => this.emit("data", {
                type: "action",
                action: "drawing-guess",
                payload: { guess: entry.answer },
              }), 800 + index * 10);
            });
          }
        }
        const match = room.activity?.matches?.find(
          (entry) =>
            entry.phase === "choosing" &&
            (entry.leftId === this.peer || entry.rightId === this.peer),
        );
        const matchKey = match ? `${room.round}:${room.activity.stage}:${match.id}` : "";
        if (
          room.status === "playing" &&
          room.activity?.kind === "rps" &&
          match &&
          !this.rpsMatches.has(matchKey)
        ) {
          this.rpsMatches.add(matchKey);
          window.setTimeout(
            () => this.emit("data", {
              type: "action",
              action: "rps-choice",
              payload: { choice: "scissors" },
            }),
            30,
          );
        }
      }

      close() {
        this.open = false;
      }
    }

    window.__DDACK_PEER_CTOR__ = class FakePeer extends FakeEmitter {
      constructor(id) {
        super();
        this.id = id || "online-self";
        window.setTimeout(() => {
          this.emit("open", this.id);
          if (!String(this.id).startsWith("ddak-room-")) return;
          const connection = new FakeConnection();
          this.emit("connection", connection);
          window.setTimeout(() => {
            connection.emit("data", {
              type: "join",
              version: 5,
              nickname: "준호",
            });
            window.setTimeout(() => {
              connection.emit("data", { type: "ready", ready: true });
            }, 20);
          }, 20);
        }, 0);
      }

      destroy() {}
    };
  });
}

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

test("offers three deterministic daily challenges", async ({ page }) => {
  await page.goto("/");
  const choices = page.locator("#dailyChallengeChoices button");
  await expect(choices).toHaveCount(3);
  await expect(choices.first()).toHaveAttribute("aria-pressed", "true");
  await choices.nth(1).click();
  await expect(choices.nth(1)).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("#dailyChallengeTitle")).toContainText("오늘의 도전");
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

test("creates an online room and starts a synchronized match", async ({ page }) => {
  await installFakeOnlinePeer(page);
  await page.goto("/");
  await page.getByRole("button", { name: "온라인 방" }).click();

  const dialog = page.getByRole("dialog", { name: "온라인 친구 대결" });
  await expect(dialog).toBeVisible();
  await dialog.getByLabel("내 닉네임").fill("민지");
  await dialog.getByRole("button", { name: "새 방 만들기" }).click();

  await expect(dialog.getByText("민지 (나)")).toBeVisible();
  await expect(dialog.locator("#onlinePlayerList").getByText("준호", { exact: true })).toBeVisible();
  const roomCode = await dialog.locator("#onlineLobbyCode").innerText();
  expect(roomCode).toMatch(/^[A-HJ-NP-Z2-9]{6}$/);
  await expect(dialog.locator("[data-online-game]")).toHaveCount(12);
  await expect(dialog.locator("[data-online-series]")).toHaveCount(4);
  await expect(dialog.locator("#onlineInviteQr")).toHaveAttribute("src", /^data:image\/gif;base64,/);
  await dialog.locator('[data-online-game="fruit"]').click();
  await expect(dialog.locator('[data-online-game="fruit"]')).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await dialog.locator('[data-online-difficulty="hard"]').click();
  await expect(dialog.locator('[data-online-difficulty="hard"]')).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await expect(dialog.locator("#onlineGameRule")).toContainText("90");
  await dialog.locator('[data-online-game="reaction"]').click();

  const startButton = dialog.getByRole("button", { name: "대결 시작" });
  await expect(startButton).toBeEnabled();
  await startButton.click();
  await expect(page.locator("#onlineCountdownOverlay")).toBeVisible();
  await expect(page.locator("#onlineCountdownOverlay")).toBeHidden({ timeout: 6000 });
  await expect(page.getByRole("heading", { name: "개인 반응속도" })).toBeVisible();
  await expect(page.locator("#onlineRoomBar")).toContainText(roomCode);
});

test("plays a buzzer quiz and an automatic rock-paper-scissors bracket", async ({ page }) => {
  await installFakeOnlinePeer(page);
  await page.goto("/");
  await page.locator("#openOnlineRoom").click();

  const dialog = page.locator("#onlineRoomDialog");
  await dialog.locator("#onlineNickname").fill("민지");
  await dialog.locator("#createOnlineRoom").click();
  await expect(dialog.locator("#onlinePlayerList li")).toHaveCount(2);
  await expect(dialog.locator("#startOnlineMatch")).toBeEnabled();

  await dialog.locator('[data-online-game="initialQuiz"]').click();
  await dialog.locator("#startOnlineMatch").click();
  await expect(page.locator("#onlineCountdownOverlay")).toBeHidden({ timeout: 6000 });
  await expect(page.locator("#onlineActivityArena")).toBeVisible();
  await expect(page.locator("#onlineQuizPanel")).toBeVisible();
  await expect.poll(() => page.locator("#onlineQuizPrompt").innerText()).not.toBe(
    "문제를 준비하고 있어요.",
  );

  for (let score = 1; score <= 3; score += 1) {
    const prompt = await page.locator("#onlineQuizPrompt").innerText();
    await page.locator("#onlineQuizBuzz").click();
    await expect(page.locator("#onlineQuizAnswerForm")).toBeVisible();
    const answer = await page.evaluate(() => {
      const currentPrompt = document.querySelector("#onlineQuizPrompt")?.textContent;
      for (let offset = 0; offset < window.OnlineActivityLogic.QUIZ_BANKS.initialQuiz.length; offset += 1) {
        const question = window.OnlineActivityLogic.getQuizQuestion("initialQuiz", 0, offset);
        if (question.prompt === currentPrompt) return question.answers[0];
      }
      return "";
    });
    expect(answer).not.toBe("");
    await page.locator("#onlineQuizAnswer").fill(answer);
    await page.locator("#onlineQuizAnswerForm button[type='submit']").click();
    if (score < 3) {
      await expect(page.locator("#onlineQuizReveal")).toBeVisible();
      await expect(page.locator("#onlineQuizRevealAnswer")).toHaveText(answer);
      await expect(page.locator("#onlineQuizPrompt")).not.toHaveText(prompt, { timeout: 3000 });
      await expect(page.locator("#onlineQuizBuzz")).toBeEnabled();
    }
  }
  await expect(page.locator("#onlineRoomBarSummary")).toContainText("3점 선점 승리");
  await expect(page.locator("#onlineChooseNextGame")).toBeVisible();
  await page.locator("#onlineChooseNextGame").click();
  await expect(dialog).toBeVisible();
  await expect(dialog.locator("#rematchOnline")).toBeHidden();
  await expect(dialog.locator("#startOnlineMatch")).toBeEnabled();
  await dialog.locator('[data-online-game="rps"]').click();
  await dialog.locator("#startOnlineMatch").click();
  await expect(page.locator("#onlineCountdownOverlay")).toBeHidden({ timeout: 6000 });
  await expect(page.locator("#onlineRpsPanel")).toBeVisible();
  await expect(page.locator('[data-rps-choice="rock"]')).toBeEnabled();
  await page.locator('[data-rps-choice="rock"]').click();
  await expect(page.locator("#onlineRoomBarSummary")).toContainText(
    "토너먼트 우승",
    { timeout: 4000 },
  );
});

test("plays telepathy rounds and a private-word drawing match", async ({ page }) => {
  await installFakeOnlinePeer(page);
  await page.goto("/");
  await page.locator("#openOnlineRoom").click();
  const dialog = page.locator("#onlineRoomDialog");
  await dialog.locator("#onlineNickname").fill("민지");
  await dialog.locator("#createOnlineRoom").click();
  await expect(dialog.locator("#onlinePlayerList li")).toHaveCount(2);

  await dialog.locator('[data-online-game="telepathy"]').click();
  await dialog.locator("#startOnlineMatch").click();
  await expect(page.locator("#onlineCountdownOverlay")).toBeHidden({ timeout: 6000 });
  await expect(page.locator("#onlineTelepathyPanel")).toBeVisible();
  for (let round = 1; round <= 5; round += 1) {
    await expect(page.locator("#onlineTelepathyRound")).toContainText(`ROUND ${round}`);
    await page.locator("#onlineTelepathyChoices button").first().click();
    if (round < 5) {
      await expect(page.locator("#onlineTelepathyRound")).toContainText(
        `ROUND ${round + 1}`,
        { timeout: 4000 },
      );
    }
  }
  await expect(page.locator("#onlineRoomBarSummary")).toContainText("1위", { timeout: 4000 });
  await page.locator("#onlineChooseNextGame").click();
  await expect(dialog).toBeVisible();

  await dialog.locator('[data-online-game="drawing"]').click();
  await dialog.locator("#startOnlineMatch").click();
  await expect(page.locator("#onlineCountdownOverlay")).toBeHidden({ timeout: 6000 });
  await expect(page.locator("#onlineDrawingPanel")).toBeVisible();
  await expect(page.locator("#onlineDrawingRole")).toContainText("제시어");
  const canvas = page.locator("#onlineDrawingCanvas");
  const box = await canvas.boundingBox();
  await page.mouse.move(box.x + 40, box.y + 50);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width - 50, box.y + box.height - 60, { steps: 8 });
  await page.mouse.up();
  await expect(page.locator("#onlineDrawingReveal")).toBeVisible({ timeout: 3000 });

  await expect(page.locator("#onlineDrawingRound")).toContainText("ROUND 2", { timeout: 4000 });
  await expect(page.locator("#onlineDrawingGuessForm")).toBeVisible();
  const guestWord = await page.evaluate(() => window.__FAKE_LAST_ROOM__?.activity?.secretWord || "");
  expect(guestWord).not.toBe("");
  await page.locator("#onlineDrawingGuess").fill(guestWord);
  await page.locator("#onlineDrawingGuessForm button[type='submit']").click();
  await expect(page.locator("#onlineDrawingRevealAnswer")).toHaveText(guestWord);

  await expect(page.locator("#onlineDrawingRound")).toContainText("ROUND 3", { timeout: 4000 });
  await expect(page.locator("#onlineDrawingRole")).toContainText("제시어");
  await expect(page.locator("#onlineChooseNextGame")).toBeVisible({ timeout: 5000 });
  await expect(page.locator("#onlineRoomBarSummary")).toContainText("1위");
});

test("serves the install manifest, PNG icons, and active service worker", async ({ page, request }) => {
  await page.goto("/");
  const manifest = await (await request.get("/manifest.webmanifest?v=44")).json();
  expect(manifest.icons.map((icon) => icon.sizes)).toEqual([
    "192x192",
    "512x512",
    "512x512",
  ]);
  expect(manifest.shortcuts).toHaveLength(4);

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
    .toContain("sw.js?v=44");
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

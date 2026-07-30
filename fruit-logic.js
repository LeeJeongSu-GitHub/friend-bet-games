(function exposeFruitGameLogic(root, factory) {
  const logic = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = logic;
  }
  root.FruitGameLogic = logic;
})(typeof globalThis !== "undefined" ? globalThis : this, function createFruitGameLogic() {
  const tiers = [
    { name: "블루베리", radius: 22, color: "#596fce", points: 1 },
    { name: "체리", radius: 29, color: "#e94e64", points: 3 },
    { name: "딸기", radius: 37, color: "#f45f5b", points: 6 },
    { name: "귤", radius: 46, color: "#f49a3d", points: 10 },
    { name: "사과", radius: 56, color: "#e95355", points: 15 },
    { name: "복숭아", radius: 67, color: "#f39aa0", points: 21 },
    { name: "멜론", radius: 79, color: "#9acb69", points: 28 },
    { name: "수박", radius: 93, color: "#4fa96e", points: 40 },
    { name: "과일 왕관", radius: 110, color: "#f2c84b", points: 80 },
  ].map(Object.freeze);

  function pickDropTier(randomValue) {
    const value = Math.min(Math.max(Number(randomValue) || 0, 0), 0.999999);
    if (value < 0.5) return 0;
    if (value < 0.78) return 1;
    if (value < 0.94) return 2;
    return 3;
  }

  function getMergeResult(firstTier, secondTier) {
    if (
      firstTier !== secondTier ||
      !Number.isInteger(firstTier) ||
      firstTier < 0 ||
      firstTier >= tiers.length - 1
    ) {
      return null;
    }
    const nextTier = firstTier + 1;
    return {
      nextTier,
      points: tiers[nextTier].points,
      complete: nextTier === tiers.length - 1,
    };
  }

  function getMergedMotion(
    firstVelocity,
    secondVelocity,
    firstAngularVelocity = 0,
    secondAngularVelocity = 0,
  ) {
    const averageX = (firstVelocity.x + secondVelocity.x) / 2;
    const averageY = (firstVelocity.y + secondVelocity.y) / 2;
    const averageAngular =
      (firstAngularVelocity + secondAngularVelocity) / 2;
    return {
      velocity: {
        x: Math.min(0.22, Math.max(-0.22, averageX * 0.12)),
        y: Math.min(0.22, Math.max(0.03, averageY * 0.08)),
      },
      angularVelocity: Math.min(
        0.0025,
        Math.max(-0.0025, averageAngular * 0.06),
      ),
    };
  }

  function isDragGesture(startX, startY, currentX, currentY, threshold = 12) {
    return Math.hypot(currentX - startX, currentY - startY) >= threshold;
  }

  return Object.freeze({
    tiers: Object.freeze(tiers),
    pickDropTier,
    getMergeResult,
    getMergedMotion,
    isDragGesture,
  });
});

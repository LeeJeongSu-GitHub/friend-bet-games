(function exposeStackGameLogic(root, factory) {
  const logic = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = logic;
  }
  root.StackGameLogic = logic;
})(typeof globalThis !== "undefined" ? globalThis : this, function createStackGameLogic() {
  function calculatePlacement(active, top, perfectTolerance) {
    const activeRight = active.x + active.width;
    const topRight = top.x + top.width;
    const overlapStart = Math.max(active.x, top.x);
    const overlapEnd = Math.min(activeRight, topRight);
    const overlap = overlapEnd - overlapStart;

    if (overlap <= 0) {
      return {
        hit: false,
        perfect: false,
        placed: null,
        fragment: {
          x: active.x,
          width: active.width,
        },
      };
    }

    if (Math.abs(active.x - top.x) <= perfectTolerance) {
      return {
        hit: true,
        perfect: true,
        placed: {
          x: top.x,
          width: top.width,
        },
        fragment: null,
      };
    }

    const fragment =
      active.x < top.x
        ? {
            x: active.x,
            width: top.x - active.x,
          }
        : {
            x: overlapEnd,
            width: activeRight - overlapEnd,
          };

    return {
      hit: true,
      perfect: false,
      placed: {
        x: overlapStart,
        width: overlap,
      },
      fragment: fragment.width > 0.5 ? fragment : null,
    };
  }

  return Object.freeze({
    calculatePlacement,
  });
});

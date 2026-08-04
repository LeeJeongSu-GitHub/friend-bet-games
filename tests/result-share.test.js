const assert = require("node:assert/strict");
const ResultShare = require("../result-share.js");

const context = {
  measureText(text) {
    return { width: text.length * 10 };
  },
};

assert.deepEqual(
  ResultShare.wrapCanvasText(context, "같은 조건으로 친구에게 도전", 40, 4),
  ["같은", "조건으로", "친구에게", "도전"],
);
assert.deepEqual(
  ResultShare.wrapCanvasText(context, "abcdefghij", 30, 4),
  ["abc", "def", "ghi", "j"],
);
assert.deepEqual(
  ResultShare.wrapCanvasText(context, "하나 둘 셋 넷 다섯", 30, 2),
  ["하나", "둘 셋..."],
);

console.log("result share helper tests passed");

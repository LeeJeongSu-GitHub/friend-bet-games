(function attachResultShare(root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.ResultShare = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function createResultShare() {
  "use strict";

  function roundedRectPath(context, x, y, width, height, radius) {
    const safeRadius = Math.min(radius, width / 2, height / 2);
    context.beginPath();
    context.roundRect?.(x, y, width, height, safeRadius);
    if (typeof context.roundRect === "function") return;
    context.moveTo(x + safeRadius, y);
    context.lineTo(x + width - safeRadius, y);
    context.quadraticCurveTo(x + width, y, x + width, y + safeRadius);
    context.lineTo(x + width, y + height - safeRadius);
    context.quadraticCurveTo(x + width, y + height, x + width - safeRadius, y + height);
    context.lineTo(x + safeRadius, y + height);
    context.quadraticCurveTo(x, y + height, x, y + height - safeRadius);
    context.lineTo(x, y + safeRadius);
    context.quadraticCurveTo(x, y, x + safeRadius, y);
    context.closePath();
  }

  function wrapCanvasText(context, text, maxWidth, maxLines = 6) {
    const lines = [];
    String(text)
      .split("\n")
      .forEach((paragraph) => {
        const words = paragraph.split(/\s+/).filter(Boolean);
        let line = "";
        words.forEach((word) => {
          const candidate = line ? `${line} ${word}` : word;
          if (context.measureText(candidate).width <= maxWidth) {
            line = candidate;
            return;
          }
          if (line) lines.push(line);
          if (context.measureText(word).width <= maxWidth) {
            line = word;
            return;
          }
          let fragment = "";
          [...word].forEach((character) => {
            if (context.measureText(fragment + character).width > maxWidth) {
              if (fragment) lines.push(fragment);
              fragment = character;
            } else {
              fragment += character;
            }
          });
          line = fragment;
        });
        if (line) lines.push(line);
      });
    if (lines.length <= maxLines) return lines;
    const visible = lines.slice(0, maxLines);
    visible[maxLines - 1] = visible[maxLines - 1].replace(/[. ]+$/, "") + "...";
    return visible;
  }

  function createCanvas(result, options = {}) {
    const canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1080;
    const context = canvas.getContext("2d");
    context.fillStyle = "#f4f5f7";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "#ffd54a";
    context.fillRect(0, 0, canvas.width, 34);
    context.fillStyle = "#17191d";
    context.fillRect(0, canvas.height - 30, canvas.width, 30);

    roundedRectPath(context, 82, 80, 916, 920, 28);
    context.fillStyle = "#ffffff";
    context.fill();
    context.strokeStyle = "#17191d";
    context.lineWidth = 8;
    context.stroke();

    roundedRectPath(context, 112, 112, 112, 112, 18);
    context.fillStyle = "#ffd54a";
    context.fill();
    context.strokeStyle = "#17191d";
    context.lineWidth = 6;
    context.stroke();
    context.fillStyle = "#17191d";
    context.font = '900 38px "Malgun Gothic", Arial, sans-serif';
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText("딱!", 168, 168);

    context.textAlign = "left";
    context.fillStyle = "#d93f32";
    context.font = '900 22px "Malgun Gothic", Arial, sans-serif';
    context.fillText("FRIEND BET & MINI GAMES", 258, 140);
    context.fillStyle = "#17191d";
    context.font = '900 44px "Malgun Gothic", Arial, sans-serif';
    context.fillText("딱! 정해", 258, 191);

    context.fillStyle = "#656b75";
    context.font = '800 25px "Malgun Gothic", Arial, sans-serif';
    context.fillText(options.gameLabel || result.gameLabel || "게임 결과", 116, 302);
    context.fillStyle = "#17191d";
    context.font = '900 32px "Malgun Gothic", Arial, sans-serif';
    context.fillText(result.lead || "이번 결과", 116, 354);

    context.font = result.list
      ? '900 43px "Malgun Gothic", Arial, sans-serif'
      : '900 74px "Malgun Gothic", Arial, sans-serif';
    context.fillStyle = result.list ? "#17191d" : "#d93f32";
    const resultLines = wrapCanvasText(context, result.displayText, 830, 7);
    const lineHeight = result.list ? 68 : 94;
    let resultY = 445;
    resultLines.forEach((line) => {
      context.fillText(line, 116, resultY);
      resultY += lineHeight;
    });

    const infoY = Math.max(735, Math.min(838, resultY + 28));
    context.strokeStyle = "#dfe2e7";
    context.lineWidth = 3;
    context.beginPath();
    context.moveTo(116, infoY - 35);
    context.lineTo(964, infoY - 35);
    context.stroke();
    context.fillStyle = "#656b75";
    context.font = '800 21px "Malgun Gothic", Arial, sans-serif';
    context.fillText(result.stakeLabel || "기록", 116, infoY);
    context.fillStyle = "#17191d";
    context.font = '900 29px "Malgun Gothic", Arial, sans-serif';
    wrapCanvasText(context, result.stake || "", 830, 2).forEach((line, index) => {
      context.fillText(line, 116, infoY + 48 + index * 40);
    });

    context.fillStyle = "#656b75";
    context.font = '700 20px "Malgun Gothic", Arial, sans-serif';
    context.fillText(
      `${options.difficultyLabel || "기록"} · ${options.dateLabel || ""}`,
      116,
      946,
    );
    context.textAlign = "right";
    context.fillText(
      result.challengeUrl
        ? "공유 링크에서 같은 조건으로 도전하세요"
        : "친구에게 공유하고 기록에 도전하세요",
      964,
      946,
    );
    return canvas;
  }

  function canvasToBlob(canvas) {
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error("결과 이미지를 만들지 못했습니다."));
      }, "image/png");
    });
  }

  async function createFile(result, options = {}) {
    const blob = await canvasToBlob(createCanvas(result, options));
    return new File([blob], `ddak-result-${Date.now()}.png`, {
      type: "image/png",
    });
  }

  function download(file) {
    const url = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = url;
    link.download = file.name;
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return { wrapCanvasText, createCanvas, createFile, download };
});

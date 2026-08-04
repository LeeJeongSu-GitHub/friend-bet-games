const fs = require("node:fs");
const path = require("node:path");
const sharp = require("sharp");

const root = path.resolve(__dirname, "..");
const source = path.join(root, "favicon.svg");
const output = path.join(root, "icons");

async function build() {
  fs.mkdirSync(output, { recursive: true });
  await sharp(source).resize(192, 192).png().toFile(path.join(output, "icon-192.png"));
  await sharp(source).resize(512, 512).png().toFile(path.join(output, "icon-512.png"));

  const safeLogo = await sharp(source).resize(400, 400).png().toBuffer();
  await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: "#ffd54a",
    },
  })
    .composite([{ input: safeLogo, left: 56, top: 56 }])
    .png()
    .toFile(path.join(output, "icon-maskable-512.png"));
}

build().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

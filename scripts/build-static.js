const fs = require("fs");
const path = require("path");

require("./inject-env.js");

const root = path.join(__dirname, "..");
const dist = path.join(root, "dist");

const copy = [
  "index.html",
  "css/styles.css",
  "js/main.js",
  "js/config.js",
];

if (fs.existsSync(dist)) {
  fs.rmSync(dist, { recursive: true });
}
fs.mkdirSync(dist, { recursive: true });
fs.mkdirSync(path.join(dist, "css"), { recursive: true });
fs.mkdirSync(path.join(dist, "js"), { recursive: true });

for (const rel of copy) {
  fs.copyFileSync(path.join(root, rel), path.join(dist, rel));
}

console.log("Static site ready in dist/");

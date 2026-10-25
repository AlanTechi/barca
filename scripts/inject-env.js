const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const envPath = path.join(root, ".env");
const outPath = path.join(root, "js", "config.js");

function parseEnv(content) {
  const out = {};
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    out[key] = val;
  }
  return out;
}

const defaults = {
  WALLET_ETH: "0x0000000000000000000000000000000000000000",
  WALLET_USDT_ETH: "0x0000000000000000000000000000000000000000",
};

let walletEth = defaults.WALLET_ETH;
let walletUsdtEth = defaults.WALLET_USDT_ETH;

if (fs.existsSync(envPath)) {
  const env = parseEnv(fs.readFileSync(envPath, "utf8"));
  if (env.WALLET_ETH) walletEth = env.WALLET_ETH;
  if (env.WALLET_USDT_ETH) walletUsdtEth = env.WALLET_USDT_ETH;
} else {
  console.warn("No .env found — set WALLET_ETH and WALLET_USDT_ETH.");
}

const js = `/* Generated from .env — run: npm run config */
window.SITE_CONFIG = Object.freeze({
  walletEth: ${JSON.stringify(walletEth)},
  walletUsdtEth: ${JSON.stringify(walletUsdtEth)},
});
`;

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, js, "utf8");
console.log("Wrote js/config.js");

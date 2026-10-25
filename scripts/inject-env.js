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

const fromFile = fs.existsSync(envPath)
  ? parseEnv(fs.readFileSync(envPath, "utf8"))
  : {};

/** Cloudflare/Vercel/etc. inject build env into process.env (no .env file). */
function pick(key) {
  const fromProcess = process.env[key];
  if (fromProcess && String(fromProcess).trim()) {
    return String(fromProcess).trim();
  }
  if (fromFile[key] && String(fromFile[key]).trim()) {
    return String(fromFile[key]).trim();
  }
  return defaults[key];
}

const walletEth = pick("WALLET_ETH");
const walletUsdtEth = pick("WALLET_USDT_ETH");

if (walletEth === defaults.WALLET_ETH) {
  console.warn(
    "WALLET_ETH not set — use .env locally or build variables on Cloudflare."
  );
}

const js = `/* Generated at build — run: npm run config */
window.SITE_CONFIG = Object.freeze({
  walletEth: ${JSON.stringify(walletEth)},
  walletUsdtEth: ${JSON.stringify(walletUsdtEth)},
});
`;

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, js, "utf8");
console.log(
  "Wrote js/config.js (ETH …" + walletEth.slice(-4) + ")"
);

import { networkInterfaces } from "node:os";

const port = process.env.PORT || "5173";
const nets = networkInterfaces();
const ips = [];

for (const list of Object.values(nets)) {
  if (!list) continue;
  for (const net of list) {
    if (net.family !== "IPv4" || net.internal) continue;
    ips.push(net.address);
  }
}

console.log("");
console.log("  Open on your phone (same Wi‑Fi as this Mac):");
if (ips.length === 0) {
  console.log("  (no LAN IPv4 found — check Wi‑Fi / run: ipconfig getifaddr en0)");
} else {
  for (const ip of ips) {
    console.log(`  http://${ip}:${port}/`);
  }
}
console.log("  Use http:// not https://");
console.log("");

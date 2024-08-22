const { exec } = require("child_process");
const os = require("os");
const fs = require("fs");
const path = require("path");

const platform = os.platform();
const binaryPath = path.join(process.cwd(), "binaries");

let binaryName;

// if (platform === "linux") {
//   binaryName =  "muffet-linux"
// }
if (platform === "darwin") {
  binaryName = "muffet-macos";
}
// else if (platform === "win32") {
//   binaryName =  "muffet-windows.exe"
// }
else {
  console.error("Unsupported OS!");
  process.exit(1);
}

const sourcePath = path.join(`${process.cwd()}/binaries`, binaryName);
const destDir = path.resolve(process.cwd(), "..", "node_modules/.bin");
const destPath = path.join(
  destDir,
  platform === "win32" ? "muffet.exe" : "muffet"
);

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

fs.copyFileSync(sourcePath, destPath);
fs.chmodSync(destPath, 0o755);

console.log("Muffet binary installed successfully at", destPath);

const { exec } = require("child_process");
const util = require("util");
const path = require("path");
const execPromise = util.promisify(exec);

const MUFFET_VERSION = "2.10.2";

const muffetPath = path.join(
  process.cwd(),
  "node_modules",
  ".bin",
  process.platform === "win32" ? "muffet.exe" : "muffet"
);

async function runMuffet(url, opts) {
  const {
    // TODO: support all options
    maxConnections,
    bufferSize,
    color,
    skipTlsVerification,
    format,
    onePageOnly,
    // TODO: convert headers from array to string
    headers,
    timeout,
    // specific to this wrapper
    outputMuffetCommand,
  } = opts || {};

  // TODO: some validation on the options, if user supplied wrong options

  const muffetCommand = `${muffetPath} ${url} ${
    timeout ? `--timeout=${timeout}s` : ""
  } ${
    maxConnections ? `--max-connections=${maxConnections}` : ""
  } --buffer-size=8192 --color=never --skip-tls-verification --one-page-only --format=json --header="User-Agent: Muffet/${MUFFET_VERSION}"`;

  if (outputMuffetCommand) {
    console.log("Muffet command:", muffetCommand);
  }

  try {
    return await execPromise(muffetCommand);
  } catch (error) {
    console.error("Error running muffet", error);
  }
}

module.exports = runMuffet;

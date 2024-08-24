const { exec } = require("child_process");
const util = require("util");
const path = require("path");
const compact = require("lodash/compact");
const execPromise = util.promisify(exec);

const MUFFET_VERSION = "2.10.2";
const COLOR_OPTIONS = ["always", "auto", "never"];
const FORMAT_OPTIONS = ["json", "text", "junit"];

const muffetPath = path.join(
  process.cwd(),
  "node_modules",
  ".bin",
  process.platform === "win32" ? "muffet.exe" : "muffet"
);

function getOptionString(options) {
  const {
    // TODO: support all options
    maxConnections,
    maxConnectionsPerHost,
    maxResponseBodySize,
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
  } = options || {};

  if (timeout && (!Number.isInteger(timeout) || timeout < 0)) {
    throw new Error("timeout must be a positive integer");
  }

  if (
    maxConnections &&
    (!Number.isInteger(maxConnections) || maxConnections < 0)
  ) {
    throw new Error("maxConnections must be a positive integer");
  }

  if (
    maxConnectionsPerHost &&
    (!Number.isInteger(maxConnectionsPerHost) || maxConnectionsPerHost < 0)
  ) {
    throw new Error("maxConnectionsPerHost must be a positive integer");
  }

  if (
    maxResponseBodySize &&
    (!Number.isInteger(maxResponseBodySize) || maxResponseBodySize < 0)
  ) {
    throw new Error("maxResponseBodySize must be a positive integer");
  }

  if (bufferSize && (!Number.isInteger(bufferSize) || bufferSize < 0)) {
    throw new Error("bufferSize must be a positive integer");
  }

  if (color && !COLOR_OPTIONS.includes(color)) {
    throw new Error(`color must be one of ${COLOR_OPTIONS.join(", ")}`);
  }

  if (format && !FORMAT_OPTIONS.includes(format)) {
    throw new Error(`format must be one of ${FORMAT_OPTIONS.join(", ")}`);
  }

  const optionsArray = compact([
    timeout ? `--timeout=${timeout}` : null,
    maxConnections ? `--max-connections=${maxConnections}` : null,
    maxConnectionsPerHost
      ? ` --max-connections-per-host=${maxConnectionsPerHost}`
      : null,
    maxResponseBodySize
      ? ` --max-response-body-size=${maxResponseBodySize}`
      : null,
    bufferSize ? `--buffer-size=${bufferSize}` : null,
    color ? ` --color=${color}` : null,
    skipTlsVerification ? "--skip-tls-verification" : null,
    onePageOnly ? "--one-page-only" : null,
    format ? `--format=${format}` : null,
    // TODO: migrate headers to string
    `--header="User-Agent: Muffet/${MUFFET_VERSION}"`,
  ]);

  return optionsArray.join(" ");
}

async function runMuffet(url, options) {
  const muffetCommand = `${muffetPath} ${url} ${getOptionString(options)}`;

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

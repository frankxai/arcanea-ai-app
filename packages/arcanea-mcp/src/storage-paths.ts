import { homedir } from "node:os";
import { isAbsolute, join, resolve } from "node:path";

export function getDataDirectory(): string {
  const configured = process.env.ARCANEA_DATA_DIR;
  if (configured !== undefined) {
    if (!isAbsolute(configured))
      throw new Error("ARCANEA_DATA_DIR must be an absolute path.");
    return resolve(configured);
  }
  return join(homedir(), ".arcanea");
}

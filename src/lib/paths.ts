import path from "node:path";
import os from "node:os";

export const DEFAULT_APPS_DIR = path.join(os.homedir(), "vforge-apps");

export function resolveOutputPath(slug: string, customPath?: string): string {
  if (customPath) {
    if (path.isAbsolute(customPath)) return path.join(customPath, slug);
    return path.resolve(customPath, slug);
  }
  return path.join(DEFAULT_APPS_DIR, slug);
}

export function pluginTemplatePath(): string {
  return new URL("../templates/next-shadcn-base", import.meta.url).pathname;
}

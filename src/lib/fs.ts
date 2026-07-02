import { cp } from "node:fs/promises";
import path from "node:path";
import { existsSync } from "node:fs";

export async function copyTemplate(templatePath: string, outputPath: string): Promise<void> {
  await cp(templatePath, outputPath, { recursive: true, force: true });
}

export async function writeGeneratedFile(
  outputPath: string,
  relativePath: string,
  content: string,
): Promise<void> {
  const target = path.join(outputPath, relativePath);
  const dir = path.dirname(target);
  if (!existsSync(dir)) {
    await mkdir(dir, { recursive: true });
  }
  await writeFile(target, content, "utf-8");
}

export { existsSync };
import { mkdir, writeFile } from "node:fs/promises";

import { spawn } from "node:child_process";

export interface PreviewOptions {
  projectPath: string;
  slug: string;
  port?: number;
}

export async function offerPreview(options: PreviewOptions): Promise<void> {
  // In the plugin context, we cannot prompt interactively from a library.
  // This helper returns the exact commands the user should run.
  const port = options.port || 3000;
  const imageName = `vforge-${options.slug}`;
  const containerName = `vforge-${options.slug}`;

  console.log(`\nTo preview the generated app, run:\n`);
  console.log(`cd ${options.projectPath}`);
  console.log(`podman build -t ${imageName} .`);
  console.log(`podman run --rm --name ${containerName} -p ${port}:3000 ${imageName}`);
  console.log(`\nThen open http://localhost:${port}`);
}

export async function startPreview(options: PreviewOptions): Promise<{ success: boolean; url: string }> {
  const port = options.port || 3000;
  const imageName = `vforge-${options.slug}`;
  const containerName = `vforge-${options.slug}`;

  return new Promise((resolve) => {
    const build = spawn("podman", ["build", "-t", imageName, "."], {
      cwd: options.projectPath,
      stdio: "ignore",
    });
    build.on("close", (buildCode) => {
      if (buildCode !== 0) {
        resolve({ success: false, url: "" });
        return;
      }
      spawn("podman", ["run", "--rm", "--name", containerName, "-p", `${port}:3000`, imageName], {
        cwd: options.projectPath,
        stdio: "ignore",
        detached: true,
      }).unref();
      resolve({ success: true, url: `http://localhost:${port}` });
    });
  });
}

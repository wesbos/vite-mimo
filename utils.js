import { readdir } from "fs/promises";
import { resolve } from "path";
export async function getFiles(dir) {
  const dirents = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    dirents.map((dirent) => {
      const res = resolve(dir, dirent.name);
      return dirent.isDirectory() ? getFiles(res) : res;
    })
  );
  return Array.prototype.concat(...files);
}

export function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

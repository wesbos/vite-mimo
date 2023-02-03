import { build } from "vite";
import { parse } from "node-html-parser";
import { readdir, readFile, rm, writeFile } from "fs/promises";
import path, { resolve } from "path";
import { getFiles } from './utils.js';

// Get the HTML of our one entry
const index = await readFile("./index.html", "utf8");
// parse it into a DOM tree
const root = parse(index);
// get all the link tags
const assetTags = root.querySelectorAll('link[rel="stylesheet"], script[type="module"]');
// Empty the dist folder
await rm("./dist", { recursive: true, force: true });

const thePromiseLand = assetTags.map(async (tag) => {
  const src = tag.getAttribute("href") || tag.getAttribute("src");
  const fileExtension = path.extname(src);
  const fileName = path.basename(src, fileExtension);
  const built = await build({
    configFile: false,
    clearScreen: false,
    emptyOutDir: false,
    build: {
      manifest: true,
      rollupOptions: {
        input: src,

        output: {
          dir: `dist/${tag.tagName === 'LINK' ? 'css' : 'js'}`,
          // name it here. Vite has a fileName option, but it only does .js
          assetFileNames: `[name].[hash].[ext]`,
          entryFileNames: `[name].[hash].js`,
        },
      },
    },
  });

  // Find and return the manifest
  const manifest = built.output.find(
    (o) => o.type === "asset" && o.fileName.includes("manifest.json")
  );
  return JSON.parse(manifest.source);
});

const manifests = await Promise.all(thePromiseLand);
// merge all the manifests into one
const manifest = manifests.reduce((acc, cur) => ({ ...acc, ...cur }), {});

// write to file
await writeFile('./dist/manifest.json', JSON.stringify(manifest, null, 2))

// Delete the Manifest files from each sub-dir because we merged them into one
await rm("./dist/css/manifest.json", { force: true });
await rm("./dist/js/manifest.json", { force: true });

// Issue: About 1 in 15 times, this doesn't return the correct amount of files.
const files = await getFiles("./dist");
console.log(`Generated ${files.length} files from ${assetTags.length} tags`);

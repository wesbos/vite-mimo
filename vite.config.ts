import { defineConfig } from "vite";
import { parse } from "node-html-parser";
import { readFile } from "fs/promises";
import path from "path";
import { UserConfig } from 'vite';
import { BuildOptions } from 'vite';
import { PreRenderedAsset  } from 'rollup';

// Get the HTML of our one entry
const index = await readFile("./index.html", "utf8");
// parse it into a DOM tree
const root = parse(index);
// get all the link tags
const assetTags = root.querySelectorAll(
  'link[rel="stylesheet"], script[type="module"]'
);

const inputs = Object.fromEntries(
  assetTags.map((tag) => {
    const src = tag.getAttribute("href") || tag.getAttribute("src");
    if(!src) {
      throw new Error(`No src or href attribute found on tag ${tag}`);
    }
    const fileExtension = path.extname(src);
    const fileName = path.basename(src, fileExtension);
    return [fileName, src];
  })
);

function getDirFromAsset(assetInfo: PreRenderedAsset) {
  if(!assetInfo.name){
    return "assets"
  }
  else if (assetInfo.name.endsWith("css")) {
    return "css";
  } else if (assetInfo.name.endsWith("js")) {
    return "js";
  }
  return "assets";
}

// Run the build
export default defineConfig({
  build: {
    manifest: true,
    rollupOptions: {
      input: inputs,
      output: {
        // dir: `dist/${tag.tagName === "LINK" ? "css" : "js"}`,
        // name it here. Vite has a fileName option, but it only does .js
        assetFileNames: (assetInfo) => {
          const dir = getDirFromAsset(assetInfo);
          return `${dir}/[name].[hash].[ext]`;
        },
        entryFileNames: `js/[name].[hash].js`,
      },
    },
  },
});

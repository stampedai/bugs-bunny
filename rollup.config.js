import typescript from "@rollup/plugin-typescript";
import svelte from "rollup-plugin-svelte";
import sveltePreprocess from "svelte-preprocess";
import css from "rollup-plugin-css-only";
import resolve from "@rollup/plugin-node-resolve";
import { config as configDotenv } from 'dotenv';
import replace from '@rollup/plugin-replace';

configDotenv();

export default [{
    input: ["src/content-scripts/index.ts"],
    output: [{ file: "dist/content-scripts.js", format: "iife" }],
    plugins: [typescript()],
  },
  {
    input: ["src/background.ts"],
    output: [{ file: "dist/background.js", format: "iife" }],
    plugins: [typescript()],
  },
  {
    input: ["src/popup/index.ts"],
    output: [{ file: "dist/popup/bundle.js", format: "iife", name: "app" }],
    plugins: [
      svelte({ preprocess: sveltePreprocess() }),
      css({ output: "bundle.css" }),
      resolve({
        browser: true,
        dedupe: ["svelte"],
      }),
      typescript(),
    ],
  },
  {
    input: ["src/lib/capture.ts"],
    output: [{ file: "dist/lib/capture.js", format: "iife", name: "capture" }],
    plugins: [typescript()],
  },
  {
    input: ["src/lib/draw.ts"],
    output: [{ file: "dist/lib/draw.js", format: "iife", name: "draw" }],
    plugins: [typescript()],
  },
  {
    input: ["src/lib/slack.ts"],
    output: [{ file: "dist/lib/slack.js", format: "iife", name: "slack" }],
    plugins: [typescript()],
  },
  {
    input: ["src/lib/annotate.ts"],
    output: [
      { file: "dist/lib/annotate.js", format: "iife", name: "annotate" },
    ],
    plugins: [typescript()],
  },
  {
    input: ["src/lib/getUser.ts"],
    output: [{ file: "dist/lib/getUser.js", format: "iife", name: "getUser" }],
    plugins: [typescript()],
  },
  {
    input: ["src/lib/base64ToFile.ts"],
    output: [
      {
        file: "dist/lib/base64ToFile.js",
        format: "iife",
        name: "base64ToFile",
      },
    ],
    plugins: [typescript()],
  },
];

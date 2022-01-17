import * as path from "path";
import * as esbuild from "esbuild";
import { nodeExternalsPlugin } from "esbuild-node-externals";

const outputDir = "dist";

const commonSettings: esbuild.BuildOptions = {
  bundle: true,
  outdir: "dist",
  tsconfig: 'tsconfig.json',
  platform: "node",
  metafile: false,
  external: [
    "esbuild",
  ],
  plugins: [
    nodeExternalsPlugin({
      packagePath: 'package.json',
    }),
  ],
}

esbuild.build({
  ...commonSettings,
  entryPoints: {
    "cli": path.join("cli", "index.ts"),
  }
});

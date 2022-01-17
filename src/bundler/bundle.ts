import * as path from "path";
import * as fs from "fs";

import * as esbuild from "esbuild";
import { nodeExternalsPlugin } from "esbuild-node-externals";

import { promisify } from "util";
import { scanFiles } from "src/bundler/scan";
import { fileNameWithoutExt } from "src/utils";


export class Bundler {
  readonly root: string;

  constructor(root: string) {
    this.root = path.resolve(root);
    this.precheck();
  }

  precheck() {

  }

  private generateControllerLoader(importPath: string) {
    return `
import Controller from "${importPath}";
import { AWSHandlerAdapter as Adapter } from "fast-serverless-restful/";
    
const c = new Controller();
const adapter = new Adapter();
export const handler = adapter.adapt("get", c);
`;
  }

  private get tsconfigPath() {
    return path.join(this.root, 'tsconfig.json');
  }

  private get packageJsonPath() {
    return path.join(this.root, 'package.json');
  }

  private async readPackageJson() {
    const content = await promisify(fs.readFile)(this.packageJsonPath);
    return JSON.parse(content.toString());
  }

  private get outputDir() {
    return path.join(this.root, '.fast');
  }

  private get bundleTempDir() {
    return path.join(this.outputDir, '.cache');
  }

  private get serverRoot() {
    return path.join(this.root, 'service');
  }

  private async collectAllControllersAsEntryPoints() {
    const entryPoints: Record<string, string> = {};

    for await (const { path: fullPath } of scanFiles(this.serverRoot)) {
      const entryFn = fileNameWithoutExt(fullPath);
      const loaderPath = path.join(this.bundleTempDir, `entry.${entryFn}.ts`);
      const loaderContent = this.generateControllerLoader(path.relative(this.bundleTempDir, fullPath));
      await promisify(fs.writeFile)(loaderPath, loaderContent);
      entryPoints[entryFn] = loaderPath;
    }

    return entryPoints;
  }

  private getBuildOptions(extra?: Partial<esbuild.BuildOptions>): esbuild.BuildOptions {
    return {
      bundle: true,
      platform: "node",
      metafile: true,
      absWorkingDir: this.root,
      outdir: this.outputDir,
      tsconfig: this.tsconfigPath,
      treeShaking: true,
      plugins: [
        nodeExternalsPlugin({
          packagePath: this.packageJsonPath,
        }),
      ],
      ...extra,
    }
  }

  async build() {
    await esbuild.build(this.getBuildOptions({
      entryPoints: await this.collectAllControllersAsEntryPoints(),
    }));
  }

  async watch() {
    await esbuild.build(this.getBuildOptions({
      entryPoints: await this.collectAllControllersAsEntryPoints(),
      incremental: true,
      watch: {
        onRebuild: (error, result) => {
          if (error) {
            console.error(error);
          } else {
            console.log(`Rebuild success!`, JSON.stringify(result?.metafile));
          }
        }
      }
    }));
  }

  async compileController(filePath: string) {
    const entryFn = fileNameWithoutExt(filePath);
    const outputFile = path.join(this.bundleTempDir, `${entryFn}.js`);
    const result = await esbuild.build(this.getBuildOptions({
      entryPoints: {
        entryFn: filePath,
      },
      outdir: undefined,
      outfile: outputFile,
    }));

    return {
      result,
      output: outputFile,
    }
  }
}


// export async function bundleProject(root: string, bundleOptions?: BundleOptions) {
//   const outputDir = path.join(root, ".fast");
//   const bundleTempDir = path.join(outputDir, '.cache');
//   await promisify(fs.mkdir)(bundleTempDir, { recursive: true });



//   const outdir = path.join(outputDir, await readProjectName(root));

//   const options: esbuild.BuildOptions = {
//     absWorkingDir: root,
//     bundle: true,
//     entryPoints,
//     outdir,
//     tsconfig: path.join(root, 'tsconfig.json'),
//     platform: "node",
//     metafile: true,
//     plugins: [
//       nodeExternalsPlugin({
//         packagePath: path.join(root, 'package.json'),
//       }),
//     ],
//     incremental: bundleOptions?.watch ?? false,
//     watch: {
//       onRebuild: (error, result) => {
//         if (error) {
//           console.error(error);
//         } else {
//           console.log(`Rebuild success!`, JSON.stringify(result?.metafile));
//         }
//       }
//     }
//   }

//   const buildResult = await esbuild.build(options);
//   return buildResult;
// }


// export async function bundleSingleEntry(root: string, entry: string, outputFile: string) {
//   const outputDir = path.join(root, ".fast");
//   const bundleTempDir = path.join(outputDir, '.cache');
//   await promisify(fs.mkdir)(bundleTempDir, { recursive: true });

//   const fullPath = path.join(root, entry);
//   const entryFn = fileNameWithoutExt(fullPath);
//   const loaderPath = path.join(bundleTempDir, `entry.${entryFn}.ts`);
//   const loaderContent = generateLoader(path.relative(bundleTempDir, fullPath));
//   await promisify(fs.writeFile)(loaderPath, loaderContent);

//   const entryPoints: Record<string, string> = {
//     [entryFn]: loaderPath,
//   };

//   const outdir = path.join(outputDir, await readProjectName(root));

//   const options: esbuild.BuildOptions = {
//     absWorkingDir: root,
//     bundle: true,
//     entryPoints,
//     outfile: outputFile,
//     tsconfig: path.join(root, 'tsconfig.json'),
//     platform: "node",
//     metafile: true,
//     plugins: [
//       nodeExternalsPlugin({
//         packagePath: path.join(root, 'package.json'),
//       }),
//     ],
//   }

//   const buildResult = await esbuild.build(options);
//   return buildResult;
// }

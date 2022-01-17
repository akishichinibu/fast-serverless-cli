import { AWSHandlerAdapter } from "src/adapter/aws";
import * as path from "path";
import * as fs from "fs";
import { importAsController, printMeta, scanFiles } from "src/scan";

import * as esbuild from "esbuild";
import { promisify } from "util";
import { nodeExternalsPlugin } from "esbuild-node-externals";
import { bundleAndKeepWatching } from "src/bundler/watcher";


it("test", async () => {
  const projectRoot = "/home/wsl/fast-serverless/test-project";
  const output = path.join(projectRoot, ".serverless");
  await promisify(fs.mkdir)(output, { recursive: true });

  for await (const { path: p } of scanFiles(path.join(projectRoot, "service"))) {
    // for await (const { path: p } of scanFiles(path.join(__dirname, "test-service"))) {
    // const fn = path.join(__dirname, '..', 'src', 'bundler', 'controller-analyser.ts');
    // console.log(fn);

    // const proc = spawn('ts-node', [
    //   fn,
    // ], {
    //   stdio: [
    //     process.stdin,
    //     process.stdout,
    //     process.stderr,
    //   ]
    // });

    const relativeEntryPoint = path.relative(projectRoot, p);
    const watcher = bundleAndKeepWatching(projectRoot, relativeEntryPoint, output);

    // for await (const { path: p, relativePath: rp } of scanFiles(projectRoot)) {
    //   if (dependecies.has(rp)) {
    //     const fullPath = path.join(bundlePath, rp);
    //     await promisify(fs.mkdir)(path.dirname(fullPath), { recursive: true });

        

    //     // await promisify(fs.copyFile)(p, fullPath);
    //   }
    // }

    const entryFile = `
import Controller from "dummy.controller.ts";
import Adapter from "adapter";

const c = new Controller();
const adapter = new Adapter();

export const handler = adapter.adapt("get", c);

    `;

    // await new Promise((resolve) => {
    //   proc.on('close', () => resolve(''));
    // });

    // console.log(proc.stdout && readAll(proc.stdout));
    // console.log(proc.stderr && readAll(proc.stderr));
    // const Controller = await importAsController(p);
    // const c = new Controller();

    // const adapter = new AWSHandlerAdapter();
    // const handler = adapter.adapt("get", c);

    // console.log(await handler(event as any));
  }
});

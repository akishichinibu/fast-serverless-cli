import * as path from "path";
import chalk from "chalk";
import fastify from "fastify";
import * as tsnode from "ts-node";
import * as node from "node:vm";
import { importAsController } from "src/bundler/analyser";
import Y from "./init";
import { Bundler } from "src/bundler/bundle";

import { getEndpointBasePath } from "fast-serverless-core/src/metadata"

Y.command(
  'inspect [path]', 'inspect a controller',

  (y) =>
    y
      .positional('path', {
        type: "string",
        describe: 'The controller path',
        demandOption: true,
      }),

  async (argv) => {
    const cpath = argv.path;

    if (!cpath.endsWith('.controller.ts')) {
      console.log(chalk.bgRedBright('error'));
      return;
    }

    const fullPath = path.resolve(cpath);
    const root = path.resolve(path.dirname(fullPath), "..");
    const entry = path.relative(fullPath, root);

    const bundler = new Bundler(root);

    try {
      const { output } = await bundler.compileController(fullPath);
      const C = await importAsController(output);
      console.log(getAllInternalMetadata(C));
    } catch (error) {
      console.error(error);
    }
  }
);

import chalk from "chalk";
import fastify from "fastify";
import Y from "./init";
import { Bundler } from "src/bundler/bundle";



Y.command(
  'start [path]', 'start the project',

  (y) =>
    y
      .positional('path', {
        type: "string",
        describe: 'The project path',
        default: process.cwd(),
      }),

  async (argv) => {
    const port = 7777;
    const server = fastify({

    });

    server.get

    server.all("*", (req) => {
      console.log(req.method);
      console.log(req.body);
      console.log(req.url);
    });

    const root = argv.path;
    console.log(chalk.blueBright(`Starting to bundle the project in [${root}]`));
    
    server.listen(port, (error) => {
      if (error) {
        throw error;
      }
      console.log(chalk.greenBright(`The HTTP server is listening to ${port}...`));
    });

    const bundler = new Bundler(root);
    await bundler.watch();
  }
)
  .option('verbose', {
    alias: 'v',
    type: 'boolean',
    description: 'Run with verbose logging'
  });

import * as f from "fast-serverless-core";

export async function importAsController(modulePath: string) {
  const module = await import(modulePath);
  const Controller = module['default'] as ClzType<any>;
  return Controller;
}

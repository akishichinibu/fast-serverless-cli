import * as path from 'path';
import * as fs from 'fs';
import { ENDPOINT_FILE_EXT } from 'src/constants';


async function* walk(dir: string): AsyncGenerator<string> {
  const currentDir = await fs.promises.opendir(dir);
  for await (const p of currentDir) {
    const entry = path.join(dir, p.name);
    if (p.isDirectory()) {
      yield* walk(entry);
    } else if (p.isFile() && p.name.endsWith(ENDPOINT_FILE_EXT)) {
      yield entry;
    }
  }
}

export async function* scanFiles(basePath: string) {
  for await (const p of walk(basePath)) {
    const relativePath = path.relative(basePath, p);
    const filename = path.basename(p, ENDPOINT_FILE_EXT);

    yield {
      path: p,
      relativePath,
      filename
    };
  }
}

export function printMeta(target: any, propertyKey?: string) {
  const keys = (propertyKey ? Reflect.getMetadataKeys(target, propertyKey) : Reflect.getMetadataKeys(target)) ?? [];
  console.log(keys);
  for (const key of keys) {
    console.log(`${key}: ${propertyKey ? Reflect.getMetadata(key, target, propertyKey) : Reflect.getMetadata(key, target)}`);
  }
  console.log('#########################');
}

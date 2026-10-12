import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const srcRoot = join(root, 'src');

export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith('@/')) {
    const path = join(srcRoot, specifier.slice(2));
    return nextResolve(pathToFileURL(`${path}.ts`).href, context);
  }

  return nextResolve(specifier, context);
}

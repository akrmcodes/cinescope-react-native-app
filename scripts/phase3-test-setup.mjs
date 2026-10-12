import { register } from 'node:module';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const srcRoot = join(root, 'src');

const memory = new Map();

globalThis.window = {
  localStorage: {
    getItem: (key) => (memory.has(key) ? memory.get(key) : null),
    setItem: (key, value) => {
      memory.set(key, String(value));
    },
    removeItem: (key) => {
      memory.delete(key);
    },
    clear: () => {
      memory.clear();
    },
    key: (index) => [...memory.keys()][index] ?? null,
    get length() {
      return memory.size;
    },
  },
};

globalThis.__phase3TestMemory = memory;

register('./phase3-alias-loader.mjs', import.meta.url);

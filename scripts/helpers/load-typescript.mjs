import { readFileSync, existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import ts from 'typescript';

const root = fileURLToPath(new URL('../../', import.meta.url));

// Execute real server modules with explicit provider doubles; never send mail
// or submit an external form from a regression test.
export function typescriptLoader({ env = {}, overrides = {}, fetch = globalThis.fetch } = {}) {
  const cache = new Map();
  function load(relative) {
    let file = resolve(root, relative);
    if (!existsSync(file)) file += '.ts';
    if (cache.has(file)) return cache.get(file);
    if (file.endsWith('.json')) {
      const data = JSON.parse(readFileSync(file, 'utf8'));
      cache.set(file, data);
      return data;
    }
    const compiledModule = { exports: {} };
    cache.set(file, compiledModule.exports);
    const code = ts.transpileModule(readFileSync(file, 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
    }).outputText;
    vm.runInNewContext(code, {
      module: compiledModule, exports: compiledModule.exports, process: { env }, fetch,
      console: { error() {}, log() {}, warn() {} },
      AbortSignal, Request, Response, URL, URLSearchParams, Set, Map,
      require: specifier => {
        if (Object.hasOwn(overrides, specifier)) return overrides[specifier];
        if (specifier.startsWith('@/')) return load(specifier.slice(2));
        if (specifier.startsWith('.')) return load(resolve(dirname(file), specifier));
        return createRequire(file)(specifier);
      },
    }, { filename: file });
    cache.set(file, compiledModule.exports);
    return compiledModule.exports;
  }
  return load;
}

import { join } from 'path';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';

export default {
  input: join('src', 'index.ts'),
  external: [
    // These Node.js interenals are external to our bundles…
    // …as are the dependencies listed in our package.json.
    ...Object.keys(require('./package.json').dependencies),
  ],
  output: [
    { file: join('build', 'index.cjs'), format: 'cjs' },
    { file: join('build', 'index.mjs'), format: 'es' },
  ],
  plugins: [
    resolve({
      extensions: ['.ts'],
      customResolveOptions: {
        moduleDirectory: 'src',
      },
      preferBuiltins: true,
    }),
    typescript(),
    json(),
  ],
};

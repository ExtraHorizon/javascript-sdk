import { join } from 'path';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';

const { fflate, ...dependencies } = require('./package.json').dependencies

export default {
  input: join('src', 'index.ts'),
  external: [
    // These Node.js interenals are external to our bundles…
    // …as are the dependencies listed in our package.json.
    ...Object.keys(dependencies),
  ],
  output: [
    { file: join('build', 'index.cjs.js'), format: 'cjs' },
    { file: join('build', 'index.mjs'), format: 'es' },
  ],
  plugins: [
    resolve({
      extensions: ['.ts'],
      preferBuiltins: true,
    }),
    typescript(),
    json(),
    terser(),
  ],
};

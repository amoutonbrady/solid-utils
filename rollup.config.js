import del from 'rollup-plugin-delete';
import { babel } from '@rollup/plugin-babel';
import { nodeResolve } from '@rollup/plugin-node-resolve';

import pkg from './package.json';

const extensions = ['.js', '.ts', '.tsx'];

/**
 * @type {import('rollup').RollupOptions}
 */
const config = {
  input: 'src/index.tsx',
  output: [
    {
      name: pkg.name,
      file: pkg.main,
      format: 'commonjs',
    },
    {
      name: pkg.name,
      file: pkg.module,
      format: 'es',
    },
  ],
  external: ['solid-js', 'solid-js/web'],
  plugins: [
    del({ targets: 'dist/*' }),
    nodeResolve({
      extensions,
      preferBuiltins: false,
    }),

    babel({
      extensions,
      babelHelpers: 'bundled',
      presets: ['babel-preset-solid', '@babel/preset-typescript'],
    }),
  ],
};

export default config;

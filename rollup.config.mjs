import fs from 'fs';
import path from 'path';

import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import copy from 'rollup-plugin-copy';
import remove from 'rollup-plugin-delete';

const packageJson = JSON.parse(fs.readFileSync('./package.json').toString());

const tsConfigPath = './tsconfig.json';

export const configFor = (moduleFormat, inputFile, outputFile, extraPlugins = [], extraExternal = []) => {
    const fullInputFile = path.resolve(inputFile);
    const fullOutputFile = path.resolve(outputFile);
    const fullOutputFolder = path.resolve(path.dirname(outputFile));

    return {
        input: fullInputFile,
        output: [
            {
                sourcemap: true,
                file: fullOutputFile,
                format: moduleFormat
            }
        ],
        preserveSymlinks: true,
        plugins: [
            typescript({
                tsconfig: tsConfigPath,
                compilerOptions: {
                    declarationDir: fullOutputFolder
                }
            }),
            commonjs(),
            copy({
                targets: [{ src: './src/@i18n', dest: fullOutputFolder }]
            }),
            remove({ targets: path.join(fullOutputFolder, '@i18n', 'index.ts') }),
            ...extraPlugins
        ],
        external: [/@gobstones\/.*/, /i18next.*/, ...extraExternal]
    };
};

export default [
    // Starting TypeDoc 0.27 plugins and themes are ESM Only
    configFor(
        'esm',
        'src/index.tsx',
        packageJson.exports['.'].import.default,
        [],
        ['assert', 'fs', 'path', 'url', /^typedoc.*/, 'typedoc-plugin-mdn-links', 'typedoc-plugin-merge-modules']
    )
];

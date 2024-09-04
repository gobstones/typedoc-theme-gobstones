export default {
    entryPoints: ['./src'],
    entryPointStrategy: 'expand',
    tsconfig: './tsconfig.json',
    compilerOptions: {
        rootDir: './src'
    },
    out: './docs',
    exclude: ['./node_modules/**/*', './**/*.test.ts', './src/index.ts'],
    plugin: ['@gobstones/typedoc-theme-gobstones'],
    theme: 'gobstones',
    excludeExternals: true,
    excludeInternal: false,
    excludePrivate: false
};

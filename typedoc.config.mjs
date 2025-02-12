export default {
    // Configuration
    tsconfig: './tsconfig.json',
    compilerOptions: {
        rootDir: './src'
    },
    plugin: ['./dist/index.mjs'],
    // Input
    entryPoints: ['./src'],
    // entryPointStrategy: 'expand',
    // exclude: ['./node_modules/**/*', './**/*.test.ts', './src/index.ts'],
    excludeExternals: true,
    excludeInternal: false,
    excludePrivate: false,
    // Output
    out: './docs',
    theme: 'gobstones'
};

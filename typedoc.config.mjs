export default {
    // Configuration
    tsconfig: './tsconfig.json',
    compilerOptions: {
        rootDir: './src'
    },
    plugin: ['./dist/index.mjs'],
    // Input
    entryPoints: ['./src'],
    entryPointStrategy: 'expand',
    // Output
    out: './docs',
    theme: 'gobstones'
};

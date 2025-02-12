const { config } = require('@gobstones/gobstones-scripts');

config.init();
const licenseHeader = config.projectType.licenseHeader.toolingFiles.main;

module.exports = {
    license: `${licenseHeader}`,
    // Configuration works by exclusion, which is weird
    ignore: [
        // Exclude docs and tests
        'docs/',
        'test/',
        // Exclude every file in project-types for gobstones-scripts
        // Except the typescript files in their src folders.
        'project-types/**/src/**/!(*.ts|*.tsx)',
        // Exclude the tests in the project-types for gobstones-scripts
        'project-types/**/test/**/*',
        // Every file in dist is excluded except the javascript and typescript files.
        'dist/**/!(*.d.ts|*.js|*.cjs|*.mjs)',
        // Every file in project, except the typescript files.
        '**/!(*.ts|*.tsx)'
    ],
    defaultFormat: {
        prepend: '/*',
        append: '*/'
    },
    licenseFormats: {
        'ts|tsx|js|jsx': {
            prepend: '/*',
            append: ' */',
            eachLine: {
                prepend: ' * '
            }
        }
    },
    trailingWhitespace: 'TRIM'
};

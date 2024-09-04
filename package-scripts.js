const { tasks } = require('@gobstones/gobstones-scripts');

const defaultConfiguration = {
    options: {
        scripts: false,
        logLevel: 'warn',
        'help-style': 'basic'
    },

    scripts: {
        default: {
            script: tasks.nps('help'),
            hiddenFromHelp: true
        },

        test: {
            script: tasks.nps('lint'),
            description: 'Run ESLint on all the files (src and tests)'
        },

        build: {
            script: tasks.serially(
                tasks.nps('clean.dist'),
                tasks.tsc({ emit: true }),
                tasks.copy({ src: './static', dest: '../dist', cwd: './src' })
            ),
            description: 'Build the application into "dist" folder'
        },

        doc: {
            script: tasks.serially(
                tasks.nps('clean.docs'),
                tasks.typedoc(),
                tasks.copy({ src: './docs/index.html', dest: './docs/globals.html' })
            ),
            description: 'Run Typedoc and generate docs',
            watch: {
                script: tasks.serially(tasks.nps('doc'), tasks.typedoc({ watch: true })),
                description: 'Run Typedoc and generate docs and watch for changes.'
            },
            serve: {
                script: tasks.serially(tasks.nps('doc'), tasks.serve({ dir: './docs' })),
                description: 'Run Typedoc and generate docs, then serve the docs as HTML',
                watch: {
                    script: tasks.serially(
                        tasks.nps('doc'),
                        tasks.concurrently({
                            typedoc: tasks.typedoc({ watch: true }),
                            serve: tasks.serve({ dir: './docs' })
                        })
                    ),
                    description: 'Run Typedoc and generate docs and watch for changes while serving the docs as HTML'
                }
            }
        },

        clean: {
            script: tasks.serially(tasks.nps('clean.dist'), tasks.nps('clean.docs')),
            description: 'Remove all automatically generated files and folders',
            hiddenFromHelp: true,
            dist: {
                script: tasks.remove({ files: './dist' }),
                description: 'Delete the dist folder',
                hiddenFromHelp: true
            },
            docs: {
                script: tasks.remove({ files: './docs' }),
                description: 'Delete the docs folder',
                hiddenFromHelp: true
            }
        },

        lint: {
            script: tasks.eslint(),
            description: 'Run ESLint on all the files (src and tests)',
            fix: {
                script: tasks.eslint({ fix: true }),
                description: 'Run ESLint on all the files (src and tests) with --fix option'
            }
        },

        prettify: {
            script: tasks.serially(
                tasks.prettify({
                    files: './.husky/*[^_]'
                }),
                tasks.prettify({
                    files: './{.github,.vscode,project-types,src,test}/{**,.}/*.{js,jsx,cjs,mjs,ts,tsx,mts,cts,yml,md,json,js}'
                }),
                tasks.prettify({
                    files: '{.czrc,.editorconfig,.gitignore,.npmignore,.npmrc,.prettierrc}'
                }),
                tasks.prettify({
                    files: './*.{js,jsx,cjs,mjs,ts,tsx,mts,cts,yml,md,json,js}'
                })
            ),
            description: 'Run Prettier on all the files, writing the results'
        },

        changelog: {
            script: tasks.npx('conventional-changelog -p angular -i CHANGELOG.md -s'),
            description: 'Generate changelog based on commits',
            scratch: {
                script: tasks.npx('conventional-changelog -p angular -i CHANGELOG.md -s -r 0'),
                description: 'Generate changelog based on tags, starting from scratch',
                hiddenFromHelp: true
            },
            hiddenFromHelp: true
        },

        license: {
            script: tasks.license(),
            hiddenFromHelp: true,
            description: 'Add license information to all code files in the project',
            remove: {
                script: tasks.license('remove'),
                hiddenFromHelp: true,
                description: 'Add license information to all code files in the project'
            }
        }
    }
};

module.exports = defaultConfiguration;

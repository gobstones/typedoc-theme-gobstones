const tasks = {
    nps: (command) => {
        return `nps -c ./package-scripts.cjs ${command}`;
    },
    serially: (...scripts) => {
        return scripts.join(' && ');
    },
    concurrently: (scripts) => {
        const keys = Object.keys(scripts);
        const values = keys.map((k) => `"${scripts[k]}"`);
        const defaultColors = [
            'bgBlue.bold',
            'bgMagenta.bold',
            'bgGreen.bold',
            'bgBlack.bold',
            'bgCyan.bold',
            'bgRed.bold',
            'bgWhite.bold',
            'bgYellow.bold'
        ];

        return (
            'concurrently --kill-others-on-fail ' +
            `--prefix-colors ${defaultColors.slice(0, keys.length).join(',')} ` +
            `--prefix "[{name}]" --names ${keys.join(',')} ` +
            values.join(' ')
        );
    }
};

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

        dev: {
            script: tasks.serially('tsc --noEmit', 'tsx ./src/index.tsx'),
            description: 'Run "index.ts" in development mode',
            watch: {
                script: 'tsx ./src/index.ts --watch ./src/**/*.ts',
                description: 'Run "index.ts" in development mode and watch for changes'
            }
        },

        build: {
            script: tasks.serially(
                tasks.nps('clean.dist'),
                'rollup -c rollup.config.mjs',
                'npx cpy-cli ./static ../../dist --cwd=src'
            ),
            description: 'Build the application into "dist" folder'
        },

        test: {
            script: tasks.serially(tasks.nps('lint'), 'echo "no tests to run"'),
            description: 'Run the tests, including linting'
        },

        doc: {
            script: tasks.serially(tasks.nps('clean.docs'), tasks.nps('build'), 'typedoc'),
            description: 'Run Typedoc and generate docs',
            watch: {
                script: tasks.serially(tasks.nps('doc'), 'typedoc --watch'),
                description: 'Run Typedoc and generate docs and watch for changes.'
            },
            serve: {
                script: tasks.serially(tasks.nps('doc'), 'typedoc', 'serve ./docs'),
                description: 'Run Typedoc and generate docs, then serve the docs as HTML',
                watch: {
                    script: tasks.serially(
                        tasks.nps('doc'),
                        tasks.concurrently({
                            typedoc: 'typedoc --watch',
                            serve: 'serve ./docs'
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
                script: 'rimraf ./dist',
                description: 'Delete the dist folder',
                hiddenFromHelp: true
            },
            docs: {
                script: 'rimraf ./docs',
                description: 'Delete the docs folder',
                hiddenFromHelp: true
            }
        },

        lint: {
            script: 'eslint --format stylish --color',
            description: 'Run ESLint on all the files (src and tests)',
            fix: {
                script: 'eslint --format stylish --color --fix',
                description: 'Run ESLint on all the files (src and tests) with --fix option'
            }
        },

        prettify: {
            script: tasks.serially(
                'prettier --no-error-on-unmatched-pattern --write ./.husky/*[^_]',
                'prettier --no-error-on-unmatched-pattern --write ./{.github,.vscode,src,test}/{**,.}/*.{js,jsx,cjs,mjs,ts,tsx,mts,cts,yml,md,json,js}',
                'prettier --no-error-on-unmatched-pattern --write {.czrc,.editorconfig,.gitignore,.npmignore,.npmrc,.prettierrc}',
                'prettier --no-error-on-unmatched-pattern --write ./*.{js,jsx,cjs,mjs,ts,tsx,mts,cts,yml,md,json,js}'
            ),
            description: 'Run Prettier on all the files, writing the results'
        },

        changelog: {
            script: 'conventional-changelog -p angular -i CHANGELOG.md -s',
            hiddenFromHelp: true,
            description: 'Generate changelog based on tags',
            scratch: {
                script: 'conventional-changelog -p angular -i CHANGELOG.md -s -r 0',
                description: 'Generate changelog based on tags, starting from scratch',
                hiddenFromHelp: true
            }
        },

        license: {
            script: tasks.serially(tasks.nps('build'), 'license-check-and-add add -f ./license.config.json '),
            hiddenFromHelp: true,
            description: 'Add license information to all code files in the project',
            remove: {
                script: tasks.serially(tasks.nps('build'), 'license-check-and-add remove -f ./license.config.json'),
                hiddenFromHelp: true,
                description: 'Remove license information to all code files in the project'
            }
        }
    }
};

module.exports = defaultConfiguration;

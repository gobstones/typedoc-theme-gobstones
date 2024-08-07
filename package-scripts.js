module.exports = {
    options: {
        scripts: false,
        logLevel: 'warn',
        'help-style': 'basic'
    },

    scripts: {
        default: {
            script: 'nps help',
            hiddenFromHelp: true
        },

        test: {
            script: 'nps lint',
            description: 'Run ESLint on all the files (src and tests)'
        },

        build: {
            script: 'nps clean.dist ' + '&& tsc',
            description: 'Build the application into "dist" folder'
        },

        clean: {
            script: 'nps clean.dist && nps clean.docs',
            description: 'Remove all automatically generated files and folders',
            hiddenFromHelp: true,
            dist: {
                script: 'rimraf ./dist',
                description: 'Delete the dist folder',
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
            script:
                'prettier --no-error-on-unmatched-pattern --write + ' +
                './{src,.github,.vscode,.husky,.}/{**,.}' + // folders
                '/*.{js,jsx,cjs,mjs,ts,tsx,cts,json,json5,yml,yaml,md,markdown}', // extensions
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
            script: 'license-check-and-add add -f ./license.config.json ',
            hiddenFromHelp: true,
            description: 'Add license information to all code files in the project',
            remove: {
                script: 'license-check-and-add remove -f ./license.config.json ',
                hiddenFromHelp: true,
                description: 'Remove license information to all code files in the project'
            }
        }
    }
};

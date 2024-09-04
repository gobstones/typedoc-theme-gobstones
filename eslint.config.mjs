import path from 'path';
import { fileURLToPath } from 'url';

import { includeIgnoreFile } from '@eslint/compat';
import { FlatCompat } from '@eslint/eslintrc';
import eslintJs from '@eslint/js';
import eslintPluginNoNull from 'eslint-plugin-no-null';
import eslintPluginPreferArrow from 'eslint-plugin-prefer-arrow';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import eslintTs from 'typescript-eslint';

const baseUrl = path.resolve(path.dirname(fileURLToPath(import.meta.url)));

const tsConfigPath = path.join(baseUrl, 'tsconfig.json');
const gitignorePath = path.join(baseUrl, '.gitignore');

const compat = new FlatCompat({
    baseDirectory: baseUrl,
    recommendedConfig: eslintJs.configs.recommended
});

const withFilesOnly = (config, files) =>
    config.map((e) => {
        e.files = files;
        return e;
    });
const _jsFiles = ['src/**/*.js', 'src/**/*.jsx', 'src/**/*.mjs', 'src/**/*.cjs'];
const _tsFiles = ['src/**/*.ts', 'src/**/*.tsx', 'src/**/*.mts', 'src/**/*.cts'];
const _codeFiles = [..._jsFiles, ..._tsFiles];

const config = eslintTs.config(
    // Add all .gitignore files to the ignore path
    includeIgnoreFile(gitignorePath),
    // Asure oackage-scripts as CJS, to avoid no-undef issues
    { files: ['**/package-scripts.js'], languageOptions: { globals: globals.node } },
    // Recommended settings from ESLint for JS
    eslintJs.configs.recommended,
    // Prettier plugin usage
    eslintPluginPrettierRecommended,
    // Import default settings. Import is not yet ESLint 9 compatible
    ...withFilesOnly(
        compat.extends(
            'plugin:import/recommended',
            'plugin:import/errors',
            'plugin:import/warnings',
            'plugin:import/typescript'
        ),
        _codeFiles
    ),
    // Custom settings and rules for all JS and TS files
    {
        files: _codeFiles,
        linterOptions: {
            reportUnusedDisableDirectives: true
        },
        languageOptions: {
            parser: eslintJs.parser,
            parserOptions: eslintJs.parserOptions,
            globals: {
                ...globals.node
            },
            ecmaVersion: 2022,
            sourceType: 'module'
        },
        plugins: {
            'no-null': eslintPluginNoNull,
            'prefer-arrow': eslintPluginPreferArrow
            // import: legacyPlugin('eslint-plugin-import', 'import')
        },
        settings: {
            // 'import/ignore': ['i18next', 'fs', 'path']
        },
        rules: {
            // Non plugin rules
            'no-console': ['error'],
            'arrow-body-style': ['error'],
            'no-shadow': ['off'],
            camelcase: ['error'],
            'capitalized-comments': ['off'],
            'default-case': ['error'],
            'dot-location': ['error', 'property'],
            eqeqeq: ['error', 'smart'],
            'no-alert': ['error'],
            'no-bitwise': ['error'],
            'no-caller': ['error'],
            'no-constructor-return': ['error'],
            'no-div-regex': ['error'],
            'no-empty': ['error'],

            'no-empty-function': [
                'error',
                {
                    allow: ['constructors']
                }
            ],

            'no-eval': ['error'],
            'no-extra-bind': ['error'],
            'no-import-assign': ['error'],
            'no-invalid-this': ['error'],
            'no-labels': ['error'],
            'no-multiple-empty-lines': ['error'],
            'no-new-wrappers': ['error'],
            'no-regex-spaces': ['error'],
            'no-return-assign': ['error'],
            'no-return-await': ['error'],
            'no-self-compare': ['error'],
            'no-throw-literal': ['error'],
            'no-undef-init': ['error'],
            'no-underscore-dangle': ['off'],
            'no-unused-expressions': ['error'],
            'no-useless-call': ['error'],
            'no-useless-concat': ['error'],
            'no-var': ['error'],
            'object-shorthand': ['error'],
            'one-var': ['error', 'never'],
            'prefer-const': ['error'],
            'prefer-regex-literals': ['error'],
            radix: ['error'],
            'require-await': ['error'],

            'sort-imports': [
                'error',
                {
                    ignoreCase: false,
                    ignoreDeclarationSort: true,
                    ignoreMemberSort: false,
                    memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
                    allowSeparatedGroups: true
                }
            ],

            'spaced-comment': ['error'],
            'use-isnan': ['error'],
            'valid-typeof': ['error'],
            yoda: ['error'],

            // No Null plugin
            'no-null/no-null': ['error'],

            // Prefer arrow Plugin
            'prefer-arrow/prefer-arrow-functions': [
                'error',
                {
                    disallowPrototype: true,
                    singleReturnOnly: false,
                    classPropertiesAllowed: false
                }
            ],

            // Import is still not v9 compatible, some some rules fail.
            // Instead of using the default provided configurations,
            // we manually configure the rules, to avoid rules that have problems.

            // Helpful warnings
            'import/no-empty-named-blocks': ['error'],
            'import/no-extraneous-dependencies': ['error'],
            'import/no-mutable-exports': ['off'],
            'import/no-named-as-default': ['off'],
            'import/no-named-as-default-member': ['off'],
            // Module systems
            'import/no-import-module-exports': ['error'],
            // Static Analysis
            'import/default': ['off'],
            'import/namespace': ['off'],
            'import/no-absolute-path': ['error'],
            'import/no-dynamic-require': ['error'],
            'import/no-self-import': ['error'],
            'import/no-unresolved': ['off'],
            'import/no-useless-path-segments': ['error'],
            'import/no-webpack-loader-syntax': ['error'],
            // Style guide
            'import/no-duplicates': ['error'],
            'import/order': [
                'error',
                {
                    groups: ['builtin', 'external', 'internal', 'sibling', 'parent', 'index', 'unknown'],
                    'newlines-between': 'always',

                    alphabetize: {
                        order: 'asc',
                        caseInsensitive: true
                    }
                }
            ]
        }
    },
    // This rules applies only for TS files, recommended typescript-eslint settings.
    ...withFilesOnly(eslintTs.configs.strict, _tsFiles),
    ...withFilesOnly(eslintTs.configs.stylistic, _tsFiles),
    ...withFilesOnly(eslintTs.configs.strictTypeChecked, _tsFiles),
    ...withFilesOnly(eslintTs.configs.stylisticTypeChecked, _tsFiles),
    // Custom typescript-eslint configuration
    {
        files: _tsFiles,
        languageOptions: {
            parser: eslintTs.parser,
            parserOptions: {
                project: [tsConfigPath],
                impliedStrict: true,
                warnOnUnsupportedTypeScriptVersion: false
            }
        },
        rules: {
            '@typescript-eslint/prefer-nullish-coalescing': ['off'],
            '@typescript-eslint/no-unnecessary-type-parameters': ['off'],
            '@typescript-eslint/no-unnecessary-condition': ['off'],
            '@typescript-eslint/no-inferrable-types': ['off'],
            '@typescript-eslint/no-namespace': ['off'],
            '@typescript-eslint/prefer-regexp-exec': ['off'],
            '@typescript-eslint/no-shadow': ['error'],
            '@typescript-eslint/restrict-template-expressions': [
                'error',
                {
                    allowNumber: true
                }
            ],
            '@typescript-eslint/explicit-member-accessibility': [
                'error',
                {
                    accessibility: 'explicit'
                }
            ],
            '@typescript-eslint/member-ordering': [
                'error',
                {
                    default: ['signature', 'field', 'constructor', ['get', 'set'], 'method']
                }
            ],
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    argsIgnorePattern: '^_',
                    caughtErrorsIgnorePattern: '^_',
                    destructuredArrayIgnorePattern: '^_'
                }
            ],
            '@typescript-eslint/explicit-function-return-type': [
                'error',
                {
                    allowExpressions: true,
                    allowTypedFunctionExpressions: true,
                    allowHigherOrderFunctions: true
                }
            ]
        }
    }
);

export default config;

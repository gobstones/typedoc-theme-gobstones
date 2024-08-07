import path from 'path';
import { fileURLToPath } from 'url';

// eslint-disable-next-line import/namespace
import { fixupPluginRules, includeIgnoreFile } from '@eslint/compat';
import { FlatCompat } from '@eslint/eslintrc';
import eslintJs from '@eslint/js';
import eslintPluginNoNull from 'eslint-plugin-no-null';
import eslintPluginPreferArrow from 'eslint-plugin-prefer-arrow';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import eslintTs from 'typescript-eslint';

// region Compatibility with old plugins section
const compat = new FlatCompat({
    baseDirectory: path.dirname(fileURLToPath(import.meta.url)),
    recommendedConfig: eslintJs.configs.recommended
});

/**
 * @param {string} name the pugin name
 * @param {string} alias the plugin alias
 * @returns {import("eslint").ESLint.Plugin}
 */
// eslint-disable-next-line no-unused-vars
function legacyPlugin(name, alias = name) {
    const plugin = compat.plugins(name)[0]?.plugins?.[alias];

    if (!plugin) {
        throw new Error(`Unable to resolve plugin ${name} and/or alias ${alias}`);
    }

    return fixupPluginRules(plugin);
}

const gitignorePath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '.gitignore');
// #endregion Compatibility with old plugins section

// eslint-disable-next-line no-unused-vars
const _jsFiles = ['**/*.js', '**/*.jsx', '**/*.mjs', '**/*.cjs'];
const _tsFiles = ['**/*.ts', '**/*.tsx', '**/*.mts', '**/*.cts'];
// recommended configuration only for ts files

const config = eslintTs.config(
    includeIgnoreFile(gitignorePath),
    eslintJs.configs.recommended,
    eslintPluginPrettierRecommended,
    ...compat.extends(
        'plugin:import/recommended',
        'plugin:import/errors',
        'plugin:import/warnings',
        'plugin:import/typescript'
    ),
    {
        linterOptions: {
            reportUnusedDisableDirectives: true
        },
        languageOptions: {
            globals: {
                ...globals.node
            },
            ecmaVersion: 2022,
            sourceType: 'module'
        },
        plugins: {
            'no-null': eslintPluginNoNull,
            'prefer-arrow': eslintPluginPreferArrow
            // 'import': legacyPlugin("eslint-plugin-import", "import")
        },
        rules: {
            'no-console': ['error'],
            'no-null/no-null': ['error'],

            // Keep it off until compatibility with v9 is achieved at the plugin
            'import/no-named-as-default': ['off'],
            'import/no-named-as-default-member': ['off'],
            'import/no-unresolved': ['off'],

            'import/no-duplicates': ['error'],
            /*
            'import/no-unresolved': [
                'error',
                {
                    // ignore: ["^@?[\\w\\d-_]+/?[\\w\\d-_]+/[\\w\\d-_]+$"],
                }
            ],
            */

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
    ...eslintTs.configs.strictTypeChecked.map((e) => {
        e.files = _tsFiles;
        return e;
    }),
    {
        files: ['**/*.ts', '**/*.tsx', '**/*.mts', '**/*.cts'],
        languageOptions: {
            parser: eslintTs.parser,
            parserOptions: {
                project: ['./tsconfig.json'],
                impliedStrict: true,
                warnOnUnsupportedTypeScriptVersion: false
            }
        },
        rules: {
            '@typescript-eslint/no-unnecessary-condition': ['off'],
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    argsIgnorePattern: '^_',
                    caughtErrorsIgnorePattern: '^_',
                    destructuredArrayIgnorePattern: '^_'
                }
            ]
        }
    }
);

export default config;

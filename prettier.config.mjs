export default {
    printWidth: 120,
    tabWidth: 4,
    useTabs: false,
    semi: true,
    singleQuote: true,
    endOfLine: 'lf',
    trailingComma: 'none',
    overrides: [
        {
            files: ['*.js', '**/*.js', '*.jsx', '**/*.jsx'],
            options: {
                parser: 'babel'
            }
        },
        {
            files: ['*.ts', '**/*.ts', '*.tsx', '**/*.tsx'],
            options: {
                parser: 'typescript'
            }
        },
        {
            files: ['*.yml', '**/*.yml', '*.yaml', '**/*.yaml'],
            options: {
                parser: 'yaml'
            }
        },
        {
            files: ['*.json', '**/*.json'],
            options: {
                parser: 'json'
            }
        },
        {
            files: ['*.md', '**/*.md'],
            options: {
                parser: 'markdown'
            }
        },
        {
            files: ['*.css', '**/*.css', '*.scss', '**/*.scss', '*.less', '**/*.less'],
            options: {
                parser: 'css'
            }
        },
        {
            files: ['*.html', '**/*.html'],
            options: {
                parser: 'html'
            }
        },
        {
            files: ['package.json'],
            options: {
                tabWidth: 2,
                parser: 'json'
            }
        },
        {
            files: ['**/package-definition.json'],
            options: {
                tabWidth: 2,
                parser: 'json'
            }
        },
        {
            files: ['.prettierrc'],
            options: {
                parser: 'json'
            }
        }
    ]
};

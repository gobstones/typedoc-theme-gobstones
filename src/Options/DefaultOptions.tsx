/*
 * *****************************************************************************
 * Copyright (C) National University of Quilmes 2018-2024
 * Gobstones (TM) is a trademark of the National University of Quilmes.
 *
 * This program is free software distributed under the terms of the
 * GNU Affero General Public License version 3.
 * Additional terms added in compliance to section 7 of such license apply.
 *
 * You may read the full license at https://gobstones.github.io/gobstones-guidelines/LICENSE.
 * *****************************************************************************
 */

/**
 * @module Options
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */

import { TypedocApplication } from '../Wrappers';

/**
 * Returns the theme's default configuration to be set, if no configuration
 * that overwrites it is provided by the user.
 *
 * @param typedocApp - The instance of the running TypeDoc application
 *
 * @returns A TypeDoc partial configuration.
 */
export const DefaultOptions = (typedocApp: TypedocApplication): Record<string, unknown> => ({
    // Input
    entryPointStrategy: 'expand',
    exclude: ['./node_modules/**/*', './**/*.test.ts', './src/index.tsx?'],
    excludeExternals: true,
    excludeInternal: false,
    excludePrivate: false,
    // // Input (at TypeDoc docs, but is actually output)
    disableSources: false,
    includeVersion: true,
    // Output
    categorizeByGroup: true,
    hideGenerator: true,
    githubPages: true,
    headings: {
        readme: false,
        document: true
    },
    visibilityFilters: {
        '@internal': false,
        protected: false,
        private: false,
        inherited: false
    },
    // Comments
    modifierTags: ['@mergeTarget', ...typedocApp.options.getValue('modifierTags')],
    excludeTags: ['@override', '@virtual', '@satisfies', '@overload'],
    // Plugins
    mergeModulesMergeMode: 'module-category'
});

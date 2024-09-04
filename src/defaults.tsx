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
 * @module Main
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */

import { Application } from 'typedoc';

/**
 * Return the theme's default configuration to be set, if no configuration
 * that overwrites it is provided by the user.
 *
 * @param typedocApp - The instance of the running TypeDoc application
 *
 * @returns A TypeDoc partial configuration.
 */
export const getDefaults = (typedocApp: Application): Record<string, unknown> => ({
    includeVersion: true,
    categorizeByGroup: true,
    excludeExternals: true,
    excludeInternal: false,
    excludePrivate: false,
    hideGenerator: true,
    disableSources: false,
    githubPages: true,
    excludeTags: ['@override', '@virtual', '@satisfies', '@overload'],
    visibilityFilters: {
        '@internal': false,
        protected: false,
        private: false,
        inherited: false
    },
    mergeModulesMergeMode: 'module-category',
    modifierTags: ['@mergeTarget', ...typedocApp.options.getValue('modifierTags')]
});

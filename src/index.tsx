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
 * The main module of the theme.
 *
 * @remarks
 * To define a theme in TypeDoc, the main module need's to export only
 * a `load` function. This is the module that exports such function.
 *
 * Additionally, this module provides the default options used by the theme.
 * Note that not all the configuration can be provided by the theme, and
 * some minimal configuration should be provided through the typedoc
 * configuration file.
 *
 * @module Main
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */
import { Application } from 'typedoc';

import { getDefaults } from './defaults';
import { MdnLinksPlugin, MergeModulePlugin, NotExportedPlugin, RemoveReferencesPlugin } from './Plugins';
import { GobstonesTheme } from './Theme/GobstonesTheme';
import * as Options from './Utils/Options';
import * as Plugins from './Utils/Plugins';

/**
 * The **load** function is called by TypeDoc when loading the theme
 * (as a plugin). This function performs all side-loads
 * and uses the received `app` to define a new theme,
 * with a given name and associated with a particular theme class.
 *
 * @param typedocApp - The instance of the running TypeDoc application
 */
export const load = (typedocApp: Application): void => {
    // Hook the default options so they are loaded
    // if no option was overwritten by the user configuration
    // This needs to come first than any other action.
    Options.hookThemeDefaultOptions(typedocApp, getDefaults(typedocApp));

    // Included plugins
    Plugins.loadPlugin(typedocApp, NotExportedPlugin);
    Plugins.loadPlugin(typedocApp, MergeModulePlugin);
    Plugins.loadPlugin(typedocApp, RemoveReferencesPlugin);
    Plugins.loadPlugin(typedocApp, MdnLinksPlugin);

    // Include theme
    typedocApp.renderer.defineTheme('gobstones', GobstonesTheme);
};

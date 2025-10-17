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
 * @module Wrappers
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */

import { TypedocApplication } from './TypedocApplication';
import { TypedocPlugin } from './TypedocPlugin';

/**
 * The TypedocPlugins module holds functions to load
 * a plugin into the application.
 */
export namespace TypedocPlugins {
    /**
     * Load a plugin into the application.
     *
     * @param typedocApp - The instance of the running TypeDoc application
     * @param plugin - The class of the plugin to load.
     */
    export const loadPlugin = (
        typedocApp: TypedocApplication,
        plugin: new (app: TypedocApplication) => TypedocPlugin
    ): void => {
        void new plugin(typedocApp).initialize();
    };
}

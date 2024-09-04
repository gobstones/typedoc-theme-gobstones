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
 * @module Utils
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */

import { Application } from 'typedoc';

/**
 * A class that wraps the idea of a `Plugin` for TypeDoc.
 *
 * @remarks
 * Similarly to themes, this class is structured so that
 * subclasses can access the main TypeDoc app through
 * the `this.application` property.
 *
 * Subclasses are expected to overwrite this class and to
 * define an `initialize` method, which is just a fancy name
 * for the `load` function that is exported by regular plugins.
 */
export abstract class TypedocPlugin {
    /**
     * Create a new instance of this plugin.
     *
     * @param application - The instance of the running TypeDoc application
     */
    public constructor(public application: Application) {}

    /**
     * Initialize the plugin, loading all required configuration for it.
     *
     * @remarks
     * This function is called when the plugin is loaded, after instantiation
     * by the {@link loadPlugin} function.
     */
    public abstract initialize(): void;
}

/**
 * Load a plugin into the application.
 *
 * @param typedocApp - The instance of the running TypeDoc application
 * @param plugin - The class of the plugin to load.
 */
export const loadPlugin = (typedocApp: Application, plugin: new (app: Application) => TypedocPlugin): void => {
    new plugin(typedocApp).initialize();
};

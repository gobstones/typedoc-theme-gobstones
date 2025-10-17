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
    public constructor(public application: TypedocApplication) {}

    /**
     * Initialize the plugin, loading all required configuration for it.
     *
     * @remarks
     * This function is called when the plugin is loaded, after instantiation
     * by the {@link Wrappers.TypedocPlugins.loadPlugin} function.
     */
    public abstract initialize(): void | Promise<void>;
}

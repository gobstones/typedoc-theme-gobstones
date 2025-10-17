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

import { Renderer } from 'typedoc';

import { TypedocApplication } from './TypedocApplication';
import { TypedocTheme } from './TypedocTheme';

/**
 * The TypedocThemes module holds functions to load
 * a theme into the application.
 */
export namespace TypedocThemes {
    /**
     * Define a theme into the application.
     *
     * @param typedocApp - The instance of the running TypeDoc application
     * @param theme - The class of the plugin to load.
     */
    export const defineTheme = (
        typedocApp: TypedocApplication,
        theme: (new (app: Renderer) => TypedocTheme) & { name: string }
    ): void => {
        typedocApp.renderer.defineTheme(theme.name, theme);
    };
}

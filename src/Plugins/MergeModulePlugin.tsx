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
 * @module Plugins
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */

import { load } from 'typedoc-plugin-merge-modules';

import { TypedocPlugin } from '../Utils/Plugins';

/**
 * A Plugin class that wraps the `typedoc-plugin-merge-modules` plugin.
 */
export class MergeModulePlugin extends TypedocPlugin {
    /** @inheritdoc */
    public initialize(): void {
        load(this.application);
    }
}

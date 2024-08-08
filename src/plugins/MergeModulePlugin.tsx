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
import { Application } from 'typedoc';
import { load } from 'typedoc-plugin-merge-modules';

import { TypedocPlugin } from '.';

export class MergeModulePlugin extends TypedocPlugin {
    public initialize(application: Application) {
        load(application);
    }
}

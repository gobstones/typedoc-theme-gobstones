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

import { GobstonesTheme } from './GobstonesTheme';

/**
 * Called by TypeDoc when loading this theme as a plugin
 */
export function load(app: Application) {
    app.renderer.defineTheme('gobstones', GobstonesTheme);
}

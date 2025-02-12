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
 * @module Theme/Partials/Types
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */

import { DefaultThemeRenderContext, JSX, SomeType } from 'typedoc';

import { typeDetailsImpl } from './typeDetailsImpl';

export const typeDetails = (context: DefaultThemeRenderContext, type: SomeType, renderAnchors: boolean): JSX.Children =>
    typeDetailsImpl(context, type, renderAnchors);

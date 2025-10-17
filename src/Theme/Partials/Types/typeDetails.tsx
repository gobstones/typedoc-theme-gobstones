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

import { JSX, Reflection, SomeType } from 'typedoc';

import { typeDetailsImpl } from './typeDetailsImpl';

import type { TypedocRendererContext } from '../../../Wrappers';

export const typeDetails = (
    context: TypedocRendererContext,
    reflectionOwningType: Reflection,
    type: SomeType,
    renderAnchors: boolean
): JSX.Children => typeDetailsImpl(context, reflectionOwningType, type, renderAnchors);

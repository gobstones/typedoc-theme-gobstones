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

import { JSX, SomeType, TypeContext } from 'typedoc';

import type { TypedocRendererContext } from '../../../Wrappers';
import { FormattedCodeBuilder, FormattedCodeGenerator, Wrap } from '../../Utils';

export const type = (
    context: TypedocRendererContext,
    theType: SomeType | undefined,
    options: { topLevelLinks: boolean } = { topLevelLinks: false }
): JSX.Element => {
    const builder = new FormattedCodeBuilder(context.router, context.model);
    const tree = builder.type(theType, TypeContext.none, options);
    const generator = new FormattedCodeGenerator(context.options.getValue('typePrintWidth'));
    generator.node(tree, Wrap.Detect);
    return generator.toElement();
};

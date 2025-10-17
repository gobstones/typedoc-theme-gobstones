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
 * @module Theme/Partials/Comments
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */

import { JSX, Reflection } from 'typedoc';

import type { TypedocRendererContext } from '../../../Wrappers';

// Note: Comment modifiers are handled in `renderFlags`

export const commentSummary = (context: TypedocRendererContext, props: Reflection): JSX.Element | undefined => {
    if (props.comment?.summary.some((part) => part.text)) {
        return context.displayParts?.(props.comment.summary);
    }

    const target =
        (props.isDeclaration() || props.isParameter()) && props.type?.type === 'reference'
            ? props.type.reflection
            : undefined;

    if (target?.comment?.hasModifier('@expand') && target?.comment?.summary.some((part) => part.text)) {
        return context.displayParts?.(target.comment.summary);
    }
};

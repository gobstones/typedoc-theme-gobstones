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

import { CommentDisplayPart, JSX, Reflection } from 'typedoc';

import type { TypedocRendererContext } from '../../../Wrappers';

export const commentShortSummary = (context: TypedocRendererContext, props: Reflection): JSX.Element | undefined => {
    let shortSummary: readonly CommentDisplayPart[] | undefined;
    if (props.isDocument()) {
        if (typeof props.frontmatter.summary === 'string') {
            shortSummary = [{ kind: 'text', text: props.frontmatter.summary }];
        }
    } else {
        shortSummary = props.comment?.getShortSummary(context.options.getValue('useFirstParagraphOfCommentAsSummary'));
    }

    if (!shortSummary?.length && props.isDeclaration() && props.signatures?.length) {
        return commentShortSummary(context, props.signatures[0]);
    }

    if (!shortSummary?.some((part) => part.text)) return;

    return context.displayParts(shortSummary);
};

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

import { CommentDisplayPart, JSX } from 'typedoc';

import type { TypedocRendererContext } from '../../../Wrappers';

export const renderDisplayParts = (
    { markdown }: TypedocRendererContext,
    parts: readonly CommentDisplayPart[] | undefined
): JSX.Element | undefined => {
    if (!parts?.length) return;

    return (
        <div class="tsd-comment tsd-typography">
            <JSX.Raw html={markdown(parts)} />
        </div>
    );
};

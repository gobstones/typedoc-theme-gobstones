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
 * @module Theme/Partials/Others
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */

import { JSX, Reflection } from 'typedoc';

import { i18n } from '../../../Strings';
import type { TypedocRendererContext } from '../../../Wrappers';

export const anchorIcon = (context: TypedocRendererContext, anchor: string | undefined): JSX.Element => {
    if (!anchor) return <></>;

    return (
        <a href={`#${anchor}`} aria-label={i18n.theme_permalink()} class="tsd-anchor-icon">
            {context.icons.anchor()}
        </a>
    );
};

export const anchorTargetIfPresent = (context: TypedocRendererContext, refl: Reflection): string | undefined =>
    context.router.hasUrl(refl) ? context.router.getAnchor(refl) : undefined;

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
 * @module Theme/Partials
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */

import { JSX } from 'typedoc';
import type { DefaultThemeRenderContext } from 'typedoc';

export const anchorIcon = (context: DefaultThemeRenderContext, anchor: string | undefined): JSX.Element => {
    if (!anchor) return <></>;

    return (
        <a href={`#${anchor}`} aria-label={context.i18n.theme_permalink()} class="tsd-anchor-icon">
            {context.icons.anchor()}
        </a>
    );
};

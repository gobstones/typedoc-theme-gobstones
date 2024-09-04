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

import { DefaultThemeRenderContext, JSX, Reflection } from 'typedoc';

import { join } from '../../../Utils/lib';

/**
 * A
 */
const flagsNotRendered: `@${string}`[] = ['@showCategories', '@showGroups', '@hideCategories', '@hideGroups'];

export const reflectionFlags = (context: DefaultThemeRenderContext, props: Reflection): JSX.Element => {
    const allFlags = props.flags.getFlagStrings(context.internationalization);
    if (props.comment) {
        for (const tag of props.comment.modifierTags) {
            if (!flagsNotRendered.includes(tag)) {
                allFlags.push(context.internationalization.translateTagName(tag));
            }
        }
    }

    return join(' ', allFlags as unknown as JSX.Element[], (item: JSX.Element) => (
        <code class={`tsd-tag tsd-tag-${(item as unknown as string).toLowerCase()}`}>{item}</code>
    ));
};

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
 * @module Theme/Icons
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */

import assert from 'assert';

import { JSX } from 'typedoc';
import type { DefaultThemeRenderContext } from 'typedoc';

import { IconRecord } from './IconType';

/**
 * Returns a record of all possible icon names with a function that returns
 * the matching JSX.Element for such icon.
 *
 * @param icons - The icons
 * @param context - The render context of this theme
 * @returns A function that creates all icons.
 */
export const buildRefIcons = <T extends IconRecord>(icons: T, context: DefaultThemeRenderContext): T => {
    const refs: Record<string, () => JSX.Element> = {};

    for (const [name, builder] of Object.entries(icons)) {
        const jsx = builder.call(icons);
        assert(jsx.tag === 'svg', "TypeDoc's frontend assumes that icons are written as svg elements");
        // This one cannot be cached because the CSS selector depends on targeting SVG elements
        // within it. Ick. Surely there's a nicer way?
        if (name === 'checkbox') {
            refs[name] = () => jsx;
            continue;
        }

        const ref = (
            <svg {...jsx.props} id={undefined}>
                <use href={`${context.relativeURL('assets/img/icons.svg')}#icon-${name}`} />
            </svg>
        );
        refs[name] = () => ref;
    }

    return refs as T;
};

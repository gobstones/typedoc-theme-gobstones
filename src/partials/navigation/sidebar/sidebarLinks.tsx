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
import { JSX, DefaultThemeRenderContext } from 'typedoc';

export function sidebarLinks(context: DefaultThemeRenderContext) {
    const links = Object.entries(context.options.getValue('sidebarLinks'));
    const navLinks = Object.entries(context.options.getValue('navigationLinks'));

    // eslint-disable-next-line no-null/no-null
    if (!links.length && !navLinks.length) return null;
    return (
        <nav id="tsd-sidebar-links" class="tsd-navigation">
            {links.map(([label, url]) => (
                <a href={url}>{label}</a>
            ))}
            {navLinks.map(([label, url]) => (
                <a href={url} class="tsd-nav-link">
                    {label}
                </a>
            ))}
        </nav>
    );
}

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
 * @module Theme/Partials/Sections
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */

import { JSX } from 'typedoc';
import type { Reflection } from 'typedoc';

import type { TypedocRendererContext } from '../../../Wrappers';

export const breadcrumbs = (context: TypedocRendererContext, props: Reflection): JSX.Element => {
    const path: Reflection[] = [];
    let refl: Reflection = props;
    while (refl.parent) {
        path.push(refl);
        refl = refl.parent;
    }

    return (
        <ul class="tsd-breadcrumb" aria-label="Breadcrumb">
            {path.reverse().map((r, index) => (
                <li>
                    <a href={context.urlTo(r)} aria-current={index === path.length - 1 ? 'page' : undefined}>
                        {r.name}
                    </a>
                </li>
            ))}
        </ul>
    );
};

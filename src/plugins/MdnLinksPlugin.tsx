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
import { Application } from 'typedoc';
// @ts-expect-error: Plugin is JS only, ignore import as any.
import { load } from 'typedoc-plugin-mdn-links';

import { TypedocPlugin } from '.';

export class MdnLinksPlugin extends TypedocPlugin {
    public initialize(application: Application) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        load(application);
    }
}

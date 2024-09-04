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
 * @module Theme/Templates
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */

import type { DefaultThemeRenderContext, DocumentReflection } from 'typedoc';
import { JSX, PageEvent } from 'typedoc';

/**
 * The component that defines how to render a markdown document
 * page. Rendering documents other than the README use this template.
 *
 * @param context - The theme context.
 * @param props - A page event with the document's reflection.
 *
 * @returns A JSX.Element to render the markdown document.
 */
export const documentTemplate = (
    context: DefaultThemeRenderContext,
    props: PageEvent<DocumentReflection>
): JSX.Element => (
    <div class="tsd-panel tsd-typography">
        <JSX.Raw html={context.markdown(props.model.content)} />
    </div>
);

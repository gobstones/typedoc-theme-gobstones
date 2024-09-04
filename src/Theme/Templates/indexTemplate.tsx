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

import type { DefaultThemeRenderContext, PageEvent, ProjectReflection } from 'typedoc';
import { JSX } from 'typedoc';

/**
 * The component that defines how to render the main README file.
 *
 * @param context - The theme context.
 * @param props - A page event with the project's reflection.
 *
 * @returns A JSX.Element to render the README file.
 */
export const indexTemplate = (context: DefaultThemeRenderContext, props: PageEvent<ProjectReflection>): JSX.Element => (
    <div class="tsd-panel tsd-typography">
        <JSX.Raw html={context.markdown(props.model.readme || [])} />
    </div>
);

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
 * @module Theme/Partials/Types
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */

import { DefaultThemeRenderContext, JSX, SomeType } from 'typedoc';

import { renderingTypeDetailsIsUseful } from './typeDetailsIfUseful';

export const typeDeclaration = (context: DefaultThemeRenderContext, type: SomeType): JSX.Element | undefined => {
    if (renderingTypeDetailsIsUseful(type)) {
        return (
            <div class="tsd-type-declaration">
                <h4>{context.i18n.theme_type_declaration()}</h4>
                {context.typeDetails(type, true)}
            </div>
        );
    }
    return undefined;
};

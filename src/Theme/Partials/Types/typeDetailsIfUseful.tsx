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

import { DefaultThemeRenderContext, JSX, SomeType, TypeVisitor } from 'typedoc';

import { renderingChildIsUseful, shouldExpandReference } from './typeDetailsImpl';

export const typeDetailsIfUseful = (context: DefaultThemeRenderContext, type: SomeType | undefined): JSX.Children => {
    if (type && renderingTypeDetailsIsUseful(type)) {
        return context.typeDetails(type, false);
    }
};

export const renderingTypeDetailsIsUseful = (type: SomeType): boolean => type.visit(isUsefulVisitor) ?? false;

const isUsefulVisitor: Partial<TypeVisitor<boolean>> = {
    array: (type) => renderingTypeDetailsIsUseful(type.elementType),
    intersection: (type) => type.types.some(renderingTypeDetailsIsUseful),
    union: (type) => !!type.elementSummaries || type.types.some(renderingTypeDetailsIsUseful),
    reflection: (type) => renderingChildIsUseful(type.declaration),
    reference: (type) => shouldExpandReference(type)
};

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

import {
    DeclarationReflection,
    DefaultThemeRenderContext,
    JSX,
    Reflection,
    ReflectionKind,
    ReflectionType
} from 'typedoc';

import { getKindClass, renderTypeParametersSignature } from '../../Utils/lib';

export const reflectionPreview = (context: DefaultThemeRenderContext, props: Reflection): JSX.Element | undefined => {
    if (!(props instanceof DeclarationReflection)) return;

    // Each property of the interface will have a member rendered later on the page describing it, so generate
    // a type-like object with links to each member. Don't do this if we don't have any children as it will
    // generate a broken looking interface. (See TraverseCallback)
    if (props.kindOf(ReflectionKind.Interface) && props.children) {
        return (
            <div class="tsd-signature">
                <span class="tsd-signature-keyword">interface </span>
                <span class={getKindClass(props)}>{props.name}</span>
                {renderTypeParametersSignature(context, props.typeParameters)}{' '}
                {context.type(new ReflectionType(props), { topLevelLinks: true })}
            </div>
        );
    }
    return undefined;
};

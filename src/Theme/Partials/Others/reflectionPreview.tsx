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
 * @module Theme/Partials/Others
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */

import { DeclarationReflection, JSX, Reflection, ReflectionKind } from 'typedoc';

import type { TypedocRendererContext } from '../../../Wrappers';
import { FormattedCodeBuilder, FormattedCodeGenerator, Wrap } from '../../Utils';

export const reflectionPreview = (context: TypedocRendererContext, props: Reflection): JSX.Element | undefined => {
    if (!(props instanceof DeclarationReflection)) return;

    // Each property of the interface will have a member rendered later on the page describing it, so generate
    // a type-like object with links to each member. Don't do this if we don't have any children as it will
    // generate a broken looking interface. (See TraverseCallback)
    if (props.kindOf(ReflectionKind.Interface) && props.children) {
        const builder = new FormattedCodeBuilder(context.router, context.model);
        const tree = builder.interface(props);
        const generator = new FormattedCodeGenerator(context.options.getValue('typePrintWidth'));
        generator.forceWrap(builder.forceWrap); // Ensure elements are added to new lines.
        generator.node(tree, Wrap.Enable);

        return <div class="tsd-signature">{generator.toElement()}</div>;
    }
    return undefined;
};

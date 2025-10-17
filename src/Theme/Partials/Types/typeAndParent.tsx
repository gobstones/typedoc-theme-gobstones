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

import { ArrayType, JSX, ReferenceType, SignatureReflection, Type } from 'typedoc';

import type { TypedocRendererContext } from '../../../Wrappers';

export const typeAndParent = (context: TypedocRendererContext, props: Type): JSX.Element => {
    if (props instanceof ArrayType) {
        return (
            <>
                {context.typeAndParent(props.elementType)}
                []
            </>
        );
    }

    if (props instanceof ReferenceType && props.reflection) {
        const refl = props.reflection instanceof SignatureReflection ? props.reflection.parent : props.reflection;
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const parent = refl.parent!;

        return (
            <>
                {<a href={context.urlTo(parent)}>{parent.name}</a>}.{<a href={context.urlTo(refl)}>{refl.name}</a>}
            </>
        );
    }

    return <>{props.toString()}</>;
};

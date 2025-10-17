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
 * @module Theme/Partials/Members
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */

import { JSX } from 'typedoc';
import type { DeclarationReflection } from 'typedoc';

import type { TypedocRendererContext } from '../../../Wrappers';
import { classNames } from '../../Utils';

export const memberGetterSetter = (context: TypedocRendererContext, props: DeclarationReflection): JSX.Element => (
    <>
        <ul
            class={classNames(
                {
                    'tsd-signatures': true
                },
                context.getReflectionClasses(props)
            )}
        >
            {!!props.getSignature && (
                <li>
                    <div class="tsd-signature" id={context.getAnchor(props.getSignature)}>
                        {context.memberSignatureTitle(props.getSignature)}
                    </div>
                    <div class="tsd-description">{context.memberSignatureBody(props.getSignature)}</div>
                </li>
            )}
            {!!props.setSignature && (
                <li>
                    <div class="tsd-signature" id={context.getAnchor(props.setSignature)}>
                        {context.memberSignatureTitle(props.setSignature)}
                    </div>
                    <div class="tsd-description">{context.memberSignatureBody(props.setSignature)}</div>
                </li>
            )}
        </ul>
    </>
);

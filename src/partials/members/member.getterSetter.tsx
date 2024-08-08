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
import { JSX } from 'typedoc';
import type { DeclarationReflection, DefaultThemeRenderContext } from 'typedoc';

import { classNames } from '../lib';

export const memberGetterSetter = (context: DefaultThemeRenderContext, props: DeclarationReflection) => (
    <>
        <div
            class={classNames(
                {
                    'tsd-signatures': true
                },
                context.getReflectionClasses(props)
            )}
        >
            {!!props.getSignature && (
                <>
                    <div class="tsd-signature" id={props.getSignature.anchor}>
                        <span class="tsd-signature-keyword">get</span> {props.name}
                        {context.memberSignatureTitle(props.getSignature, {
                            hideName: true
                        })}
                    </div>
                    <div class="tsd-description">{context.memberSignatureBody(props.getSignature)}</div>
                </>
            )}
            {!!props.setSignature && (
                <>
                    <div class="tsd-signature" id={props.setSignature.anchor}>
                        <span class="tsd-signature-keyword">set</span> {props.name}
                        {context.memberSignatureTitle(props.setSignature, {
                            hideName: true
                        })}
                    </div>
                    <div class="tsd-description">{context.memberSignatureBody(props.setSignature)}</div>
                </>
            )}
        </div>
    </>
);

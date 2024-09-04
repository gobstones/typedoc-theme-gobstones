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
import type { DeclarationReflection, DefaultThemeRenderContext } from 'typedoc';

import { classNames } from '../../../Utils/lib';
import { anchorIcon } from '../anchor-icon';

export const memberSignatures = (context: DefaultThemeRenderContext, props: DeclarationReflection): JSX.Element => (
    <>
        <div class={classNames({ 'tsd-signatures': true }, context.getReflectionClasses(props))}>
            {props.signatures?.map((item) => (
                <>
                    <div class="tsd-signature tsd-anchor-link">
                        <a id={item.anchor} class="tsd-anchor"></a>
                        {context.memberSignatureTitle(item)}
                        {anchorIcon(context, item.anchor)}
                    </div>
                    <div class="tsd-description">{context.memberSignatureBody(item)}</div>
                </>
            ))}
        </div>
    </>
);

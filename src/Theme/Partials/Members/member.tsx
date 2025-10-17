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

/*
This is similar to the default, but the position where the reflection flags
are presented is different, and we give them custom tags.
*/

import { DeclarationReflection, DocumentReflection, JSX } from 'typedoc';

import type { TypedocRendererContext } from '../../../Wrappers';
import { classNames, getDisplayName, wbr } from '../../Utils';
import { anchorIcon } from '../Others/anchorIcon';

export const member = (
    context: TypedocRendererContext,
    props: DeclarationReflection | DocumentReflection
): JSX.Element => {
    const anchor = context.getAnchor(props);

    context.page.pageHeadings.push({
        link: `#${anchor}`,
        text: getDisplayName(props),
        kind: props.kind,
        classes: context.getReflectionClasses(props)
    });

    // With the default url derivation, we'll never hit this case as documents are always placed into their
    // own pages. Handle it here in case someone creates a custom url scheme which embeds guides within the page.
    if (props.isDocument()) {
        return (
            <section class={classNames({ 'tsd-panel': true, 'tsd-member': true }, context.getReflectionClasses(props))}>
                {!!props.name && (
                    <h3 class="tsd-anchor-link" id={anchor}>
                        {context.reflectionFlags(props)}
                        <span class={classNames({ deprecated: props.isDeprecated() })}>{wbr(props.name)}</span>
                        {anchorIcon(context, anchor)}
                    </h3>
                )}
                <div class="tsd-comment tsd-typography">
                    <JSX.Raw html={context.markdown(props.content)} />
                </div>
            </section>
        );
    }

    return (
        <section class={classNames({ 'tsd-panel': true, 'tsd-member': true }, context.getReflectionClasses(props))}>
            {!!props.name && (
                <h3 class="tsd-anchor-link" id={anchor}>
                    {context.reflectionFlags(props)}
                    <span class={classNames({ deprecated: props.isDeprecated() })}>{wbr(props.name)}</span>
                    {anchorIcon(context, anchor)}
                </h3>
            )}
            {props.signatures
                ? context.memberSignatures(props)
                : props.hasGetterOrSetter()
                  ? context.memberGetterSetter(props)
                  : context.memberDeclaration(props)}

            {props.groups?.map((item) =>
                item.children.map((it) => !context.router.hasOwnDocument(it) && context.member(it))
            )}
        </section>
    );
};

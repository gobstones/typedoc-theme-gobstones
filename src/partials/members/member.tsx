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
import {
    DefaultThemeRenderContext,
    DeclarationReflection,
    DocumentReflection,
    ReferenceReflection,
    JSX
} from 'typedoc';

import { anchorIcon } from '../anchor-icon';
import { classNames, getDisplayName, wbr } from '../lib';

export function member(context: DefaultThemeRenderContext, props: DeclarationReflection | DocumentReflection) {
    context.page.pageHeadings.push({
        link: `#${props.anchor ?? ''}`,
        text: getDisplayName(props),
        kind: props.kind,
        classes: context.getReflectionClasses(props)
    });

    // With the default url derivation, we'll never hit this case as documents are always placed into their
    // own pages. Handle it here in case someone creates a custom url scheme which embeds guides within the page.
    if (props.isDocument()) {
        return (
            <section class={classNames({ 'tsd-panel': true, 'tsd-member': true }, context.getReflectionClasses(props))}>
                <a id={props.anchor} class="tsd-anchor"></a>
                {!!props.name && (
                    <>
                        <div class="tsd-member-tags">{context.reflectionFlags(props)}</div>
                        <h3 class="tsd-anchor-link">
                            <span class={classNames({ deprecated: props.isDeprecated() })}>{wbr(props.name)}</span>
                            {anchorIcon(context, props.anchor)}
                        </h3>
                    </>
                )}
                <div class="tsd-comment tsd-typography">
                    <JSX.Raw html={context.markdown(props.content)} />
                </div>
            </section>
        );
    }

    return (
        <section class={classNames({ 'tsd-panel': true, 'tsd-member': true }, context.getReflectionClasses(props))}>
            <a id={props.anchor} class="tsd-anchor"></a>
            {!!props.name && (
                <>
                    <div class="tsd-member-tags">{context.reflectionFlags(props)}</div>
                    <h3 class="tsd-anchor-link">
                        <span class={classNames({ deprecated: props.isDeprecated() })}>{wbr(props.name)}</span>
                        {anchorIcon(context, props.anchor)}
                    </h3>
                </>
            )}
            {props.signatures
                ? context.memberSignatures(props)
                : props.hasGetterOrSetter()
                  ? context.memberGetterSetter(props)
                  : props instanceof ReferenceReflection
                    ? context.memberReference(props)
                    : context.memberDeclaration(props)}

            {props.groups?.map((item) => item.children.map((item) => !item.hasOwnDocument && context.member(item)))}
        </section>
    );
}

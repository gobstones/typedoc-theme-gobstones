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
import type { DefaultThemeRenderContext, DeclarationReflection, SignatureReflection, SourceReference } from 'typedoc';

function sourceLink(context: DefaultThemeRenderContext, item: SourceReference) {
    if (!item.url) {
        return (
            <li>
                {context.i18n.theme_defined_in()} {item.fileName}:{item.line}
            </li>
        );
    }

    if (context.options.getValue('sourceLinkExternal')) {
        return (
            <li>
                {context.i18n.theme_defined_in()}{' '}
                <a href={item.url} class="external" target="_blank">
                    {item.fileName}:{item.line}
                </a>
            </li>
        );
    }

    return (
        <li>
            {context.i18n.theme_defined_in()}{' '}
            <a href={item.url}>
                {item.fileName}:{item.line}
            </a>
        </li>
    );
}

export const memberSources = (
    context: DefaultThemeRenderContext,
    props: SignatureReflection | DeclarationReflection
) => {
    const sources: JSX.Element[] = [];

    if (props.implementationOf) {
        sources.push(
            <p>
                {context.i18n.theme_implementation_of()} {context.typeAndParent(props.implementationOf)}
            </p>
        );
    }
    if (props.inheritedFrom) {
        sources.push(
            <p>
                {context.i18n.theme_inherited_from()} {context.typeAndParent(props.inheritedFrom)}
            </p>
        );
    }
    if (props.overwrites) {
        sources.push(
            <p>
                {context.i18n.theme_overrides()} {context.typeAndParent(props.overwrites)}
            </p>
        );
    }
    if (props.sources?.length) {
        sources.push(<ul>{props.sources.map((item) => sourceLink(context, item))}</ul>);
    }

    if (sources.length === 0) {
        return <></>;
    }

    return <aside class="tsd-sources">{sources}</aside>;
};

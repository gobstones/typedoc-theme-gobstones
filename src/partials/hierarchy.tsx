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
import type { DefaultThemeRenderContext, DeclarationHierarchy, Type } from 'typedoc';

const isLinkedReferenceType = (type: Type) =>
    type.visit({
        reference: (ref) => ref.reflection !== undefined
    }) ?? false;

function hasAnyLinkedReferenceType(h: DeclarationHierarchy | undefined): boolean {
    if (!h) return false;

    if (!h.isTarget && h.types.some(isLinkedReferenceType)) return true;

    return hasAnyLinkedReferenceType(h.next);
}

export function hierarchy(context: DefaultThemeRenderContext, props: DeclarationHierarchy | undefined) {
    if (!props) return;

    const fullLink = hasAnyLinkedReferenceType(props) ? (
        <>
            {' '}
            (
            <a href={context.relativeURL('hierarchy.html') + '#' + context.page.model.getFullName()}>
                {context.i18n.theme_hierarchy_view_full()}
            </a>
            )
        </>
    ) : (
        <></>
    );

    return (
        <section class="tsd-panel tsd-hierarchy">
            <h4>
                {context.i18n.theme_hierarchy()}
                {fullLink}
            </h4>
            {hierarchyList(context, props)}
        </section>
    );
}

function hierarchyList(context: DefaultThemeRenderContext, props: DeclarationHierarchy) {
    return (
        <ul class="tsd-hierarchy">
            {props.types.map((item, i, l) => (
                <li>
                    {props.isTarget ? <span class="target">{item.toString()}</span> : context.type(item)}
                    {i === l.length - 1 && !!props.next && hierarchyList(context, props.next)}
                </li>
            ))}
        </ul>
    );
}

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

import { JSX } from 'typedoc';
import type { DeclarationHierarchy, Type } from 'typedoc';

import { i18n } from '../../../Strings';
import type { TypedocRendererContext } from '../../../Wrappers';

const isLinkedReferenceType = (type: Type): boolean =>
    type.visit({
        reference: (ref) => ref.reflection !== undefined
    }) ?? false;

const hasAnyLinkedReferenceType = (h: DeclarationHierarchy | undefined): boolean => {
    if (!h) return false;

    if (!h.isTarget && h.types.some(isLinkedReferenceType)) return true;

    return hasAnyLinkedReferenceType(h.next);
};

export const hierarchy = (
    context: TypedocRendererContext,
    typeHierarchy: DeclarationHierarchy | undefined
): JSX.Element | undefined => {
    if (!typeHierarchy) return;

    const summaryLink =
        context.options.getValue('includeHierarchySummary') && hasAnyLinkedReferenceType(typeHierarchy) ? (
            <>
                {' '}
                (
                <a href={context.relativeURL('hierarchy.html') + '#' + context.page.model.getFullName()}>
                    {i18n.theme_hierarchy_view_summary()}
                </a>
                )
            </>
        ) : (
            <></>
        );

    return (
        <section class="tsd-panel tsd-hierarchy">
            <h4>
                {i18n.theme_hierarchy()}
                {summaryLink}
            </h4>
            {hierarchyList(context, typeHierarchy)}
        </section>
    );
};

const hierarchyList = (context: TypedocRendererContext, props: DeclarationHierarchy): JSX.Element => (
    <ul class="tsd-hierarchy">
        {props.types.map((item, i, l) => (
            <li>
                {props.isTarget ? <span class="target">{item.toString()}</span> : context.type(item)}
                {i === l.length - 1 && !!props.next && hierarchyList(context, props.next)}
            </li>
        ))}
    </ul>
);

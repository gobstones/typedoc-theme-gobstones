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
 * @module Theme/Templates
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */

import { JSX } from 'typedoc';
import type { DeclarationReflection, DefaultThemeRenderContext, PageEvent, ProjectReflection } from 'typedoc';

import { getHierarchyRoots } from '../../Utils/lib';

/**
 * The component that defines how to render an element's hierarchy.
 * The page that displays the hierarchy of an element as main content
 * uses this template.
 *
 * @param context - The theme context.
 * @param props - A page event with the project's reflection.
 *
 * @returns A JSX.Element to render the hierarchy.
 */
export const hierarchyTemplate = (
    context: DefaultThemeRenderContext,
    props: PageEvent<ProjectReflection>
): JSX.Element => (
    <>
        <h2>{context.i18n.theme_class_hierarchy_title()}</h2>
        {getHierarchyRoots(props.project).map((root) => (
            <ul class="tsd-full-hierarchy">{fullHierarchy(context, root)}</ul>
        ))}
    </>
);

/**
 * The component that defines how to render an element's hierarchy
 * from a particular root, recursively.
 *
 * @param context - The theme context.
 * @param root - The main reflation from which to start the recursion.
 * @param seen - A set containing all previously seen elements.
 *
 * @returns A JSX.Element to render the hierarchy of this element.
 */
const fullHierarchy = (
    context: DefaultThemeRenderContext,
    root: DeclarationReflection,
    seen = new Set<DeclarationReflection>()
): JSX.Element | undefined => {
    if (seen.has(root)) return;
    seen.add(root);

    // Note: We don't use root.anchor for the anchor, because those are built on a per page basis.
    // And classes/interfaces get their own page, so all the anchors will be empty anyways.
    // Full name should be safe here, since this list only includes classes/interfaces.
    return (
        <li>
            <a id={root.getFullName()} class="tsd-anchor"></a>
            <a href={context.urlTo(root)}>
                {context.icons[root.kind]()}
                {root.name}
            </a>
            <ul>
                {root.implementedBy?.map(
                    (child) =>
                        child.reflection && fullHierarchy(context, child.reflection as DeclarationReflection, seen)
                )}
                {root.extendedBy?.map(
                    (child) =>
                        child.reflection && fullHierarchy(context, child.reflection as DeclarationReflection, seen)
                )}
            </ul>
        </li>
    );
};

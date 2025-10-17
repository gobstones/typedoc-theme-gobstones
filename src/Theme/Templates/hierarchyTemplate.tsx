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

import { JSX, ReflectionKind } from 'typedoc';
import type { DeclarationReflection, PageEvent, ProjectReflection } from 'typedoc';

import { i18n } from '../../Strings';
import type { TypedocRendererContext } from '../../Wrappers';

/**
 * Get the roots of the given project reflection.
 */
export const getHierarchyRoots = (project: ProjectReflection): DeclarationReflection[] => {
    const allClasses = project.getReflectionsByKind(ReflectionKind.ClassOrInterface) as DeclarationReflection[];

    const roots = allClasses.filter((refl) => {
        // If nobody extends this class, there's no possible hierarchy to display.
        if (!refl.implementedBy && !refl.extendedBy) {
            return false;
        }

        // If we don't extend anything, then we are a root
        if (!refl.implementedTypes && !refl.extendedTypes) {
            return true;
        }

        // We might still be a root, if our extended/implemented types are not included
        // in the documentation.
        const types = [...(refl.implementedTypes || []), ...(refl.extendedTypes || [])];

        return types.every(
            (type) =>
                !type.visit({
                    reference: (ref) => ref.reflection !== undefined
                })
        );
    });

    return roots.sort((a, b) => a.name.localeCompare(b.name));
};

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
    context: TypedocRendererContext,
    props: PageEvent<ProjectReflection>
): JSX.Element => {
    const seen = new Set<DeclarationReflection>();

    return (
        <>
            <h2>{i18n.theme_hierarchy_summary()}</h2>
            {getHierarchyRoots(props.project).map((root) => (
                <ul class="tsd-full-hierarchy">{fullHierarchy(context, root, seen)}</ul>
            ))}
        </>
    );
};

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
    context: TypedocRendererContext,
    root: DeclarationReflection,
    seen = new Set<DeclarationReflection>()
): JSX.Element => {
    if (seen.has(root)) {
        return (
            <li data-refl={root.id}>
                <a href={context.urlTo(root)}>
                    {context.icons[root.kind]()}
                    {root.name}
                </a>
            </li>
        );
    }
    seen.add(root);

    const children: JSX.Element[] = [];
    for (const child of [...(root.implementedBy || []), ...(root.extendedBy || [])]) {
        if (child.reflection) {
            children.push(fullHierarchy(context, child.reflection as DeclarationReflection, seen));
        }
    }

    // Note: We don't use root.anchor for the anchor, because those are built on a per page basis.
    // And classes/interfaces get their own page, so all the anchors will be empty anyways.
    // Full name should be safe here, since this list only includes classes/interfaces.
    return (
        <li data-refl={root.id}>
            <a id={root.getFullName()} class="tsd-anchor"></a>
            <a href={context.urlTo(root)}>
                {context.icons[root.kind]()}
                {root.name}
            </a>
            {children.length && <ul>{children}</ul>}
        </li>
    );
};

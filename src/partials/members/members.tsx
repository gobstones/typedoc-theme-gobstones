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
import type { DefaultThemeRenderContext, ContainerReflection } from 'typedoc';

export function filterMap<T, U>(iter: Iterable<T> | undefined, fn: (item: T) => U | undefined): U[] {
    const result: U[] = [];

    for (const item of iter || []) {
        const newItem = fn(item);
        if (newItem !== void 0) {
            result.push(newItem);
        }
    }

    return result;
}

function getMemberSections(parent: ContainerReflection) {
    if (parent.categories?.length) {
        return filterMap(parent.categories, (cat) => {
            if (!cat.allChildrenHaveOwnDocument()) {
                return {
                    title: cat.title,
                    children: cat.children.filter((child) => !child.hasOwnDocument)
                };
            }
            return undefined;
        });
    }

    if (parent.groups?.length) {
        return parent.groups.flatMap((group) => {
            if (group.categories?.length) {
                return filterMap(group.categories, (cat) => {
                    if (!cat.allChildrenHaveOwnDocument()) {
                        return {
                            title: `${group.title} - ${cat.title}`,
                            children: cat.children.filter((child) => !child.hasOwnDocument)
                        };
                    }
                    return undefined;
                });
            }

            return {
                title: group.title,
                children: group.children.filter((child) => !child.hasOwnDocument)
            };
        });
    }

    return [];
}

export function members(context: DefaultThemeRenderContext, props: ContainerReflection) {
    const sections = getMemberSections(props).filter((sect) => sect.children.length);

    return (
        <>
            {sections.map(({ title, children }) => {
                context.page.startNewSection(title);

                return (
                    <details class="tsd-panel-group tsd-member-group tsd-accordion" open>
                        <summary class="tsd-accordion-summary" data-key={'section-' + title}>
                            <h2>
                                {context.icons.chevronDown()} {title}
                            </h2>
                        </summary>
                        <section>{children.map((item) => context.member(item))}</section>
                    </details>
                );
            })}
        </>
    );
}

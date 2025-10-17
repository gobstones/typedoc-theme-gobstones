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
import type { ContainerReflection } from 'typedoc';

import type { TypedocRendererContext } from '../../../Wrappers';
import { getMemberSections, isNoneSection } from '../../Utils';

export const filterMap = <T, U>(iter: Iterable<T> | undefined, fn: (item: T) => U | undefined): U[] => {
    const result: U[] = [];

    for (const item of iter || []) {
        const newItem = fn(item);
        if (newItem !== void 0) {
            result.push(newItem);
        }
    }

    return result;
};

export const members = (context: TypedocRendererContext, props: ContainerReflection): JSX.Element => {
    const sections = getMemberSections(props, (child) => !context.router.hasOwnDocument(child));

    return (
        <>
            {sections.map((section) => {
                if (isNoneSection(section)) {
                    return (
                        <section class="tsd-panel-group tsd-member-group">
                            {section.children.map((item) => context.member(item))}
                        </section>
                    );
                }

                context.page.startNewSection(section.title);

                return (
                    <details class="tsd-panel-group tsd-member-group tsd-accordion" open>
                        <summary class="tsd-accordion-summary" data-key={'section-' + section.title}>
                            {context.icons.chevronDown()}
                            <h2>{section.title}</h2>
                        </summary>
                        <section>{section.children.map((item) => context.member(item))}</section>
                    </details>
                );
            })}
        </>
    );
};

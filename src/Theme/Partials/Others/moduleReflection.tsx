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

import {
    CommentDisplayPart,
    ContainerReflection,
    DeclarationReflection,
    DocumentReflection,
    JSX,
    ProjectReflection,
    ReferenceReflection,
    Reflection,
    ReflectionCategory,
    ReflectionKind
} from 'typedoc';

import { anchorIcon } from './anchorIcon';

import type { TypedocRendererContext } from '../../../Wrappers';
import { classNames, filterMap, getDisplayName, getUniquePath, join } from '../../Utils';

export interface MemberSections {
    title: string;
    description?: CommentDisplayPart[];
    children: (DocumentReflection | DeclarationReflection)[];
}

/**
 * Get the members of a container reflection.
 */
export const getMemberSections = (
    parent: ContainerReflection,
    childFilter: (refl: Reflection) => boolean = () => true
): MemberSections[] => {
    if (parent.categories?.length) {
        return filterMap(parent.categories, (cat: ReflectionCategory) => {
            const children = cat.children.filter(childFilter);
            if (!children.length) return;
            return {
                title: cat.title,
                description: cat.description,
                children
            };
        });
    }

    if (parent.groups?.length) {
        return parent.groups.flatMap((group) => {
            if (group.categories?.length) {
                return filterMap(group.categories, (cat: ReflectionCategory) => {
                    const children = cat.children.filter(childFilter);
                    if (!children.length) return;
                    return {
                        title: `${group.title} - ${cat.title}`,
                        description: cat.description,
                        children
                    };
                });
            }

            const children = group.children.filter(childFilter);
            if (!children.length) return [];
            return {
                title: group.title,
                description: group.description,
                children
            };
        });
    }

    return [];
};

export const moduleReflection = (
    context: TypedocRendererContext,
    mod: DeclarationReflection | ProjectReflection
): JSX.Element => {
    const sections = getMemberSections(mod);

    return (
        <>
            {mod.hasComment() && (
                <section class="tsd-panel tsd-comment">
                    {context.commentSummary(mod)}
                    {context.commentTags(mod)}
                </section>
            )}

            {mod.isDeclaration() && mod.kind === ReflectionKind.Module && mod.readme?.length && (
                <section class="tsd-panel tsd-typography">
                    <JSX.Raw html={context.markdown(mod.readme)} />
                </section>
            )}

            {sections.map(({ title, children, description }) => {
                context.page.startNewSection(title);

                return (
                    <details class="tsd-panel-group tsd-member-group tsd-accordion" open>
                        <summary class="tsd-accordion-summary" data-key={'section-' + title}>
                            <h2>
                                {context.icons.chevronDown()} {title}
                            </h2>
                        </summary>
                        {description && (
                            <div class="tsd-comment tsd-typography">
                                <JSX.Raw html={context.markdown(description)} />
                            </div>
                        )}
                        <dl class="tsd-member-summaries">
                            {children.map((item) => context.moduleMemberSummary(item))}
                        </dl>
                    </details>
                );
            })}
        </>
    );
};

export const moduleMemberSummary = (
    context: TypedocRendererContext,
    member: DeclarationReflection | DocumentReflection
): JSX.Element => {
    const id = context.slugger.slug(member.name);
    context.page.pageHeadings.push({
        link: `#${id}`,
        text: getDisplayName(member),
        kind: member instanceof ReferenceReflection ? member.getTargetReflectionDeep().kind : member.kind,
        classes: context.getReflectionClasses(member)
    });

    let name: JSX.Element;
    if (member instanceof ReferenceReflection) {
        const target = member.getTargetReflectionDeep();

        name = (
            <span class="tsd-member-summary-name">
                {context.icons[target.kind]()}
                <span class={classNames({ deprecated: member.isDeprecated() })}>{member.name}</span>
                <span>&nbsp;{'\u2192'}&nbsp;</span>
                {uniqueName(context, target)}
                {anchorIcon(context, id)}
            </span>
        );
    } else {
        name = (
            <span class="tsd-member-summary-name">
                {context.icons[member.kind]()}
                <a class={classNames({ deprecated: member.isDeprecated() })} href={context.urlTo(member)}>
                    {member.name}
                </a>
                {anchorIcon(context, id)}
            </span>
        );
    }

    return (
        <>
            <dt class={classNames({ 'tsd-member-summary': true }, context.getReflectionClasses(member))}>
                <a id={id} class="tsd-anchor"></a>
                {name}
            </dt>
            <dd class={classNames({ 'tsd-member-summary': true }, context.getReflectionClasses(member))}>
                {context.commentShortSummary(member)}
            </dd>
        </>
    );
};

// Note: This version of uniqueName does NOT include colors... they looked weird to me
// when looking at a module page.
const uniqueName = (context: TypedocRendererContext, reflection: Reflection): JSX.Element => {
    const name = join('.', getUniquePath(reflection), (item: Reflection) => (
        <a href={context.urlTo(item)} class={classNames({ deprecated: item.isDeprecated() })}>
            {item.name}
        </a>
    ));

    return <>{name}</>;
};

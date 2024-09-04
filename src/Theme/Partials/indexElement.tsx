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
 * @module Theme/Partials
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */

import { JSX } from 'typedoc';
import type { ContainerReflection, DefaultThemeRenderContext, ReflectionCategory, ReflectionGroup } from 'typedoc';

import { classNames, renderName } from '../../Utils/lib';

const renderCategory = (
    { urlTo, icons, getReflectionClasses, markdown }: DefaultThemeRenderContext,
    item: ReflectionCategory | ReflectionGroup,
    prependName = ''
): JSX.Element => (
    <section class="tsd-index-section">
        <h3 class="tsd-index-heading">{prependName ? `${prependName} - ${item.title}` : item.title}</h3>
        {item.description && (
            <div class="tsd-comment tsd-typography">
                <JSX.Raw html={markdown(item.description)} />
            </div>
        )}
        <div class="tsd-index-list">
            {item.children.map((i) => (
                <>
                    <a
                        href={urlTo(i)}
                        class={classNames(
                            { 'tsd-index-link': true, deprecated: i.isDeprecated() },
                            getReflectionClasses(i)
                        )}
                    >
                        {icons[i.kind]()}
                        <span>{renderName(i)}</span>
                    </a>
                    {'\n'}
                </>
            ))}
        </div>
    </section>
);

export const index = (context: DefaultThemeRenderContext, props: ContainerReflection): JSX.Element => {
    let content: JSX.Element | JSX.Element[] = [];

    if (props.categories?.length) {
        content = props.categories.map((item) => renderCategory(context, item));
    } else if (props.groups?.length) {
        content = props.groups.flatMap((item) =>
            item.categories
                ? item.categories.map((item2) => renderCategory(context, item2, item.title))
                : renderCategory(context, item)
        );
    }

    // Accordion is only needed if any children don't have their own document.
    if (
        [...(props.groups ?? []), ...(props.categories ?? [])].some(
            (category) => !category.allChildrenHaveOwnDocument()
        )
    ) {
        content = (
            <details class="tsd-index-content tsd-accordion" open={true}>
                <summary class="tsd-accordion-summary tsd-index-summary">
                    <h5 class="tsd-index-heading uppercase" role="button" aria-expanded="false" tabIndex={0}>
                        {context.icons.chevronSmall()} {context.i18n.theme_index()}
                    </h5>
                </summary>
                <div class="tsd-accordion-details">{content}</div>
            </details>
        );
    } else {
        content = (
            <>
                <h3 class="tsd-index-heading uppercase">{context.i18n.theme_index()}</h3>
                {content}
            </>
        );
    }

    return (
        <>
            <section class="tsd-panel-group tsd-index-group">
                <section class="tsd-panel tsd-index-panel">{content}</section>
            </section>
        </>
    );
};

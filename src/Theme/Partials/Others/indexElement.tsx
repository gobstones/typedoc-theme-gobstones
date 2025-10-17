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
import type { ContainerReflection, Reflection } from 'typedoc';

import { i18n } from '../../../Strings';
import type { TypedocRendererContext } from '../../../Wrappers';
import { MemberSection, classNames, getMemberSections, isNoneSection, wbr } from '../../Utils';

/**
 * Renders the reflection name with an additional `?` if optional.
 */
export const renderName = (refl: Reflection): JSX.Element | (string | JSX.Element)[] => {
    if (refl.flags.isOptional) {
        return <>{wbr(refl.name)}?</>;
    }

    return wbr(refl.name);
};

const renderSection = (
    { urlTo, reflectionIcon, getReflectionClasses, markdown }: TypedocRendererContext,
    item: MemberSection
): JSX.Element => (
    <section class="tsd-index-section">
        {!isNoneSection(item) && <h3 class="tsd-index-heading">{item.title}</h3>}
        {item.description && (
            <div class="tsd-comment tsd-typography">
                <JSX.Raw html={markdown(item.description)} />
            </div>
        )}
        <div class="tsd-index-list">
            {item.children.map((it) => (
                <>
                    <a
                        href={urlTo(it)}
                        class={classNames(
                            { 'tsd-index-link': true, deprecated: it.isDeprecated() },
                            getReflectionClasses(it)
                        )}
                    >
                        {reflectionIcon(it)}
                        <span>{renderName(it)}</span>
                    </a>
                    {'\n'}
                </>
            ))}
        </div>
    </section>
);

export const index = (context: TypedocRendererContext, props: ContainerReflection): JSX.Element => {
    const sections = getMemberSections(props);

    return (
        <>
            <section class="tsd-panel-group tsd-index-group">
                <section class="tsd-panel tsd-index-panel">
                    <details class="tsd-index-content tsd-accordion" open={true}>
                        <summary class="tsd-accordion-summary tsd-index-summary">
                            {context.icons.chevronDown()}
                            <h5 class="tsd-index-heading uppercase">{i18n.theme_index()}</h5>
                        </summary>
                        <div class="tsd-accordion-details">{sections.map((s) => renderSection(context, s))}</div>
                    </details>
                </section>
            </section>
        </>
    );
};

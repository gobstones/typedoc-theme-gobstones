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
import { Reflection, JSX, PageEvent, PageHeading, DefaultThemeRenderContext } from 'typedoc';

import { wbr } from '../../../lib';

function buildSectionNavigation(context: DefaultThemeRenderContext, headings: PageHeading[]) {
    const levels: JSX.Element[][] = [[]];

    function finalizeLevel(finishedHandlingHeadings: boolean) {
        const level = levels.pop();
        if (level !== undefined && levels[levels.length - 1].length === 0 && finishedHandlingHeadings) {
            levels[levels.length - 1] = level;
            return;
        }

        const built = <ul>{level && level.map((l) => <li>{l}</li>)}</ul>;
        levels[levels.length - 1].push(built);
    }

    for (const heading of headings) {
        const inferredLevel = heading.level
            ? heading.level + 2 // regular heading
            : heading.kind
              ? 2 // reflection
              : 1; // group/category
        while (inferredLevel < levels.length) {
            finalizeLevel(false);
        }
        while (inferredLevel > levels.length) {
            // Lower level than before
            levels.push([]);
        }

        levels[levels.length - 1].push(
            <a href={heading.link} class={heading.classes}>
                {heading.kind && context.icons[heading.kind]()}
                <span>{wbr(heading.text)}</span>
            </a>
        );
    }

    while (levels.length > 1) {
        finalizeLevel(true);
    }

    levels.unshift([]);
    finalizeLevel(true);
    return levels[0];
}

export function pageNavigation(context: DefaultThemeRenderContext, props: PageEvent<Reflection>) {
    if (!props.pageSections.some((sect) => sect.headings.length)) {
        return <></>;
    }

    const sections: JSX.Children = [];

    for (const section of props.pageSections) {
        if (section.title) {
            sections.push(
                <details open class="tsd-accordion tsd-page-navigation-section">
                    <summary class="tsd-accordion-summary" data-key={`tsd-otp-${section.title}`}>
                        {context.icons.chevronDown()}
                        {section.title}
                    </summary>
                    <div>{buildSectionNavigation(context, section.headings)}</div>
                </details>
            );
        } else {
            sections.push(buildSectionNavigation(context, section.headings));
        }
    }

    return (
        <details open={true} class="tsd-accordion tsd-page-navigation">
            <summary class="tsd-accordion-summary">
                <h3>
                    {context.icons.chevronDown()}
                    {context.i18n.theme_on_this_page()}
                </h3>
            </summary>
            <div class="tsd-accordion-details">{sections}</div>
        </details>
    );
}

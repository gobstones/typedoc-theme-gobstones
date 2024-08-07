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

import type { GobstonesThemeContext } from '../../GobstonesThemeContext';

export function footer(context: GobstonesThemeContext) {
    const hideGenerator = context.options.getValue('hideGenerator');
    let generatorDisplay = <></>;
    if (!hideGenerator) {
        const message = context.i18n.theme_generated_using_typedoc();

        // Only handles one occurrence, but that's all I expect...
        const index = message.indexOf('TypeDoc');
        if (index == -1) {
            generatorDisplay = <p class="tsd-generator">{message}</p>;
        } else {
            const pre = message.substring(0, index);
            const post = message.substring(index + 'TypeDoc'.length);
            generatorDisplay = (
                <p class="tsd-generator">
                    {pre}
                    <a href="https://typedoc.org/" target="_blank">
                        TypeDoc
                    </a>
                    {post}
                </p>
            );
        }
    }

    const customFooterHtml = context.options.getValue('customFooterHtml');
    let customFooterDisplay = <></>;
    if (customFooterHtml) {
        if (context.options.getValue('customFooterHtmlDisableWrapper')) {
            customFooterDisplay = <JSX.Raw html={customFooterHtml} />;
        } else {
            customFooterDisplay = (
                <p>
                    <JSX.Raw html={customFooterHtml} />
                </p>
            );
        }
    }

    return (
        <footer>
            {context.hook('footer.begin', context)}
            {generatorDisplay}
            {customFooterDisplay}
            {context.hook('footer.end', context)}
        </footer>
    );
}

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
import type { Reflection, PageEvent, DefaultThemeRenderContext } from 'typedoc';

import { getDisplayName } from '../../lib';

export const toolbar = (context: DefaultThemeRenderContext, props: PageEvent<Reflection>) => (
    <header class="tsd-page-toolbar">
        <div class="tsd-toolbar-contents container">
            <img class="tsd-toolbar-icon" src="/assets/img/iso_gobstones.svg" />
            <div class="table-cell" id="tsd-search" data-base={context.relativeURL('./')}>
                <div class="field">
                    <label for="tsd-search-field" class="tsd-widget tsd-toolbar-icon search no-caption">
                        {context.icons.search()}
                    </label>
                    <input type="text" id="tsd-search-field" aria-label={context.i18n.theme_search()} />
                </div>

                <div class="field">
                    <div id="tsd-toolbar-links">
                        {Object.entries(context.options.getValue('navigationLinks')).map(([label, url]) => (
                            <a href={url}>{label}</a>
                        ))}
                    </div>
                </div>

                <ul class="results">
                    <li class="state loading">{context.i18n.theme_preparing_search_index()}</li>
                    <li class="state failure">{context.i18n.theme_search_index_not_available()}</li>
                </ul>

                <a href={context.options.getValue('titleLink') || context.relativeURL('index.html')} class="title">
                    {getDisplayName(props.project)}
                </a>
            </div>

            <div class="table-cell" id="tsd-widgets">
                <a
                    href="#"
                    class="tsd-widget tsd-toolbar-icon menu no-caption"
                    data-toggle="menu"
                    aria-label={context.i18n.theme_menu()}
                >
                    {context.icons.menu()}
                </a>
            </div>
            <a
                class="tsd-toolbar-icon-link"
                href={`http://github.com/${props.project.packageName?.startsWith('@') ? props.project.packageName?.substring(1) : (props.project.packageName as string)}`}
            >
                <img class="tsd-toolbar-icon" src="/assets/img/iso_github.svg" alt="Go to repository" />
            </a>
        </div>
    </header>
);

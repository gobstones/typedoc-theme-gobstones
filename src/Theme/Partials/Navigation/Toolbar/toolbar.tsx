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
 * @module Theme/Partials/Navigation/Toolbar
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */

import { JSX } from 'typedoc';
import type { PageEvent, Reflection } from 'typedoc';

import { i18n } from '../../../../Strings';
import { TypedocRendererContext } from '../../../../Wrappers';
import { getDisplayName } from '../../../Utils';

export const toolbar = (context: TypedocRendererContext, props: PageEvent<Reflection>): JSX.Element => (
    <header class="tsd-page-toolbar">
        <div class="tsd-toolbar-contents container">
            <img class="tsd-toolbar-icon" src="/assets/img/iso_gobstones.svg" />

            <a href={context.options.getValue('titleLink') || context.relativeURL('index.html')} class="title">
                {getDisplayName(props.project)}
            </a>

            <div id="tsd-toolbar-links">
                {Object.entries(context.options.getValue('navigationLinks')).map(([label, url]) => (
                    <a href={url}>{label}</a>
                ))}
            </div>

            <button id="tsd-search-trigger" class="tsd-widget" aria-label={i18n.theme_search()}>
                {context.icons.search()}
            </button>
            <dialog id="tsd-search" aria-label={i18n.theme_search()}>
                <input
                    role="combobox"
                    id="tsd-search-input"
                    aria-controls="tsd-search-results"
                    aria-autocomplete="list"
                    aria-expanded="true"
                    spellcheck={false}
                    autocapitalize="off"
                    autocomplete="off"
                    placeholder={i18n.theme_search_placeholder()}
                    maxLength={100}
                />

                <ul role="listbox" id="tsd-search-results"></ul>
                <div id="tsd-search-status" aria-live="polite" aria-atomic="true">
                    <div>{i18n.theme_preparing_search_index()}</div>
                </div>
            </dialog>

            <a
                href="#"
                class="tsd-widget menu"
                id="tsd-toolbar-menu-trigger"
                data-toggle="menu"
                aria-label={i18n.theme_menu()}
            >
                {context.icons.menu()}
            </a>
            <a
                class="tsd-toolbar-icon-link"
                href={`http://github.com/${props.project.packageName?.startsWith('@') ? props.project.packageName?.substring(1) : props.project.packageName}`}
            >
                <img
                    class="tsd-toolbar-icon tsd-icon-inverted"
                    src="/assets/img/iso_github.svg"
                    alt="Go to repository"
                />
            </a>
        </div>
    </header>
);

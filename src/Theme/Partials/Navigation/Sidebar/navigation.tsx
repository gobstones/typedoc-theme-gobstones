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
 * @module Theme/Partials/Navigation/Sidebar
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */

import { JSX, PageEvent, Reflection, ReflectionKind } from 'typedoc';

import { i18n } from '../../../../Strings';
import type { TypedocRendererContext } from '../../../../Wrappers';
import { classNames } from '../../../Utils';

export const navigation = (context: TypedocRendererContext, props: PageEvent<Reflection>): JSX.Element => (
    <nav class="tsd-navigation">
        <a
            href={context.options.getValue('titleLink') || context.relativeURL('index.html')}
            class={classNames({ current: props.project === props.model })}
        >
            {context.icons[ReflectionKind.Document]()}
            <span>Overview</span>
        </a>
        <ul class="tsd-small-nested-navigation" id="tsd-nav-container" data-base={context.relativeURL('./')}>
            <li>{i18n.theme_loading()}</li>
        </ul>
    </nav>
);

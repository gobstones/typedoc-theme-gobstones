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

import { DefaultThemeRenderContext, JSX, PageEvent, Reflection, ReflectionKind } from 'typedoc';

import { classNames } from '../../../../Utils/lib';

export const navigation = (context: DefaultThemeRenderContext, props: PageEvent<Reflection>): JSX.Element => (
    <nav class="tsd-navigation">
        <a href={context.urlTo(props.project)} class={classNames({ current: props.project === props.model })}>
            {context.icons[ReflectionKind.Project]()}
            <span>Overview</span>
        </a>
        <ul class="tsd-small-nested-navigation" id="tsd-nav-container" data-base={context.relativeURL('./')}>
            <li>{context.i18n.theme_loading()}</li>
        </ul>
    </nav>
);

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
 * @module Theme/Partials/Sections
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */

import { JSX, PageEvent, Reflection, ReflectionKind } from 'typedoc';

import type { TypedocRendererContext } from '../../../Wrappers';
import { classNames, getDisplayName, hasTypeParameters, join } from '../../Utils';

export const header = (context: TypedocRendererContext, props: PageEvent<Reflection>): JSX.Element => {
    const opts: {
        readme: boolean;
        document: boolean;
    } = context.options.getValue('headings');

    // Don't render on the index page or the class hierarchy page
    // We should probably someday render on the class hierarchy page, but currently breadcrumbs
    // are entirely dependent on the reflection hierarchy, so it doesn't make sense today.
    const renderBreadcrumbs = props.url !== 'index.html' && props.url !== 'hierarchy.html';

    // Titles are always rendered on DeclarationReflection pages and the modules page for the project.
    // They are also rendered on the readme + document pages if configured to do so by the user.
    let renderTitle: boolean;
    let titleKindString = '';
    if (props.model.isProject()) {
        if (props.url === 'index.html' && props.model.readme?.length) {
            renderTitle = opts.readme;
        } else {
            renderTitle = true;
        }
    } else if (props.model.isDocument()) {
        renderTitle = opts.document;
    } else {
        renderTitle = true;
        titleKindString = ReflectionKind.singularString(props.model.kind) + ' ';
    }

    return (
        <div class="tsd-page-title">
            {renderBreadcrumbs && <ul class="tsd-breadcrumb">{context.breadcrumbs(props.model)}</ul>}
            {renderTitle && (
                <h1 class={classNames({ deprecated: props.model.isDeprecated() })}>
                    {titleKindString}
                    {getDisplayName(props.model)}
                    {hasTypeParameters(props.model) && (
                        <>
                            {'<'}
                            {join(', ', props.model.typeParameters, (item) => item.name)}
                            {'>'}
                        </>
                    )}
                    {context.reflectionFlags(props.model)}
                </h1>
            )}
        </div>
    );
};

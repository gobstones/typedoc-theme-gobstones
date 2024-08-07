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
import { JSX, DefaultThemeRenderContext, PageEvent, Reflection, ReflectionKind } from 'typedoc';

import { classNames, getDisplayName, hasTypeParameters, join } from '../../lib';

export const header = (context: DefaultThemeRenderContext, props: PageEvent<Reflection>) => {
    const HeadingLevel = props.model.isProject() ? 'h2' : 'h1';
    return (
        <div class="tsd-page-title">
            {!!props.model.parent && <ul class="tsd-breadcrumb">{context.breadcrumb(props.model)}</ul>}
            {!props.model.isDocument() && (
                <HeadingLevel class={classNames({ deprecated: props.model.isDeprecated() })}>
                    {props.model.kind !== ReflectionKind.Project &&
                        `${context.internationalization.kindSingularString(props.model.kind)} `}
                    {getDisplayName(props.model)}
                    {hasTypeParameters(props.model) && (
                        <>
                            {'<'}
                            {join(', ', props.model.typeParameters, (item) => item.name)}
                            {'>'}
                        </>
                    )}
                    {context.reflectionFlags(props.model)}
                </HeadingLevel>
            )}
        </div>
    );
};

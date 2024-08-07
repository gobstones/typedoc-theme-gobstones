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
import type { DefaultThemeRenderContext, ReferenceReflection } from 'typedoc';

export const memberReference = (
    { urlTo, i18n, commentSummary, commentTags }: DefaultThemeRenderContext,
    props: ReferenceReflection
) => {
    const referenced = props.tryGetTargetReflectionDeep();

    if (!referenced) {
        return (
            <>
                {i18n.theme_re_exports()} {props.name}
                {commentSummary(props)}
                {commentTags(props)}
            </>
        );
    }

    if (props.name === referenced.name) {
        return (
            <>
                {i18n.theme_re_exports()} <a href={urlTo(referenced)}>{referenced.name}</a>
                {commentSummary(props)}
                {commentTags(props)}
            </>
        );
    }

    return (
        <>
            {i18n.theme_renames_and_re_exports()} <a href={urlTo(referenced)}>{referenced.name}</a>
            {commentSummary(props)}
            {commentTags(props)}
        </>
    );
};

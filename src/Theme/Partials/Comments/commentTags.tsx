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
 * @module Theme/Partials/Comments
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */

import { DefaultThemeRenderContext, JSX, Reflection, ReflectionKind } from 'typedoc';

import { anchorIcon } from '../anchor-icon';

export const commentTags = (context: DefaultThemeRenderContext, props: Reflection): JSX.Element | undefined => {
    if (!props.comment) return;

    const beforeTags = context.hook('comment.beforeTags', context, props.comment, props);
    const afterTags = context.hook('comment.afterTags', context, props.comment, props);

    const tags = props.kindOf(ReflectionKind.SomeSignature)
        ? props.comment.blockTags.filter((tag) => tag.tag !== '@returns' && !tag.skipRendering)
        : props.comment.blockTags.filter((tag) => !tag.skipRendering);

    return (
        <>
            {beforeTags}
            <div class="tsd-comment tsd-typography">
                {tags.map((item) => {
                    const name = item.name
                        ? `${context.internationalization.translateTagName(item.tag)}: ${item.name}`
                        : context.internationalization.translateTagName(item.tag);

                    const anchor = props.getUniqueAliasInPage(name);

                    return (
                        <>
                            <h4 class="tsd-anchor-link">
                                <a id={anchor} class="tsd-anchor"></a>
                                {name}
                                {anchorIcon(context, anchor)}
                            </h4>
                            <JSX.Raw html={context.markdown(item.content)} />
                        </>
                    );
                })}
            </div>
            {afterTags}
        </>
    );
};

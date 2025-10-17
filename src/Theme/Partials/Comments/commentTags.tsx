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

import { JSX, Reflection, ReflectionKind } from 'typedoc';

import { translateTagName } from '../../../Strings';
import type { TypedocRendererContext } from '../../../Wrappers';
import { anchorIcon } from '../Others/anchorIcon';

export const commentTags = (context: TypedocRendererContext, props: Reflection): JSX.Element | undefined => {
    if (!props.comment) return;

    const skipSave = props.comment.blockTags.map((tag) => tag.skipRendering);

    const skippedTags: `@${string}`[] = context.options.getValue('notRenderedTags');
    const beforeTags = context.hook('comment.beforeTags', context, props.comment, props);
    const afterTags = context.hook('comment.afterTags', context, props.comment, props);

    const tags = props.kindOf(ReflectionKind.SomeSignature)
        ? props.comment.blockTags.filter(
              (tag) => tag.tag !== '@returns' && !tag.skipRendering && !skippedTags.includes(tag.tag)
          )
        : props.comment.blockTags.filter((tag) => !tag.skipRendering && !skippedTags.includes(tag.tag));

    skipSave.forEach((skip, i) => {
        if (props.comment) {
            props.comment.blockTags[i].skipRendering = skip;
        }
    });

    return (
        <>
            {beforeTags}
            <div class="tsd-comment tsd-typography">
                {tags.map((item) => {
                    const name = item.name ? `${translateTagName(item.tag)}: ${item.name}` : translateTagName(item.tag);

                    // const anchor = props.getUniqueAliasInPage(name);
                    const anchor: string = context.slugger.slug(name);

                    return (
                        <>
                            <div class={`tsd-tag-${item.tag.substring(1)}`}>
                                <h4 class="tsd-anchor-link">
                                    <a id={anchor} class="tsd-anchor"></a>
                                    {name}
                                    {anchorIcon(context, anchor)}
                                </h4>
                                <JSX.Raw html={context.markdown(item.content)} />
                            </div>
                        </>
                    );
                })}
            </div>
            {afterTags}
        </>
    );
};

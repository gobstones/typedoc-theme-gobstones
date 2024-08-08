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
/* eslint-disable no-null/no-null */
import { DefaultThemeRenderContext, ReflectionType, SignatureReflection, JSX } from 'typedoc';

import { hasTypeParameters } from '../../lib';

export function memberSignatureBody(
    context: DefaultThemeRenderContext,
    props: SignatureReflection,
    { hideSources = false }: { hideSources?: boolean } = {}
) {
    const returnsTag = props.comment?.getTag('@returns');

    return (
        <>
            {context.commentSummary(props)}

            {hasTypeParameters(props) && context.typeParameters(props.typeParameters)}

            {props.parameters && props.parameters.length > 0 && (
                <div class="tsd-parameters">
                    <h4 class="tsd-parameters-title">{context.i18n.kind_plural_parameter()}</h4>
                    <ul class="tsd-parameter-list">
                        {props.parameters.map((item) => (
                            <li class="tsd-parameter-description">
                                <div class="tsd-parameter-tags">{context.reflectionFlags(item)}</div>
                                <span>
                                    {!!item.flags.isRest && <span class="tsd-signature-symbol">...</span>}
                                    <span class="tsd-kind-parameter">{item.name}</span>
                                    {': '}
                                    {context.type(item.type)}

                                    {item.defaultValue !== null && (
                                        <span class="tsd-signature-symbol">
                                            {item.defaultValue && ' = '}
                                            {item.defaultValue}
                                        </span>
                                    )}
                                </span>
                                {context.commentSummary(item)}
                                {context.commentTags(item)}
                                {item.type instanceof ReflectionType && context.parameter(item.type.declaration)}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            {props.type && (
                <>
                    <h4 class="tsd-returns-title">
                        {context.i18n.theme_returns()} {context.type(props.type)}
                    </h4>
                    {returnsTag && <JSX.Raw html={context.markdown(returnsTag.content)} />}
                    {props.type instanceof ReflectionType && context.parameter(props.type.declaration)}
                </>
            )}

            {context.commentTags(props)}

            {!hideSources && context.memberSources(props)}
        </>
    );
}

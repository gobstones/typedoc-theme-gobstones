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
import type { DefaultThemeRenderContext, TypeParameterReflection } from 'typedoc';
import { JSX } from 'typedoc';

export function typeParameters(context: DefaultThemeRenderContext, typeParameters: TypeParameterReflection[]) {
    return (
        <>
            <section class="tsd-panel">
                <h4>{context.i18n.kind_plural_type_parameter()}</h4>
                <ul class="tsd-type-parameter-list">
                    {typeParameters.map((item) => (
                        <li>
                            <span>
                                <a id={item.anchor} class="tsd-anchor"></a>
                                {item.flags.isConst && <span class="tsd-signature-keyword">const </span>}
                                {item.varianceModifier && (
                                    <span class="tsd-signature-keyword">{item.varianceModifier} </span>
                                )}
                                <span class="tsd-kind-type-parameter">{item.name}</span>
                                {!!item.type && (
                                    <>
                                        <span class="tsd-signature-keyword"> extends </span>
                                        {context.type(item.type)}
                                    </>
                                )}
                                {!!item.default && (
                                    <>
                                        {' = '}
                                        {context.type(item.default)}
                                    </>
                                )}
                            </span>
                            {context.commentSummary(item)}
                            {context.commentTags(item)}
                        </li>
                    ))}
                </ul>
            </section>
        </>
    );
}

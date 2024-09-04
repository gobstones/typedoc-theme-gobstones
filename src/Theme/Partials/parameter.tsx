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
 * @module Theme/Partials
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */

import { DeclarationReflection, DefaultThemeRenderContext, JSX, ReflectionType, SignatureReflection } from 'typedoc';

import { classNames, getKindClass, wbr } from '../../Utils/lib';

export const parameter = (context: DefaultThemeRenderContext, props: DeclarationReflection): JSX.Element => (
    <>
        <ul class="tsd-parameters">
            {!!props.signatures && (
                <li class="tsd-parameter-signature">
                    <ul class={classNames({ 'tsd-signatures': true }, context.getReflectionClasses(props))}>
                        {props.signatures.map((item) => (
                            <>
                                <li class="tsd-signature" id={item.anchor}>
                                    {context.memberSignatureTitle(item, {
                                        hideName: true
                                    })}
                                </li>
                                <li class="tsd-description">
                                    {context.memberSignatureBody(item, {
                                        hideSources: true
                                    })}
                                </li>
                            </>
                        ))}
                    </ul>
                </li>
            )}
            {props.indexSignatures?.map((index) => renderParamIndexSignature(context, index))}
            {props.children?.map((item) => (
                <>
                    {item.signatures ? (
                        <li class="tsd-parameter">
                            <h5>
                                {!!item.flags.isRest && <span class="tsd-signature-symbol">...</span>}
                                <span class={getKindClass(item)}>{wbr(item.name)}</span>
                                <span class="tsd-signature-symbol">{!!item.flags.isOptional && '?'}:</span>
                                function
                            </h5>

                            {context.memberSignatures(item)}
                        </li>
                    ) : item.type ? (
                        <>
                            {/* standard type */}
                            <li class="tsd-parameter">
                                <h5>
                                    {context.reflectionFlags(item)}
                                    {!!item.flags.isRest && <span class="tsd-signature-symbol">...</span>}
                                    <span class={getKindClass(item)}>{wbr(item.name)}</span>
                                    <span class="tsd-signature-symbol">
                                        {!!item.flags.isOptional && '?'}
                                        {': '}
                                    </span>
                                    {context.type(item.type)}
                                </h5>
                                {context.commentSummary(item)}
                                {context.commentTags(item)}
                                {!!item.children && context.parameter(item)}
                                {item.type instanceof ReflectionType && context.parameter(item.type.declaration)}
                            </li>
                        </>
                    ) : (
                        <>
                            {/* getter/setter */}
                            {item.getSignature && (
                                <>
                                    {/* getter */}
                                    <li class="tsd-parameter">
                                        <h5>
                                            {context.reflectionFlags(item.getSignature)}
                                            <span class="tsd-signature-keyword">get </span>
                                            <span class={getKindClass(item)}>{wbr(item.name)}</span>
                                            <span class="tsd-signature-symbol">(): </span>
                                            {context.type(item.getSignature.type)}
                                        </h5>

                                        {context.commentSummary(item.getSignature)}
                                        {context.commentTags(item.getSignature)}
                                    </li>
                                </>
                            )}
                            {item.setSignature && (
                                <>
                                    {/* setter */}
                                    <li class="tsd-parameter">
                                        <h5>
                                            {context.reflectionFlags(item.setSignature)}
                                            <span class="tsd-signature-keyword">set </span>
                                            <span class={getKindClass(item)}>{wbr(item.name)}</span>
                                            <span class="tsd-signature-symbol">(</span>
                                            {item.setSignature.parameters?.map((i) => (
                                                <>
                                                    {i.name}
                                                    <span class="tsd-signature-symbol">: </span>
                                                    {context.type(i.type)}
                                                </>
                                            ))}
                                            <span class="tsd-signature-symbol">): </span>
                                            {context.type(item.setSignature.type)}
                                        </h5>

                                        {context.commentSummary(item.setSignature)}
                                        {context.commentTags(item.setSignature)}
                                    </li>
                                </>
                            )}
                        </>
                    )}
                </>
            ))}
        </ul>
    </>
);

const renderParamIndexSignature = (context: DefaultThemeRenderContext, index: SignatureReflection): JSX.Element => (
    <li class="tsd-parameter-index-signature">
        <h5>
            <span class="tsd-signature-symbol">[</span>
            {index.parameters?.map((item) => (
                <>
                    <span class={getKindClass(item)}>{item.name}</span>
                    {': '}
                    {context.type(item.type)}
                </>
            ))}
            <span class="tsd-signature-symbol">{']: '}</span>
            {context.type(index.type)}
        </h5>
        {context.commentSummary(index)}
        {context.commentTags(index)}
        {index.type instanceof ReflectionType && context.parameter(index.type.declaration)}
    </li>
);

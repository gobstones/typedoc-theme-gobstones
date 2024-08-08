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
import { DefaultThemeRenderContext, ParameterReflection, ReflectionKind, SignatureReflection, JSX } from 'typedoc';

import { getKindClass, join, renderTypeParametersSignature, wbr } from '../lib';

function renderParameterWithType(context: DefaultThemeRenderContext, item: ParameterReflection) {
    return (
        <>
            {!!item.flags.isRest && <span class="tsd-signature-symbol">...</span>}
            <span class="tsd-kind-parameter">{item.name}</span>
            <span class="tsd-signature-symbol">
                {!!item.flags.isOptional && '?'}
                {!!item.defaultValue && '?'}
                {': '}
            </span>
            {context.type(item.type)}
        </>
    );
}

function renderParameterWithoutType(item: ParameterReflection) {
    return (
        <>
            {!!item.flags.isRest && <span class="tsd-signature-symbol">...</span>}
            <span class="tsd-kind-parameter">{item.name}</span>
            {(item.flags.isOptional || item.defaultValue) && <span class="tsd-signature-symbol">?</span>}
        </>
    );
}

export function memberSignatureTitle(
    context: DefaultThemeRenderContext,
    props: SignatureReflection,
    {
        hideName = false,
        arrowStyle = false,
        hideParamTypes = context.options.getValue('hideParameterTypesInTitle')
    }: { hideName?: boolean; arrowStyle?: boolean; hideParamTypes?: boolean } = {}
) {
    // eslint-disable-next-line no-null/no-null
    const renderParam = hideParamTypes ? renderParameterWithoutType : renderParameterWithType.bind(null, context);

    return (
        <>
            {!hideName ? (
                <span class={getKindClass(props)}>{wbr(props.name)}</span>
            ) : (
                <>
                    {props.kind === ReflectionKind.ConstructorSignature && (
                        <>
                            {!!props.flags.isAbstract && <span class="tsd-signature-keyword">abstract </span>}
                            <span class="tsd-signature-keyword">new </span>
                        </>
                    )}
                </>
            )}
            {renderTypeParametersSignature(context, props.typeParameters)}
            <span class="tsd-signature-symbol">(</span>
            {join(', ', props.parameters ?? [], renderParam)}
            <span class="tsd-signature-symbol">)</span>
            {!!props.type && (
                <>
                    <span class="tsd-signature-symbol">{arrowStyle ? ' => ' : ': '}</span>
                    {context.type(props.type)}
                </>
            )}
        </>
    );
}

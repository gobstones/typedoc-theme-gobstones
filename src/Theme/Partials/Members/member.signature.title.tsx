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
 * @module Theme/Partials/Members
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */

import { DefaultThemeRenderContext, JSX, ParameterReflection, ReflectionKind, SignatureReflection } from 'typedoc';

import { getKindClass, join, renderTypeParametersSignature, wbr } from '../../../Utils/lib';

const renderParameterWithType = (context: DefaultThemeRenderContext, item: ParameterReflection): JSX.Element => (
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

const renderParameterWithoutType = (item: ParameterReflection): JSX.Element => (
    <>
        {!!item.flags.isRest && <span class="tsd-signature-symbol">...</span>}
        <span class="tsd-kind-parameter">{item.name}</span>
        {(item.flags.isOptional || item.defaultValue) && <span class="tsd-signature-symbol">?</span>}
    </>
);

export const memberSignatureTitle = (
    context: DefaultThemeRenderContext,
    props: SignatureReflection,
    {
        hideName = false,
        arrowStyle = false,
        hideParamTypes = context.options.getValue('hideParameterTypesInTitle')
    }: { hideName?: boolean; arrowStyle?: boolean; hideParamTypes?: boolean } = {}
): JSX.Element => {
    const renderParam: (item: ParameterReflection) => JSX.Element = hideParamTypes
        ? renderParameterWithoutType
        : // eslint-disable-next-line no-null/no-null
          (renderParameterWithType.bind(null, context) as (item: ParameterReflection) => JSX.Element);

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
};

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

import { JSX } from 'typedoc';
import type { DeclarationReflection, DefaultThemeRenderContext, ReflectionType } from 'typedoc';

import { getKindClass, hasTypeParameters, renderTypeParametersSignature, wbr } from '../../../Utils/lib';

const renderingTypeDeclarationIsUseful = (declaration: DeclarationReflection): boolean => {
    if (declaration.hasComment()) return true;
    if (declaration.children?.some(renderingTypeDeclarationIsUseful)) return true;
    if (declaration.type?.type === 'reflection' && renderingTypeDeclarationIsUseful(declaration.type.declaration)) {
        return true;
    }

    return declaration
        .getAllSignatures()
        .some((sig) => sig.hasComment() || sig.parameters?.some((p) => p.hasComment()));
};

export const memberDeclaration = (context: DefaultThemeRenderContext, props: DeclarationReflection): JSX.Element => {
    const renderTypeDeclaration = (type: ReflectionType): JSX.Element | undefined => {
        if (renderingTypeDeclarationIsUseful(type.declaration)) {
            return (
                <div class="tsd-type-declaration">
                    <h4>{context.i18n.theme_type_declaration()}</h4>
                    {context.parameter(type.declaration)}
                </div>
            );
        }
        return undefined;
    };

    const visitor = { reflection: renderTypeDeclaration };

    return (
        <>
            <div class="tsd-signature">
                <span class={getKindClass(props)}>{wbr(props.name)}</span>
                {renderTypeParametersSignature(context, props.typeParameters)}
                {props.type && (
                    <>
                        <span class="tsd-signature-symbol">{!!props.flags.isOptional && '?'}:</span>{' '}
                        {context.type(props.type)}
                    </>
                )}
                {!!props.defaultValue && (
                    <>
                        <span class="tsd-signature-symbol">
                            {' = '}
                            {props.defaultValue}
                        </span>
                    </>
                )}
            </div>

            {context.commentSummary(props)}

            {hasTypeParameters(props) && context.typeParameters(props.typeParameters)}

            {props.type?.visit<JSX.Children>({
                reflection: renderTypeDeclaration,
                array: (arr) => arr.elementType.visit(visitor),
                intersection: (int) => int.types.map((t) => t.visit(visitor)),
                union: (union) => {
                    if (union.elementSummaries) {
                        const result: JSX.Children = [];
                        for (let i = 0; i < union.types.length; ++i) {
                            result.push(
                                <li>
                                    {context.type(union.types[i])}
                                    <JSX.Raw html={context.markdown(union.elementSummaries[i])} />
                                    {union.types[i].visit(visitor)}
                                </li>
                            );
                        }
                        return <ul>{result}</ul>;
                    }
                    return union.types.map((t) => t.visit(visitor));
                },
                reference: (ref) => ref.typeArguments?.map((t) => t.visit(visitor)),
                tuple: (ref) => ref.elements.map((t) => t.visit(visitor))
            })}

            {context.commentTags(props)}

            {context.memberSources(props)}
        </>
    );
};

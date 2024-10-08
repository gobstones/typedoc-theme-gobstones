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
 * @module Theme/Templates
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */

import {
    ContainerReflection,
    DeclarationReflection,
    DefaultThemeRenderContext,
    JSX,
    PageEvent,
    ReflectionKind,
    ReflectionType,
    SignatureReflection
} from 'typedoc';

import { classNames, getKindClass, hasTypeParameters } from '../../Utils/lib';

/**
 * The component that defines how to render any reflection element.
 * Any type of element to display, such as a module, class, function or other
 * uses this template as the main structure.
 *
 * @param context - The theme context.
 * @param props - A page event with the container's reflection.
 *
 * @returns A JSX.Element to render the reflection element.
 */
export const reflectionTemplate = (
    context: DefaultThemeRenderContext,
    props: PageEvent<ContainerReflection>
): JSX.Element => {
    if (
        props.model.kindOf(ReflectionKind.TypeAlias || ReflectionKind.Variable) &&
        props.model instanceof DeclarationReflection
    ) {
        return context.memberDeclaration(props.model);
    }

    return (
        <>
            {props.model.hasComment() && (
                <section class="tsd-panel tsd-comment">
                    {context.commentSummary(props.model)}
                    {context.commentTags(props.model)}
                </section>
            )}
            {props.model instanceof DeclarationReflection &&
                props.model.kind === ReflectionKind.Module &&
                props.model.readme?.length && (
                    <section class="tsd-panel tsd-typography">
                        <JSX.Raw html={context.markdown(props.model.readme)} />
                    </section>
                )}

            {context.reflectionPreview(props.model)}

            {hasTypeParameters(props.model) && <> {context.typeParameters(props.model.typeParameters)} </>}
            {props.model instanceof DeclarationReflection && (
                <>
                    {context.hierarchy(props.model.typeHierarchy)}

                    {!!props.model.implementedTypes && (
                        <section class="tsd-panel">
                            <h4>{context.i18n.theme_implements()}</h4>
                            <ul class="tsd-hierarchy">
                                {props.model.implementedTypes.map((item) => (
                                    <li>{context.type(item)}</li>
                                ))}
                            </ul>
                        </section>
                    )}
                    {!!props.model.implementedBy && (
                        <section class="tsd-panel">
                            <h4>{context.i18n.theme_implemented_by()}</h4>
                            <ul class="tsd-hierarchy">
                                {props.model.implementedBy.map((item) => (
                                    <li>{context.type(item)}</li>
                                ))}
                            </ul>
                        </section>
                    )}
                    {!!props.model.signatures?.length && (
                        <section class="tsd-panel">{context.memberSignatures(props.model)}</section>
                    )}
                    {!!props.model.indexSignatures?.length && (
                        <section class={classNames({ 'tsd-panel': true }, context.getReflectionClasses(props.model))}>
                            <h4 class="tsd-before-signature">{context.i18n.theme_indexable()}</h4>
                            <div class="tsd-signatures">
                                {props.model.indexSignatures.map((index) => renderIndexSignature(context, index))}
                            </div>
                        </section>
                    )}
                    {!props.model.signatures && context.memberSources(props.model)}
                </>
            )}
            {!!props.model.children?.length && context.index(props.model)}
            {context.members(props.model)}
        </>
    );
};

const renderIndexSignature = (context: DefaultThemeRenderContext, index: SignatureReflection): JSX.Element => (
    <li class="tsd-index-signature">
        <div class="tsd-signature">
            <span class="tsd-signature-symbol">[</span>
            {index.parameters?.map((item) => (
                <>
                    <span class={getKindClass(item)}>{item.name}</span>:{context.type(item.type)}
                </>
            ))}
            <span class="tsd-signature-symbol">]: </span>
            {context.type(index.type)}
        </div>
        {context.commentSummary(index)}
        {context.commentTags(index)}
        {index.type instanceof ReflectionType && context.parameter(index.type.declaration)}
    </li>
);

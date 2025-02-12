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
 * @module Theme/Partials/Types
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */

import {
    CommentDisplayPart,
    DeclarationReflection,
    DefaultThemeRenderContext,
    JSX,
    ReferenceType,
    Reflection,
    ReflectionKind,
    SignatureReflection,
    SomeType
} from 'typedoc';

import { classNames, getKindClass } from '../../../Utils';

const highlightedPropertyDetails = (
    context: DefaultThemeRenderContext,
    highlighted?: Map<string, CommentDisplayPart[]>
): JSX.Element | undefined => {
    if (!highlighted?.size) return;

    return (
        <ul class="tsd-parameters">
            {Array.from(highlighted.entries(), ([name, parts]) => (
                <li class="tsd-parameter">
                    <h5>
                        <span>{name}</span>
                    </h5>
                    {context.displayParts(parts)}
                </li>
            ))}
        </ul>
    );
};

const highlightedDeclarationDetails = (
    context: DefaultThemeRenderContext,
    declaration: DeclarationReflection,
    renderAnchors: boolean,
    highlightedProperties?: Map<string, CommentDisplayPart[]>
): JSX.Element => (
    <ul class="tsd-parameters">
        {declaration
            .getProperties()
            ?.map(
                (child) =>
                    highlightedProperties?.has(child.name) &&
                    renderChild(context, child, renderAnchors, highlightedProperties.get(child.name))
            )}
    </ul>
);

const declarationDetails = (
    context: DefaultThemeRenderContext,
    declaration: DeclarationReflection,
    renderAnchors: boolean
): JSX.Children => (
    <>
        {context.commentSummary(declaration)}
        <ul class="tsd-parameters">
            {declaration.signatures && (
                <li class="tsd-parameter-signature">
                    <ul class={classNames({ 'tsd-signatures': true }, context.getReflectionClasses(declaration))}>
                        {declaration.signatures.map((item) => (
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
            {declaration.indexSignatures?.map((index) => renderIndexSignature(context, index))}
            {declaration.getProperties()?.map((child) => renderChild(context, child, renderAnchors))}
        </ul>
    </>
);

const renderChild = (
    context: DefaultThemeRenderContext,
    child: DeclarationReflection,
    renderAnchors: boolean,
    highlight?: CommentDisplayPart[]
): JSX.Element => {
    if (child.signatures) {
        return (
            <li class="tsd-parameter">
                <h5>
                    {!!child.flags.isRest && <span class="tsd-signature-symbol">...</span>}
                    <span class={getKindClass(child)}>{child.name}</span>
                    {child.anchor && <a id={child.anchor} class="tsd-anchor"></a>}
                    <span class="tsd-signature-symbol">{!!child.flags.isOptional && '?'}:</span>
                    function
                </h5>

                {context.memberSignatures(child)}
            </li>
        );
    }

    const highlightOrComment = (refl: Reflection): JSX.Element | undefined => {
        if (highlight) {
            return context.displayParts(highlight);
        }
        return (
            <>
                {context.commentSummary(refl)}
                {context.commentTags(refl)}
            </>
        );
    };

    // standard type
    if (child.type) {
        return (
            <li class="tsd-parameter">
                <h5>
                    {context.reflectionFlags(child)}
                    {!!child.flags.isRest && <span class="tsd-signature-symbol">...</span>}
                    <span class={getKindClass(child)}>{child.name}</span>
                    {child.anchor && <a id={child.anchor} class="tsd-anchor"></a>}
                    <span class="tsd-signature-symbol">
                        {!!child.flags.isOptional && '?'}
                        {': '}
                    </span>
                    {context.type(child.type)}
                </h5>
                {highlightOrComment(child)}
                {child.getProperties().some(renderingChildIsUseful) && (
                    <ul class="tsd-parameters">
                        {child.getProperties().map((c) => renderChild(context, c, renderAnchors))}
                    </ul>
                )}
            </li>
        );
    }

    // getter/setter
    return (
        <>
            {child.getSignature && (
                <li class="tsd-parameter">
                    <h5>
                        {context.reflectionFlags(child.getSignature)}
                        <span class="tsd-signature-keyword">get </span>
                        <span class={getKindClass(child)}>{child.name}</span>
                        {child.anchor && <a id={child.anchor} class="tsd-anchor"></a>}
                        <span class="tsd-signature-symbol">(): </span>
                        {context.type(child.getSignature.type)}
                    </h5>

                    {highlightOrComment(child.getSignature)}
                </li>
            )}
            {child.setSignature && (
                <li class="tsd-parameter">
                    <h5>
                        {context.reflectionFlags(child.setSignature)}
                        <span class="tsd-signature-keyword">set </span>
                        <span class={getKindClass(child)}>{child.name}</span>
                        {!child.getSignature && child.anchor && <a id={child.anchor} class="tsd-anchor"></a>}
                        <span class="tsd-signature-symbol">(</span>
                        {child.setSignature.parameters?.map((item) => (
                            <>
                                {item.name}
                                <span class="tsd-signature-symbol">: </span>
                                {context.type(item.type)}
                            </>
                        ))}
                        <span class="tsd-signature-symbol">): </span>
                        {context.type(child.setSignature.type)}
                    </h5>

                    {highlightOrComment(child.setSignature)}
                </li>
            )}
        </>
    );
};

const renderIndexSignature = (context: DefaultThemeRenderContext, index: SignatureReflection): JSX.Element => (
    <li class="tsd-parameter-index-signature">
        <h5>
            {index.flags.isReadonly && <span class="tsd-signature-keyword">readonly </span>}
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
        {index.type && context.typeDeclaration(index.type)}
    </li>
);

const expanded = new Set<Reflection>();
export const shouldExpandReference = (reference: ReferenceType): boolean => {
    const target = reference.reflection;
    if (reference.highlightedProperties) {
        return !target || !expanded.has(target);
    }

    // eslint-disable-next-line no-bitwise
    if (!target?.kindOf(ReflectionKind.TypeAlias | ReflectionKind.Interface)) return false;
    if (!target.comment?.hasModifier('@expand')) return false;

    return !expanded.has(target);
};

export const typeDetailsImpl = (
    context: DefaultThemeRenderContext,
    type: SomeType,
    renderAnchors: boolean,
    highlighted?: Map<string, CommentDisplayPart[]>
): JSX.Children => {
    const result = type.visit<JSX.Children>({
        array: (typ) => context.typeDetails(typ.elementType, renderAnchors),
        intersection: (typ) => typ.types.map((t) => context.typeDetails(t, renderAnchors)),
        union: (typ) => {
            const children: JSX.Children = [];
            for (let i = 0; i < typ.types.length; ++i) {
                children.push(
                    <li>
                        {context.type(typ.types[i])}
                        {context.displayParts(typ.elementSummaries?.[i])}
                        {context.typeDetailsIfUseful(typ.types[i])}
                    </li>
                );
            }
            return <ul>{children}</ul>;
        },
        reflection: (typ) => {
            const declaration = typ.declaration;
            if (highlighted) {
                return highlightedDeclarationDetails(context, declaration, renderAnchors, highlighted);
            }
            return declarationDetails(context, declaration, renderAnchors);
        },
        reference: (reference) => {
            if (shouldExpandReference(reference)) {
                const target = reference.reflection;
                if (!target?.isDeclaration()) {
                    return highlightedPropertyDetails(context, reference.highlightedProperties);
                }

                // Ensure we don't go into an infinite loop here
                expanded.add(target);
                const details = target.type
                    ? context.typeDetails(target.type, renderAnchors)
                    : declarationDetails(context, target, renderAnchors);
                expanded.delete(target);
                return details;
            }
        }
        // tuple??
    });

    if (!result && highlighted) {
        return highlightedPropertyDetails(context, highlighted);
    }

    return result;
};

export const renderingChildIsUseful = (refl: DeclarationReflection): boolean => {
    // Object types directly under a variable/type alias will always be considered useful.
    // This probably isn't ideal, but it is an easy thing to check when assigning URLs
    // in the default theme, so we'll make the assumption that those properties ought to always
    // be rendered.
    // This should be kept in sync with the DefaultTheme.applyAnchorUrl function.
    if (
        refl.kindOf(ReflectionKind.TypeLiteral) &&
        refl.parent?.kindOf(ReflectionKind.SomeExport) &&
        (refl.parent as DeclarationReflection).type?.type === 'reflection'
    ) {
        return true;
    }

    if (renderingThisChildIsUseful(refl)) {
        return true;
    }

    return refl.getProperties().some(renderingThisChildIsUseful);
};

const renderingThisChildIsUseful = (refl: DeclarationReflection): boolean => {
    if (refl.hasComment()) return true;

    const declaration = refl.type?.type === 'reflection' ? refl.type.declaration : refl;
    if (declaration.hasComment()) return true;

    return declaration
        .getAllSignatures()
        .some((sig) => sig.hasComment() || sig.parameters?.some((p) => p.hasComment()));
};

/* eslint-disable no-bitwise */
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

import { ok } from 'assert';

import {
    DeclarationReflection,
    DefaultThemeRenderContext,
    JSX,
    LiteralType,
    ProjectReflection,
    ReferenceType,
    Reflection,
    ReflectionKind,
    Type,
    TypeContext,
    TypeKindMap
} from 'typedoc';

import { getKindClass, join, stringify } from '../../../Utils/lib';

/**
 * The exportable reflection kinds
 */
const EXPORTABLE: ReflectionKind =
    ReflectionKind.Class |
    ReflectionKind.Interface |
    ReflectionKind.Enum |
    ReflectionKind.TypeAlias |
    ReflectionKind.Function |
    ReflectionKind.Variable;

/**
 * A map to avoid name collisions.
 */
const nameCollisionCache = new WeakMap<ProjectReflection, Record<string, number | undefined>>();

/**
 * Returns the number of collisions of the given name in the given project reflection.
 *
 * @param project - The project reflection to count the number of collisions in.
 * @param name - The name to test the number of collisions.
 *
 * @returns The number of collisions for the name in the project.
 */
const getNameCollisionCount = (project: ProjectReflection, name: string): number => {
    let collisions = nameCollisionCache.get(project);
    if (collisions === undefined) {
        collisions = {};
        for (const reflection of project.getReflectionsByKind(EXPORTABLE)) {
            collisions[reflection.name] = (collisions[reflection.name] ?? 0) + 1;
        }
        nameCollisionCache.set(project, collisions);
    }
    return collisions[name] ?? 0;
};

/**
 * Returns a (hopefully) globally unique path for the given reflection.
 *
 * This only works for exportable symbols, so e.g. methods are not affected by this.
 *
 * If the given reflection has a globally unique name already, then it will be returned as is. If the name is
 * ambiguous (i.e. there are two classes with the same name in different namespaces), then the namespaces path of the
 * reflection will be returned.
 *
 * @param reflection - The reflection to get the path for.
 *
 * @returns A unique path for the reflection.
 */
const getUniquePath = (reflection: Reflection): Reflection[] => {
    if (reflection.kindOf(EXPORTABLE)) {
        if (getNameCollisionCount(reflection.project, reflection.name) >= 2) {
            return getNamespacedPath(reflection);
        }
    }
    return [reflection];
};

/**
 * Return the namespace path for the given reflection.
 *
 * @param reflection - The reflection to get the namespace path.
 *
 * @returns The namespace path.
 */
const getNamespacedPath = (reflection: Reflection): Reflection[] => {
    const path = [reflection];
    let parent = reflection.parent;
    while (parent?.kindOf(ReflectionKind.Namespace)) {
        path.unshift(parent);
        parent = parent.parent;
    }
    return path;
};

/**
 * Render the unique path of the given reflection in the context of the theme,
 * returning the corresponding JSX.Element that links to the path item.
 *
 * @param context - The theme render context
 * @param reflection - The reflection to render the path of.
 * @returns A JSX element that renders the reflection path.
 */
const renderUniquePath = (context: DefaultThemeRenderContext, reflection: Reflection): JSX.Element =>
    join(<span class="tsd-signature-symbol">.</span>, getUniquePath(reflection), (item) => (
        <a href={context.urlTo(item)} class={'tsd-signature-type ' + getKindClass(item)}>
            {item.name}
        </a>
    ));

/**
 * The indentation size to use
 */
const indentSize = 4;
/**
 * The current depth of the indentation
 */
let indentationDepth = 0;
/**
 * Returns a JSX Element that represents the indentation of an element using the
 * indentation depth.
 */
const includeIndentation = (): JSX.Element =>
    indentationDepth > 0 ? <span>{'\u00A0'.repeat(indentationDepth * indentSize)}</span> : <></>;

export const validateStateIsClean = (page: string): void => {
    ok(
        indentationDepth === 0,
        `Rendering ${page}: Indentation depth increment/decrement not matched: ${indentationDepth.toString()}`
    );
};

// The type helper accepts an optional needsParens parameter that is checked
// if an inner type may result in invalid output without them. For example:
// 1 | 2[] !== (1 | 2)[]
// () => 1 | 2 !== (() => 1) | 2
const typeRenderers: {
    [K in keyof TypeKindMap]: (
        context: DefaultThemeRenderContext,
        type: TypeKindMap[K],
        options: { topLevelLinks: boolean }
    ) => JSX.Element;
} = {
    array: (context, type) => (
        <>
            {renderType(context, type.elementType, TypeContext.arrayElement)}
            <span class="tsd-signature-symbol">[]</span>
        </>
    ),
    conditional: (context, type) => {
        indentationDepth++;
        const parts: JSX.Element[] = [
            renderType(context, type.checkType, TypeContext.conditionalCheck),
            <span class="tsd-signature-keyword"> extends </span>,
            renderType(context, type.extendsType, TypeContext.conditionalExtends),
            <br />,
            includeIndentation(),
            <span class="tsd-signature-symbol">? </span>,
            renderType(context, type.trueType, TypeContext.conditionalTrue),
            <br />,
            includeIndentation(),
            <span class="tsd-signature-symbol">: </span>,
            renderType(context, type.falseType, TypeContext.conditionalFalse)
        ];
        indentationDepth--;

        return <>{parts}</>;
    },
    indexedAccess: (context, type) => {
        let indexType: JSX.Element = renderType(context, type.indexType, TypeContext.indexedIndex);

        if (
            type.objectType instanceof ReferenceType &&
            type.objectType.reflection &&
            type.indexType instanceof LiteralType &&
            typeof type.indexType.value === 'string'
        ) {
            const childReflection = type.objectType.reflection.getChildByName([type.indexType.value]);
            if (childReflection) {
                indexType = <a href={context.urlTo(childReflection)}>{indexType}</a>;
            }
        }

        return (
            <>
                {renderType(context, type.objectType, TypeContext.indexedObject)}
                <span class="tsd-signature-symbol">[</span>
                {indexType}
                <span class="tsd-signature-symbol">]</span>
            </>
        );
    },
    inferred: (context, type) => (
        <>
            <span class="tsd-signature-keyword">infer </span> <span class="tsd-kind-type-parameter">{type.name}</span>
            {type.constraint && (
                <>
                    <span class="tsd-signature-keyword"> extends </span>
                    {renderType(context, type.constraint, TypeContext.inferredConstraint)}
                </>
            )}
        </>
    ),
    intersection: (context, type) =>
        join(<span class="tsd-signature-symbol"> &amp; </span>, type.types, (item) =>
            renderType(context, item, TypeContext.intersectionElement)
        ),
    intrinsic: (_context, type) => <span class="tsd-signature-type">{type.name}</span>,
    literal: (_context, type) => <span class="tsd-signature-type">{stringify(type.value)}</span>,
    mapped: (context, type) => {
        indentationDepth++;
        const parts = [<span class="tsd-signature-symbol">{'{'}</span>, <br />, includeIndentation()];

        switch (type.readonlyModifier) {
            case '+':
                parts.push(<span class="tsd-signature-keyword">readonly </span>);
                break;
            case '-':
                parts.push(
                    <>
                        <span class="tsd-signature-symbol">-</span>
                        <span class="tsd-signature-keyword">readonly </span>
                    </>
                );
                break;
            default:
                break;
        }

        parts.push(
            <span class="tsd-signature-symbol">[</span>,
            <span class="tsd-kind-type-parameter">{type.parameter}</span>,
            <span class="tsd-signature-keyword"> in </span>,
            renderType(context, type.parameterType, TypeContext.mappedParameter)
        );

        if (type.nameType) {
            parts.push(
                <span class="tsd-signature-keyword"> as </span>,
                renderType(context, type.nameType, TypeContext.mappedName)
            );
        }

        parts.push(<span class="tsd-signature-symbol">]</span>);

        switch (type.optionalModifier) {
            case '+':
                parts.push(<span class="tsd-signature-symbol">?: </span>);
                break;
            case '-':
                parts.push(<span class="tsd-signature-symbol">-?: </span>);
                break;
            default:
                parts.push(<span class="tsd-signature-symbol">: </span>);
        }

        parts.push(renderType(context, type.templateType, TypeContext.mappedTemplate));

        indentationDepth--;

        return (
            <>
                {parts}
                <br />
                {includeIndentation()}
                <span class="tsd-signature-symbol">{'}'}</span>
            </>
        );
    },
    namedTupleMember: (context, type) => (
        <>
            {type.name}
            {type.isOptional ? (
                <span class="tsd-signature-symbol">?: </span>
            ) : (
                <span class="tsd-signature-symbol">: </span>
            )}
            {renderType(context, type.element, TypeContext.tupleElement)}
        </>
    ),
    optional: (context, type) => (
        <>
            {renderType(context, type.elementType, TypeContext.optionalElement)}
            <span class="tsd-signature-symbol">?</span>
        </>
    ),
    predicate: (context, type) => (
        <>
            {!!type.asserts && <span class="tsd-signature-keyword">asserts </span>}
            <span class="tsd-kind-parameter">{type.name}</span>
            {!!type.targetType && (
                <>
                    <span class="tsd-signature-keyword"> is </span>
                    {renderType(context, type.targetType, TypeContext.predicateTarget)}
                </>
            )}
        </>
    ),
    query: (context, type) => (
        <>
            <span class="tsd-signature-keyword">typeof </span>
            {renderType(context, type.queryType, TypeContext.queryTypeTarget)}
        </>
    ),
    reference: (context, type) => {
        const reflection = type.reflection;

        let name: JSX.Element;

        if (reflection) {
            if (reflection.kindOf(ReflectionKind.TypeParameter)) {
                name = (
                    <a class="tsd-signature-type tsd-kind-type-parameter" href={context.urlTo(reflection)}>
                        {reflection.name}
                    </a>
                );
            } else {
                name = renderUniquePath(context, reflection);
            }
        } else if (type.externalUrl) {
            name = (
                <a href={type.externalUrl} class="tsd-signature-type external" target="_blank">
                    {type.name}
                </a>
            );
        } else if (type.refersToTypeParameter) {
            name = <span class="tsd-signature-type tsd-kind-type-parameter">{type.name}</span>;
        } else {
            name = <span class="tsd-signature-type">{type.name}</span>;
        }

        if (type.typeArguments?.length) {
            return (
                <>
                    {name}
                    <span class="tsd-signature-symbol">{'<'}</span>
                    {join(<span class="tsd-signature-symbol">, </span>, type.typeArguments, (item) =>
                        renderType(context, item, TypeContext.referenceTypeArgument)
                    )}
                    <span class="tsd-signature-symbol">{'>'}</span>
                </>
            );
        }

        return name;
    },
    reflection: (context, type, { topLevelLinks }) => {
        const members: JSX.Element[] = [];
        const children: DeclarationReflection[] = type.declaration.children || [];

        indentationDepth++;

        const renderName = (named: Reflection): JSX.Element =>
            topLevelLinks ? (
                <a class={getKindClass(named)} href={context.urlTo(named)}>
                    {named.name}
                </a>
            ) : (
                <span class={getKindClass(named)}>{named.name}</span>
            );

        for (const item of children) {
            if (item.getSignature && item.setSignature) {
                members.push(
                    <>
                        {renderName(item)}
                        <span class="tsd-signature-symbol">: </span>
                        {renderType(context, item.getSignature.type, TypeContext.none)}
                    </>
                );
                continue;
            }

            if (item.getSignature) {
                members.push(
                    <>
                        <span class="tsd-signature-keyword">get </span>
                        {renderName(item.getSignature)}
                        <span class="tsd-signature-symbol">(): </span>
                        {renderType(context, item.getSignature.type, TypeContext.none)}
                    </>
                );
                continue;
            }

            if (item.setSignature) {
                members.push(
                    <>
                        <span class="tsd-signature-keyword">set </span>
                        {renderName(item.setSignature)}
                        <span class="tsd-signature-symbol">(</span>
                        {item.setSignature.parameters?.map((i) => (
                            <>
                                {i.name}
                                <span class="tsd-signature-symbol">: </span>
                                {renderType(context, i.type, TypeContext.none)}
                            </>
                        ))}
                        <span class="tsd-signature-symbol">)</span>
                    </>
                );
                continue;
            }

            if (item.signatures) {
                for (const sig of item.signatures) {
                    members.push(
                        <>
                            {renderName(sig)}
                            {item.flags.isOptional && <span class="tsd-signature-symbol">?</span>}
                            {context.memberSignatureTitle(sig, {
                                hideName: true,
                                arrowStyle: false,
                                hideParamTypes: false
                            })}
                        </>
                    );
                }
                continue;
            }

            members.push(
                <>
                    {renderName(item)}
                    <span class="tsd-signature-symbol">{item.flags.isOptional ? '?: ' : ': '}</span>
                    {renderType(context, item.type, TypeContext.none)}
                </>
            );
        }

        if (type.declaration.indexSignatures) {
            for (const index of type.declaration.indexSignatures) {
                members.push(
                    <>
                        [<span class={getKindClass(index)}>{index.parameters?.[0].name}</span>:{' '}
                        {renderType(context, index.parameters?.[0].type, TypeContext.none)}]
                        <span class="tsd-signature-symbol">: </span>
                        {renderType(context, index.type, TypeContext.none)}
                    </>
                );
            }
        }

        if (!members.length && type.declaration.signatures?.length === 1) {
            indentationDepth--;

            return (
                <>
                    <span class="tsd-signature-symbol">(</span>
                    {context.memberSignatureTitle(type.declaration.signatures[0], {
                        hideName: true,
                        arrowStyle: true,
                        hideParamTypes: false
                    })}
                    <span class="tsd-signature-symbol">)</span>
                </>
            );
        }

        for (const item of type.declaration.signatures || []) {
            members.push(context.memberSignatureTitle(item, { hideName: true, hideParamTypes: false }));
        }

        if (members.length) {
            const membersWithSeparators = members.flatMap((m) => [
                includeIndentation(),
                m,
                <span class="tsd-signature-symbol">; </span>,
                <br></br>
            ]);
            membersWithSeparators.pop();

            indentationDepth--;
            return (
                <>
                    <span class="tsd-signature-symbol">{'{'} </span>
                    <br></br>
                    {membersWithSeparators}
                    <br></br>
                    {includeIndentation()}
                    <span class="tsd-signature-symbol">{'}'}</span>
                </>
            );
        }

        indentationDepth--;
        return <span class="tsd-signature-symbol">{'{}'}</span>;
    },
    rest: (context, type) => (
        <>
            <span class="tsd-signature-symbol">...</span>
            {renderType(context, type.elementType, TypeContext.restElement)}
        </>
    ),
    templateLiteral: (context, type) => (
        <>
            <span class="tsd-signature-symbol">`</span>
            {type.head && <span class="tsd-signature-type">{type.head}</span>}
            {type.tail.map((item) => (
                <>
                    <span class="tsd-signature-symbol">{'${'}</span>
                    {renderType(context, item[0], TypeContext.templateLiteralElement)}
                    <span class="tsd-signature-symbol">{'}'}</span>
                    {item[1] && <span class="tsd-signature-type">{item[1]}</span>}
                </>
            ))}
            <span class="tsd-signature-symbol">`</span>
        </>
    ),
    tuple: (context, type) => (
        <>
            <span class="tsd-signature-symbol">[</span>
            {join(<span class="tsd-signature-symbol">, </span>, type.elements, (item) =>
                renderType(context, item, TypeContext.tupleElement)
            )}
            <span class="tsd-signature-symbol">]</span>
        </>
    ),
    typeOperator: (context, type) => (
        <>
            <span class="tsd-signature-keyword">{type.operator} </span>
            {renderType(context, type.target, TypeContext.typeOperatorTarget)}
        </>
    ),
    union: (context, type) => {
        // This could likely be improved with some print width based heuristic like
        // how prettier works, but my initial investigation with it didn't consistently
        // produce better results than this much simpler method as the print width
        // method doesn't track how far into the current line we are, and I don't want
        // to spend the time right now to properly track that here. PR welcome if someone
        // wants to take the time to make that a real capability.
        // https://gist.github.com/Gerrit0/5cebc127fd4b181e49e354b786d181d7
        if (type.types.length > 3) {
            ++indentationDepth;
            const membersWithSeparators = type.types.flatMap((item) => [
                includeIndentation(),
                <span class="tsd-signature-symbol">| </span>,
                renderType(context, item, TypeContext.unionElement),
                <br></br>
            ]);
            membersWithSeparators.pop();
            --indentationDepth;

            return (
                <>
                    <br />
                    {membersWithSeparators}
                </>
            );
        }
        return join(<span class="tsd-signature-symbol"> | </span>, type.types, (item) =>
            renderType(context, item, TypeContext.unionElement)
        );
    },
    unknown: (_context, type) => <>{type.name}</>
};

const renderType = (
    context: DefaultThemeRenderContext,
    type: Type | undefined,
    where: TypeContext,
    options: { topLevelLinks: boolean } = { topLevelLinks: false }
): JSX.Element => {
    if (!type) {
        return <span class="tsd-signature-type">any</span>;
    }

    const renderFn = typeRenderers[type.type];
    const rendered = renderFn(context, type as never, options);

    if (type.needsParenthesis(where)) {
        return (
            <>
                <span class="tsd-signature-symbol">(</span>
                {rendered}
                <span class="tsd-signature-symbol">)</span>
            </>
        );
    }

    return rendered;
};

export const type = (
    context: DefaultThemeRenderContext,
    requiredType: Type | undefined,
    options: { topLevelLinks: boolean } = { topLevelLinks: false }
): JSX.Element => renderType(context, requiredType, TypeContext.none, options);

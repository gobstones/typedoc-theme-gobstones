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
 * @module Utils/lib
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */

import {
    DeclarationReflection,
    DefaultThemeRenderContext,
    JSX,
    ProjectReflection,
    ReferenceReflection,
    Reflection,
    ReflectionKind,
    SignatureReflection,
    TypeParameterReflection
} from 'typedoc';

/**
 * Turn any element into it's string form.
 */
export const stringify = (data: unknown): string => {
    if (typeof data === 'bigint') {
        return data.toString() + 'n';
    }
    return JSON.stringify(data);
};

/**
 * Get the full package name.
 *
 * @param refl
 * @returns
 */
export const getDisplayName = (refl: Reflection): string => {
    let version = '';
    if ((refl instanceof DeclarationReflection || refl instanceof ProjectReflection) && refl.packageVersion) {
        version = ` - v${refl.packageVersion}`;
    }

    return `${refl.name}${version}`;
};

export const toStyleClass = (str: string): string =>
    str.replace(/(\w)([A-Z])/g, (_m, m1: string, m2: string) => m1 + '-' + m2).toLowerCase();

export const getKindClass = (refl: Reflection): string => {
    if (refl instanceof ReferenceReflection) {
        return getKindClass(refl.getTargetReflectionDeep());
    }
    return ReflectionKind.classString(refl.kind);
};

/**
 * Insert word break tags ``<wbr>`` into the given string.
 *
 * Breaks the given string at ``_``, ``-`` and capital letters.
 *
 * @param str The string that should be split.
 * @return The original string containing ``<wbr>`` tags where possible.
 */
export const wbr = (str: string): (string | JSX.Element)[] => {
    // TODO surely there is a better way to do this, but I'm tired.
    const ret: (string | JSX.Element)[] = [];
    const re = /[\s\S]*?(?:[^_-][_-](?=[^_-])|[^A-Z](?=[A-Z][^A-Z]))/g;
    let match: RegExpExecArray | null;
    let i = 0;
    while ((match = re.exec(str))) {
        ret.push(match[0], <wbr />);
        i += match[0].length;
    }
    ret.push(str.slice(i));

    return ret;
};

export const join = <T,>(joiner: JSX.Children, list: readonly T[], cb: (x: T) => JSX.Children): JSX.Element => {
    const result: JSX.Children = [];

    for (const item of list) {
        if (result.length > 0) {
            result.push(joiner);
        }
        result.push(cb(item));
    }

    return <>{result}</>;
};

export const classNames = (
    names: Record<string, boolean | null | undefined>,
    extraCss?: string
): string | undefined => {
    const css = Object.keys(names)
        .filter((key) => names[key])
        .concat(extraCss || '')
        .join(' ')
        .trim()
        .replace(/\s+/g, ' ');
    return css.length ? css : undefined;
};

export const hasTypeParameters = (
    reflection: Reflection
): reflection is Reflection & { typeParameters: TypeParameterReflection[] } =>
    (reflection instanceof DeclarationReflection || reflection instanceof SignatureReflection) &&
    reflection.typeParameters !== undefined &&
    // eslint-disable-next-line no-null/no-null
    reflection.typeParameters !== null &&
    reflection.typeParameters.length > 0;

export const renderTypeParametersSignature = (
    context: DefaultThemeRenderContext,
    typeParameters: readonly TypeParameterReflection[] | undefined
): JSX.Element => {
    if (!typeParameters || typeParameters.length === 0) return <></>;
    const hideParamTypes = context.options.getValue('hideParameterTypesInTitle');

    if (hideParamTypes) {
        return (
            <>
                <span class="tsd-signature-symbol">{'<'}</span>
                {join(<span class="tsd-signature-symbol">{', '}</span>, typeParameters, (item) => (
                    <>
                        {item.flags.isConst && <span class="tsd-signature-keyword">const </span>}
                        {item.varianceModifier ? `${item.varianceModifier} ` : ''}
                        <a class="tsd-signature-type tsd-kind-type-parameter" href={context.urlTo(item)}>
                            {item.name}
                        </a>
                    </>
                ))}
                <span class="tsd-signature-symbol">{'>'}</span>
            </>
        );
    }

    return (
        <>
            <span class="tsd-signature-symbol">{'<'}</span>
            {join(<span class="tsd-signature-symbol">{', '}</span>, typeParameters, (item) => (
                <>
                    {item.flags.isConst && 'const '}
                    {item.varianceModifier ? `${item.varianceModifier} ` : ''}
                    <span class="tsd-signature-type tsd-kind-type-parameter">{item.name}</span>
                    {!!item.type && (
                        <>
                            <span class="tsd-signature-keyword"> extends </span>
                            {context.type(item.type)}
                        </>
                    )}
                </>
            ))}
            <span class="tsd-signature-symbol">{'>'}</span>
        </>
    );
};

/**
 * Renders the reflection name with an additional `?` if optional.
 */
export const renderName = (refl: Reflection): JSX.Element | (string | JSX.Element)[] => {
    if (refl.flags.isOptional) {
        return <>{wbr(refl.name)}?</>;
    }

    return wbr(refl.name);
};

export const getHierarchyRoots = (project: ProjectReflection): DeclarationReflection[] => {
    const allClasses = project.getReflectionsByKind(ReflectionKind.ClassOrInterface) as DeclarationReflection[];

    const roots = allClasses.filter((refl) => {
        // If nobody extends this class, there's no possible hierarchy to display.
        if (!refl.implementedBy && !refl.extendedBy) {
            return false;
        }

        // If we don't extend anything, then we are a root
        if (!refl.implementedTypes && !refl.extendedTypes) {
            return true;
        }

        // We might still be a root, if our extended/implemented types are not included
        // in the documentation.
        const types = [...(refl.implementedTypes || []), ...(refl.extendedTypes || [])];

        return types.every(
            (type) =>
                !type.visit({
                    reference: (ref) => ref.reflection !== undefined
                })
        );
    });

    return roots.sort((a, b) => a.name.localeCompare(b.name));
};

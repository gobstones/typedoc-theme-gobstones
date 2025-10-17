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
 * @module Theme/Utils
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */

import {
    CommentDisplayPart,
    ContainerReflection,
    DeclarationReflection,
    DocumentReflection,
    JSX,
    ProjectReflection,
    ReferenceReflection,
    Reflection,
    ReflectionKind,
    SignatureReflection,
    TypeParameterReflection
} from 'typedoc';

/**
 * A helper function that both filters and transforms elements in an array.
 */
export const filterMap = <T, U>(iter: Iterable<T> | undefined, fn: (item: T) => U | undefined): U[] => {
    const result: U[] = [];

    for (const item of iter || []) {
        const newItem = fn(item);
        if (newItem !== undefined) {
            result.push(newItem);
        }
    }

    return result;
};

/**
 * Get the full package name.
 */
export const getDisplayName = (refl: Reflection): string => {
    let version = '';
    if ((refl instanceof DeclarationReflection || refl instanceof ProjectReflection) && refl.packageVersion) {
        version = ` - v${refl.packageVersion}`;
    }

    return `${refl.name}${version}`;
};

/**
 * Get the kind of a reflection.
 */
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

/**
 * Join all the elements.
 */
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

/**
 * Return the class names for css of the given names.
 */
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

/**
 * Answer if the given reflection has type parameters.
 */
export const hasTypeParameters = (
    reflection: Reflection
): reflection is Reflection & { typeParameters: TypeParameterReflection[] } =>
    (reflection instanceof DeclarationReflection || reflection instanceof SignatureReflection) &&
    reflection.typeParameters !== undefined &&
    // eslint-disable-next-line no-null/no-null
    reflection.typeParameters !== null &&
    reflection.typeParameters.length > 0;

export class DefaultMap<K, V> extends Map<K, V> {
    public constructor(private creator: (key: K) => V) {
        super();
    }

    public override get(key: K): V {
        const saved = super.get(key);
        // eslint-disable-next-line no-null/no-null
        if (saved != null) {
            return saved;
        }

        const created = this.creator(key);
        this.set(key, created);
        return created;
    }

    public getNoInsert(key: K): V | undefined {
        return super.get(key);
    }
}

const nameCollisionCache = new WeakMap<ProjectReflection, DefaultMap<string, number>>();
const getNameCollisionCount = (project: ProjectReflection, name: string): number => {
    let collisions = nameCollisionCache.get(project);
    if (collisions === undefined) {
        collisions = new DefaultMap(() => 0);
        for (const reflection of project.getReflectionsByKind(ReflectionKind.SomeExport)) {
            collisions.set(reflection.name, collisions.get(reflection.name) + 1);
        }
        nameCollisionCache.set(project, collisions);
    }
    return collisions.get(name);
};

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
 * Returns a (hopefully) globally unique path for the given reflection.
 *
 * This only works for exportable symbols, so e.g. methods are not affected by this.
 *
 * If the given reflection has a globally unique name already, then it will be returned as is. If the name is
 * ambiguous (i.e. there are two classes with the same name in different namespaces), then the namespaces path of the
 * reflection will be returned.
 */
export const getUniquePath = (reflection: Reflection): Reflection[] => {
    if (reflection.kindOf(ReflectionKind.SomeExport)) {
        if (getNameCollisionCount(reflection.project, reflection.name) >= 2) {
            return getNamespacedPath(reflection);
        }
    }
    return [reflection];
};

export interface MemberSection {
    title: string;
    description?: CommentDisplayPart[];
    children: (DocumentReflection | DeclarationReflection)[];
}

/**
 * Get the members of a container reflection.
 */
export const getMemberSections = (
    parent: ContainerReflection,
    childFilter: (refl: Reflection) => boolean = () => true
): MemberSection[] => {
    if (parent.categories?.length) {
        return filterMap(parent.categories, (cat) => {
            const children = cat.children.filter(childFilter);
            if (!children.length) return;
            return {
                title: cat.title,
                description: cat.description,
                children
            };
        });
    }

    if (parent.groups?.length) {
        return parent.groups.flatMap((group) => {
            if (group.categories?.length) {
                return filterMap(group.categories, (cat) => {
                    const children = cat.children.filter(childFilter);
                    if (!children.length) return;
                    return {
                        title: `${group.title} - ${cat.title}`,
                        description: cat.description,
                        children
                    };
                });
            }

            const children = group.children.filter(childFilter);
            if (!children.length) return [];
            return {
                title: group.title,
                description: group.description,
                children
            };
        });
    }

    return [];
};

export const isNoneSection = (section: MemberSection): boolean => section.title.toLocaleLowerCase() === 'none';

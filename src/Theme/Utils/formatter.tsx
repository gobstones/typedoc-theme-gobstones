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

import { ok } from 'assert';

import {
    DeclarationReflection,
    JSX,
    LiteralType,
    ParameterReflection,
    ReferenceType,
    Reflection,
    ReflectionKind,
    Router,
    SignatureReflection,
    SomeType,
    TypeContext,
    TypeParameterReflection,
    TypeVisitor
} from 'typedoc';

import { getKindClass, getUniquePath } from './lib';

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
 * A helper function for aggregation in arrays.
 */
export const aggregate = <T,>(arr: T[], fn: (item: T) => number): number => arr.reduce((sum, it) => sum + fn(it), 0);

/**
 * Utility to help type checking ensure that there is no uncovered case.
 */
export const assertNever = (x: never): never => {
    throw new Error(`Expected handling to cover all possible cases, but it didn't cover: ${JSON.stringify(x)}`);
};

// Non breaking space
const INDENT = '\u00A0\u00A0\u00A0\u00A0';

export type FormatterNode =
    | { type: 'text'; content: string }
    | { type: 'element'; content: JSX.Element; length: number }
    | { type: 'line' }
    | { type: 'space_or_line' }
    | { type: 'indent'; content: FormatterNode[] }
    | { type: 'group'; id: number; content: FormatterNode[] }
    | { type: 'nodes'; content: FormatterNode[] }
    | {
          type: 'if_wrap';
          id: number;
          true: FormatterNode;
          false: FormatterNode;
      };

const textNode = (content: string): FormatterNode => ({ type: 'text', content });
const emptyNode = textNode('');
const space = (): FormatterNode => textNode(' ');

const simpleElement = (element: JSX.Element): FormatterNode => {
    ok(element.children.length === 1);
    ok(typeof element.children[0] === 'string');
    return {
        type: 'element',
        content: element,
        length: element.children[0].length
    };
};
const line = (): FormatterNode => ({ type: 'line' });
const spaceOrLine = (): FormatterNode => ({ type: 'space_or_line' });
const indent = (content: FormatterNode[]): FormatterNode => ({ type: 'indent', content });
const group = (id: number, content: FormatterNode[]): FormatterNode => ({ type: 'group', id, content });
const nodes = (...content: FormatterNode[]): FormatterNode => ({ type: 'nodes', content });
const ifWrap = (id: number, trueBranch: FormatterNode, falseBranch: FormatterNode = emptyNode): FormatterNode => ({
    type: 'if_wrap',
    id,
    true: trueBranch,
    false: falseBranch
});
const join = <T,>(joiner: FormatterNode, list: readonly T[], cb: (x: T) => FormatterNode): FormatterNode => {
    const content: FormatterNode[] = [];

    for (const item of list) {
        if (content.length > 0) {
            content.push(joiner);
        }
        content.push(cb(item));
    }

    return { type: 'nodes', content };
};

const nodeWidth = (node: FormatterNode, wrapped: Set<number>): number => {
    switch (node.type) {
        case 'text':
            return node.content.length;
        case 'element':
            return node.length;
        case 'line':
            return 0;
        case 'space_or_line':
            return 1;
        case 'indent':
        case 'group':
        case 'nodes':
            return aggregate(node.content, (n) => nodeWidth(n, wrapped));
        case 'if_wrap':
            return wrapped.has(node.id) ? nodeWidth(node.true, wrapped) : nodeWidth(node.false, wrapped);
        default:
            return -1;
    }
};

export enum Wrap {
    Detect = 0,
    Enable = 1
}

/**
 * Responsible for rendering nodes
 */
export class FormattedCodeGenerator {
    private buffer: (JSX.Element | string)[] = [];
    // Indentation level, not number of chars
    private indent = 0;
    // The number of characters on the current line
    private size: number;
    // Maximum number of characters allowed per line
    private max: number;
    // Groups which need to be wrapped
    private wrapped = new Set<number>();

    public constructor(maxWidth: number = 80, startWidth = 0) {
        this.max = maxWidth;
        this.size = startWidth;
    }

    public forceWrap(wrapped: Set<number>): void {
        for (const id of wrapped) {
            this.wrapped.add(id);
        }
    }

    public toElement(): JSX.Element {
        return <>{this.buffer}</>;
    }

    public node(node: FormatterNode, wrap: Wrap): void {
        switch (node.type) {
            case 'nodes': {
                for (const n of node.content) {
                    this.node(n, wrap);
                }
                break;
            }
            case 'group': {
                const width = aggregate(node.content, (n) => nodeWidth(n, this.wrapped));
                let wrapped: Wrap;
                if (this.size + width > this.max || this.wrapped.has(node.id)) {
                    this.wrapped.add(node.id);
                    wrapped = Wrap.Enable;
                } else {
                    wrapped = Wrap.Detect;
                }
                for (const n of node.content) {
                    this.node(n, wrapped);
                }
                break;
            }
            case 'if_wrap': {
                if (this.wrapped.has(node.id)) {
                    this.node(node.true, Wrap.Enable);
                } else {
                    this.node(node.false, wrap);
                }
                break;
            }
            case 'text': {
                this.text(node.content, node.content.length);
                break;
            }
            case 'element': {
                this.text(node.content, node.length);
                break;
            }
            case 'line': {
                if (wrap === Wrap.Enable) {
                    this.newLine();
                }
                break;
            }
            case 'space_or_line': {
                if (wrap === Wrap.Enable) {
                    this.newLine();
                } else {
                    this.text(' ', 1);
                }
                break;
            }
            case 'indent': {
                if (wrap === Wrap.Enable) {
                    this.size += INDENT.length;
                    this.indent += 1;
                    this.buffer.push(INDENT);
                    for (const n of node.content) {
                        this.node(n, wrap);
                    }
                    this.indent -= 1;
                } else {
                    for (const n of node.content) {
                        this.node(n, wrap);
                    }
                }
                break;
            }
            default:
                assertNever(node);
        }
    }

    private text(value: string | JSX.Element, chars: number): void {
        this.size += chars;
        this.buffer.push(value);
    }

    private newLine(): void {
        this.size = INDENT.length + this.indent;
        const last = this.buffer[this.buffer.length - 1];
        if (typeof last === 'string') {
            this.buffer[this.buffer.length - 1] = last.trimEnd();
        }
        this.buffer.push(<br />);
        this.buffer.push(INDENT.repeat(this.indent));
    }
}

const typeBuilder: TypeVisitor<FormatterNode, [FormattedCodeBuilder, { topLevelLinks: boolean }]> = {
    array: (type, builder) =>
        nodes(
            builder.type(type.elementType, TypeContext.arrayElement),
            simpleElement(<span class="tsd-signature-symbol">[]</span>)
        ),
    conditional: (type, builder) => {
        const id = builder.newId();
        return group(id, [
            builder.type(type.checkType, TypeContext.conditionalCheck),
            space(),
            simpleElement(<span class="tsd-signature-keyword">extends</span>),
            space(),
            builder.type(type.extendsType, TypeContext.conditionalExtends),
            spaceOrLine(),
            indent([
                simpleElement(<span class="tsd-signature-symbol">?</span>),
                space(),
                builder.type(type.trueType, TypeContext.conditionalTrue),
                spaceOrLine(),
                simpleElement(<span class="tsd-signature-symbol">:</span>),
                space(),
                builder.type(type.falseType, TypeContext.conditionalFalse)
            ])
        ]);
    },
    indexedAccess: (type, builder) => {
        let indexType = builder.type(type.indexType, TypeContext.indexedIndex);

        if (
            type.objectType instanceof ReferenceType &&
            type.objectType.reflection &&
            type.indexType instanceof LiteralType &&
            typeof type.indexType.value === 'string'
        ) {
            const childReflection = type.objectType.reflection.getChildByName([type.indexType.value]);
            if (childReflection) {
                const displayed = stringify(type.indexType.value);
                indexType = {
                    type: 'element',
                    content: (
                        <a href={builder.urlTo(childReflection)}>
                            <span class="tsd-signature-type">{displayed}</span>
                        </a>
                    ),
                    length: displayed.length
                };
            }
        }

        return nodes(
            builder.type(type.objectType, TypeContext.indexedObject),
            simpleElement(<span class="tsd-signature-symbol">[</span>),
            indexType,
            simpleElement(<span class="tsd-signature-symbol">]</span>)
        );
    },
    inferred: (type, builder) => {
        const simple = nodes(
            simpleElement(<span class="tsd-signature-keyword">infer</span>),
            space(),
            simpleElement(<span class="tsd-kind-type-parameter">{type.name}</span>)
        );

        if (type.constraint) {
            const id = builder.newId();
            return group(id, [
                simple,
                space(),
                simpleElement(<span class="tsd-signature-keyword">extends</span>),
                spaceOrLine(),
                indent([builder.type(type.constraint, TypeContext.inferredConstraint)])
            ]);
        }

        return simple;
    },
    intersection: (type, builder) =>
        // Prettier doesn't do smart wrapping here like we do with unions
        // so... TypeDoc won't either, at least for now.
        join(nodes(space(), simpleElement(<span class="tsd-signature-symbol">&amp;</span>), space()), type.types, (t) =>
            builder.type(t, TypeContext.intersectionElement)
        ),
    intrinsic: (type) => simpleElement(<span class="tsd-signature-type">{type.name}</span>),
    literal: (type) => simpleElement(<span class="tsd-signature-type">{stringify(type.value)}</span>),
    mapped: (type, builder) => {
        const parts: FormatterNode[] = [];

        switch (type.readonlyModifier) {
            case '+':
                parts.push(simpleElement(<span class="tsd-signature-keyword">readonly</span>), space());
                break;
            case '-':
                parts.push(
                    simpleElement(<span class="tsd-signature-symbol">-</span>),
                    simpleElement(<span class="tsd-signature-keyword">readonly</span>),
                    space()
                );
                break;
            default:
                break;
        }

        parts.push(
            simpleElement(<span class="tsd-signature-symbol">[</span>),
            simpleElement(<span class="tsd-kind-type-parameter">{type.parameter}</span>),
            space(),
            simpleElement(<span class="tsd-signature-keyword">in</span>),
            space(),
            builder.type(type.parameterType, TypeContext.mappedParameter)
        );

        if (type.nameType) {
            parts.push(
                space(),
                simpleElement(<span class="tsd-signature-keyword">as</span>),
                space(),
                builder.type(type.nameType, TypeContext.mappedName)
            );
        }

        parts.push(simpleElement(<span class="tsd-signature-symbol">]</span>));

        switch (type.optionalModifier) {
            case '+':
                parts.push(simpleElement(<span class="tsd-signature-symbol">?:</span>));
                break;
            case '-':
                parts.push(simpleElement(<span class="tsd-signature-symbol">-?:</span>));
                break;
            default:
                parts.push(simpleElement(<span class="tsd-signature-symbol">:</span>));
        }

        parts.push(space(), builder.type(type.templateType, TypeContext.mappedTemplate));

        return group(builder.newId(), [
            simpleElement(<span class="tsd-signature-symbol">{'{'}</span>),
            spaceOrLine(),
            indent(parts),
            spaceOrLine(),
            simpleElement(<span class="tsd-signature-symbol">{'}'}</span>)
        ]);
    },
    namedTupleMember: (type, builder) =>
        nodes(
            textNode(type.name),
            type.isOptional
                ? simpleElement(<span class="tsd-signature-symbol">?:</span>)
                : simpleElement(<span class="tsd-signature-symbol">:</span>),
            space(),
            builder.type(type.element, TypeContext.none)
        ),
    optional: (type, builder) =>
        nodes(
            builder.type(type.elementType, TypeContext.optionalElement),
            simpleElement(<span class="tsd-signature-symbol">?</span>)
        ),
    predicate: (type, builder) => {
        const content: FormatterNode[] = [];
        if (type.asserts) {
            content.push(simpleElement(<span class="tsd-signature-keyword">asserts</span>), space());
        }

        content.push(simpleElement(<span class="tsd-kind-parameter">{type.name}</span>));

        if (type.targetType) {
            content.push(
                space(),
                simpleElement(<span class="tsd-signature-keyword">is</span>),
                space(),
                builder.type(type.targetType, TypeContext.predicateTarget)
            );
        }

        return nodes(...content);
    },
    query: (type, builder) =>
        nodes(
            simpleElement(<span class="tsd-signature-keyword">typeof</span>),
            space(),
            builder.type(type.queryType, TypeContext.queryTypeTarget)
        ),
    reference: (type, builder) => {
        const reflection = type.reflection;
        let name: FormatterNode;

        if (reflection) {
            if (reflection.kindOf(ReflectionKind.TypeParameter)) {
                name = simpleElement(
                    <a class="tsd-signature-type tsd-kind-type-parameter" href={builder.urlTo(reflection)}>
                        {reflection.name}
                    </a>
                );
            } else {
                name = join(
                    simpleElement(<span class="tsd-signature-symbol">.</span>),
                    getUniquePath(reflection),
                    (item) =>
                        simpleElement(
                            <a href={builder.urlTo(item)} class={'tsd-signature-type ' + getKindClass(item)}>
                                {item.name}
                            </a>
                        )
                );
            }
        } else if (type.externalUrl) {
            name = simpleElement(
                <a href={type.externalUrl} class="tsd-signature-type external" target="_blank">
                    {type.name}
                </a>
            );
        } else if (type.refersToTypeParameter) {
            name = simpleElement(<span class="tsd-signature-type tsd-kind-type-parameter">{type.name}</span>);
        } else {
            name = simpleElement(<span class="tsd-signature-type">{type.name}</span>);
        }

        if (type.typeArguments?.length) {
            const id = builder.newId();
            return group(id, [
                name,
                simpleElement(<span class="tsd-signature-symbol">{'<'}</span>),
                line(),
                indent([
                    join(
                        nodes(simpleElement(<span class="tsd-signature-symbol">,</span>), spaceOrLine()),
                        type.typeArguments,
                        (item) => builder.type(item, TypeContext.referenceTypeArgument)
                    ),
                    ifWrap(id, simpleElement(<span class="tsd-signature-symbol">,</span>))
                ]),
                line(),
                simpleElement(<span class="tsd-signature-symbol">{'>'}</span>)
            ]);
        }

        return name;
    },
    reflection: (type, builder, options) => builder.reflection(type.declaration, options),
    rest: (type, builder) =>
        nodes(
            simpleElement(<span class="tsd-signature-symbol">...</span>),
            builder.type(type.elementType, TypeContext.restElement)
        ),
    templateLiteral: (type, builder) => {
        const content: FormatterNode[] = [];
        content.push(simpleElement(<span class="tsd-signature-symbol">`</span>));

        if (type.head) {
            content.push(simpleElement(<span class="tsd-signature-type">{type.head}</span>));
        }

        for (const item of type.tail) {
            content.push(
                simpleElement(<span class="tsd-signature-symbol">{'${'}</span>),
                builder.type(item[0], TypeContext.templateLiteralElement),
                simpleElement(<span class="tsd-signature-symbol">{'}'}</span>)
            );
            if (item[1]) {
                content.push(simpleElement(<span class="tsd-signature-type">{item[1]}</span>));
            }
        }

        content.push(simpleElement(<span class="tsd-signature-symbol">`</span>));

        return nodes(...content);
    },
    tuple: (type, builder) => {
        const id = builder.newId();

        return group(id, [
            simpleElement(<span class="tsd-signature-symbol">[</span>),
            line(),
            indent([
                join(
                    nodes(simpleElement(<span class="tsd-signature-symbol">,</span>), spaceOrLine()),
                    type.elements,
                    (item) => builder.type(item, TypeContext.tupleElement)
                )
            ]),
            ifWrap(id, simpleElement(<span class="tsd-signature-symbol">,</span>)),
            line(),
            simpleElement(<span class="tsd-signature-symbol">]</span>)
        ]);
    },
    typeOperator: (type, builder) =>
        nodes(
            simpleElement(<span class="tsd-signature-keyword">{type.operator}</span>),
            space(),
            builder.type(type.target, TypeContext.typeOperatorTarget)
        ),
    union: (type, builder) => {
        const parentId = builder.id;
        const id = builder.newId();
        const pipe = simpleElement(<span class="tsd-signature-symbol">|</span>);

        const elements = type.types.flatMap((t, i) => [
            i === 0 ? ifWrap(id, nodes(pipe, space())) : space(),
            builder.type(t, TypeContext.unionElement),
            spaceOrLine(),
            pipe
        ]);
        elements.pop(); // Remove last pipe
        elements.pop(); // Remove last spaceOrLine

        return group(id, [ifWrap(parentId, emptyNode, line()), ifWrap(parentId, nodes(...elements), indent(elements))]);
    },
    unknown: (type) => textNode(type.name)
};

/**
 * Responsible for generating Nodes from a type tree.
 */
export class FormattedCodeBuilder {
    public forceWrap = new Set<number>();
    public id = 0;

    public constructor(
        private readonly router: Router,
        private readonly relativeReflection: Reflection
    ) {}

    public urlTo(refl: Reflection): string {
        return this.router.relativeUrl(this.relativeReflection, refl);
    }

    public newId(): number {
        return ++this.id;
    }

    public type(
        type: SomeType | undefined,
        where: TypeContext,
        options: { topLevelLinks: boolean } = { topLevelLinks: false }
    ): FormatterNode {
        if (!type) {
            return simpleElement(<span class="tsd-signature-type">any</span>);
        }

        if (type.needsParenthesis(where)) {
            const id = this.newId();
            return group(id, [
                textNode('('),
                line(),
                indent([type.visit(typeBuilder, this, options)]),
                line(),
                textNode(')')
            ]);
        }
        return type.visit(typeBuilder, this, options);
    }

    public reflection(reflection: DeclarationReflection, options: { topLevelLinks: boolean }): FormatterNode {
        const members: FormatterNode[] = [];
        const children = reflection.getProperties();

        for (const item of children) {
            this.member(members, item, options);
        }

        if (reflection.indexSignatures) {
            for (const index of reflection.indexSignatures) {
                members.push(
                    nodes(
                        ...(index.flags.isReadonly
                            ? [simpleElement(<span class="tsd-signature-keyword">readonly</span>), space()]
                            : []),
                        simpleElement(<span class="tsd-signature-symbol">[</span>),
                        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                        simpleElement(<span class={getKindClass(index)}>{index.parameters![0].name}</span>),
                        simpleElement(<span class="tsd-signature-symbol">:</span>),
                        space(),
                        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                        this.type(index.parameters![0].type, TypeContext.none),
                        simpleElement(<span class="tsd-signature-symbol">]:</span>),
                        space(),
                        this.type(index.type, TypeContext.none)
                    )
                );
            }
        }

        if (!members.length && reflection.signatures?.length === 1) {
            return this.signature(reflection.signatures[0], {
                hideName: true,
                arrowStyle: true
            });
        }

        for (const item of reflection.signatures || []) {
            members.push(this.signature(item, { hideName: true }));
        }

        if (members.length) {
            const id = this.newId();
            if (options.topLevelLinks) {
                this.forceWrap.add(id);
            }
            return group(id, [
                simpleElement(<span class="tsd-signature-symbol">{'{'}</span>),
                spaceOrLine(),
                indent([
                    join(
                        nodes(simpleElement(<span class="tsd-signature-symbol">;</span>), spaceOrLine()),
                        members,
                        (node) => node
                    )
                ]),
                ifWrap(id, simpleElement(<span class="tsd-signature-symbol">;</span>)),
                spaceOrLine(),
                simpleElement(<span class="tsd-signature-symbol">{'}'}</span>)
            ]);
        }

        return simpleElement(<span class="tsd-signature-symbol">{'{}'}</span>);
    }

    public typeAlias(item: DeclarationReflection): FormatterNode {
        return nodes(
            simpleElement(<span class="tsd-signature-keyword">type</span>),
            space(),
            simpleElement(<span class={getKindClass(item)}>{item.name}</span>),
            this.typeParameters(item),
            space(),
            simpleElement(<span class="tsd-signature-symbol">{'='}</span>),
            space(),
            this.reflection(item, { topLevelLinks: true })
        );
    }

    public interface(item: DeclarationReflection): FormatterNode {
        return nodes(
            simpleElement(<span class="tsd-signature-keyword">interface</span>),
            space(),
            simpleElement(<span class={getKindClass(item)}>{item.name}</span>),
            this.typeParameters(item),
            space(),
            this.reflection(item, { topLevelLinks: true })
        );
    }

    public member(members: FormatterNode[], item: DeclarationReflection, options: { topLevelLinks: boolean }): void {
        if (item.getSignature && item.setSignature) {
            members.push(this.signature(item.getSignature, options), this.signature(item.setSignature, options));
            return;
        }

        if (item.getSignature) {
            members.push(this.signature(item.getSignature, options));
            return;
        }

        if (item.setSignature) {
            members.push(this.signature(item.setSignature, options));
            return;
        }

        if (item.signatures) {
            members.push(...item.signatures.map((sig) => this.signature(sig, options)));
            return;
        }

        members.push(
            nodes(
                this.propertyName(item, options),
                simpleElement(<span class="tsd-signature-symbol">{item.flags.isOptional ? '?:' : ':'}</span>),
                space(),
                this.type(item.type, TypeContext.none)
            )
        );
    }

    public signature(
        sig: SignatureReflection,
        options: {
            topLevelLinks?: boolean;
            hideName?: boolean;
            arrowStyle?: boolean;
        }
    ): FormatterNode {
        let name: FormatterNode = options.hideName ? emptyNode : this.propertyName(sig, options);
        switch (sig.kind) {
            case ReflectionKind.ConstructorSignature: {
                let label = emptyNode;
                if (sig.flags.isAbstract) {
                    label = nodes(simpleElement(<span class="tsd-signature-keyword">abstract</span>), space());
                }
                label = nodes(label, simpleElement(<span class="tsd-signature-keyword">new</span>), space());
                name = nodes(label, name);
                break;
            }
            case ReflectionKind.GetSignature: {
                name = nodes(simpleElement(<span class="tsd-signature-keyword">get</span>), space(), name);
                break;
            }
            case ReflectionKind.SetSignature: {
                name = nodes(simpleElement(<span class="tsd-signature-keyword">set</span>), space(), name);
                break;
            }
            default: {
                break;
            }
        }

        const id = this.newId();
        return group(id, [
            name,
            sig.parent.flags.isOptional ? simpleElement(<span class="tsd-signature-symbol">?</span>) : emptyNode,
            this.typeParameters(sig),
            ...this.parameters(sig, id),
            nodes(
                options.arrowStyle ? space() : emptyNode,
                simpleElement(<span class="tsd-signature-symbol">{options.arrowStyle ? '=>' : ':'}</span>),
                space(),
                this.type(sig.type, TypeContext.none)
            )
        ]);
    }

    private typeParameters(sig: SignatureReflection | DeclarationReflection): FormatterNode {
        if (!sig.typeParameters?.length) {
            return emptyNode;
        }

        const id = this.newId();
        return group(id, [
            simpleElement(<span class="tsd-signature-symbol">{'<'}</span>),
            line(),
            indent([
                join(
                    nodes(simpleElement(<span class="tsd-signature-symbol">,</span>), spaceOrLine()),
                    sig.typeParameters,
                    (item) => this.typeParameter(item)
                )
            ]),
            ifWrap(id, simpleElement(<span class="tsd-signature-symbol">,</span>)),
            line(),
            simpleElement(<span class="tsd-signature-symbol">{'>'}</span>)
        ]);
    }

    private typeParameter(param: TypeParameterReflection): FormatterNode {
        let prefix = emptyNode;
        if (param.flags.isConst) {
            prefix = nodes(simpleElement(<span class="tsd-signature-keyword">const</span>), space());
        }
        if (param.varianceModifier) {
            prefix = nodes(
                prefix,
                simpleElement(<span class="tsd-signature-keyword">{param.varianceModifier}</span>),
                space()
            );
        }

        const content = [prefix];

        if (this.router.hasUrl(param)) {
            content.push(
                simpleElement(
                    <a class="tsd-signature-type tsd-kind-type-parameter" href={this.urlTo(param)}>
                        {param.name}
                    </a>
                )
            );
        } else {
            content.push(simpleElement(<span class="tsd-signature-type tsd-kind-type-parameter">{param.name}</span>));
        }

        if (param.type) {
            content.push(
                space(),
                simpleElement(<span class="tsd-signature-keyword">extends</span>),
                spaceOrLine(),
                indent([this.type(param.type, TypeContext.none)])
            );
        }

        if (param.default) {
            content.push(
                space(),
                simpleElement(<span class="tsd-signature-symbol">=</span>),
                space(),
                this.type(param.default, TypeContext.none)
            );
        }

        return group(this.newId(), content);
    }

    private parameters(sig: SignatureReflection, id: number): FormatterNode[] {
        if (!sig.parameters?.length) {
            return [simpleElement(<span class="tsd-signature-symbol">()</span>)];
        }

        return [
            simpleElement(<span class="tsd-signature-symbol">(</span>),
            line(),
            indent([
                join(
                    nodes(simpleElement(<span class="tsd-signature-symbol">,</span>), spaceOrLine()),
                    sig.parameters,
                    (item) => this.parameter(item)
                )
            ]),
            ifWrap(id, simpleElement(<span class="tsd-signature-symbol">,</span>)),
            line(),
            simpleElement(<span class="tsd-signature-symbol">)</span>)
        ];
    }

    private parameter(param: ParameterReflection): FormatterNode {
        const content: FormatterNode[] = [];
        if (param.flags.isRest) {
            content.push(simpleElement(<span class="tsd-signature-symbol">...</span>));
        }
        content.push(simpleElement(<span class="tsd-kind-parameter">{param.name}</span>));

        if (param.flags.isOptional || param.defaultValue) {
            content.push(simpleElement(<span class="tsd-signature-symbol">?:</span>));
        } else {
            content.push(simpleElement(<span class="tsd-signature-symbol">:</span>));
        }
        // Tricky: We don't introduce a branch here via group()
        // the branch may be introduced by the union type if the parameter
        // value is a union.
        const id = this.newId();
        content.push(ifWrap(id, emptyNode, space()));
        content.push(this.type(param.type, TypeContext.none));
        return nodes(...content);
    }

    private propertyName(reflection: Reflection, options: { topLevelLinks?: boolean }): FormatterNode {
        const entityName = /^[A-Z_$][\w$]*$/i.test(reflection.name) ? reflection.name : JSON.stringify(reflection.name);

        if (options.topLevelLinks) {
            return simpleElement(
                <a class={getKindClass(reflection)} href={this.urlTo(reflection)}>
                    {entityName}
                </a>
            );
        }
        return simpleElement(<span class={getKindClass(reflection)}>{entityName}</span>);
    }
}

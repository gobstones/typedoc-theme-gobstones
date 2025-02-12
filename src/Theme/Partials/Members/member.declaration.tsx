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
import type { DeclarationReflection, DefaultThemeRenderContext } from 'typedoc';

import { FormattedCodeBuilder, FormattedCodeGenerator, FormatterNode, Wrap, hasTypeParameters } from '../../../Utils';

export const memberDeclaration = (context: DefaultThemeRenderContext, props: DeclarationReflection): JSX.Element => {
    const builder = new FormattedCodeBuilder(context.urlTo);
    const content: FormatterNode[] = [];
    builder.member(content, props, { topLevelLinks: false });
    const generator = new FormattedCodeGenerator(context.options.getValue('typePrintWidth'));
    generator.node({ type: 'nodes', content }, Wrap.Detect);

    /** Fix for #2717. If type is the same as value the default value is omitted */
    const shouldRenderDefaultValue = (): boolean => {
        if (props.type && props.type.type === 'literal') {
            const reflectionTypeString = props.type.toString();

            const defaultValue = props.defaultValue;

            if (defaultValue === undefined || reflectionTypeString === defaultValue.toString()) {
                return false;
            }
        }
        return true;
    };

    return (
        <>
            <div class="tsd-signature">
                {generator.toElement()}
                {!!props.defaultValue && shouldRenderDefaultValue() && (
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

            {props.type && context.typeDeclaration(props.type)}

            {context.commentTags(props)}

            {context.memberSources(props)}
        </>
    );
};

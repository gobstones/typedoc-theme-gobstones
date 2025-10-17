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
 * @module Plugins
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */

import { Context, Converter, ReflectionKind } from 'typedoc';

import { TypedocPlugin } from '../Wrappers/TypedocPlugin';

/**
 * A Plugin to remove re-exports references.
 *
 * This is just a copy of the code at `typedoc-plugin-remove-references`
 * that has not been updated in a while and it's still in CJS while everything has been
 * migrated to ESM. If in the future the module receives updates we can wrap
 * around it as we do with other plugins.
 */
export class RemoveReferencesPlugin extends TypedocPlugin {
    /** @inheritdoc */
    public initialize(): void {
        this.application.converter.on(Converter.EVENT_RESOLVE_BEGIN, (context: Context) => {
            for (const reflection of context.project.getReflectionsByKind(ReflectionKind.Reference)) {
                context.project.removeReflection(reflection);
            }
        });
    }
}

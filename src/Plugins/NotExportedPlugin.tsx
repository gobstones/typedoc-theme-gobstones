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

/**
 * Adapted copy of
 * typedoc-plugin-not-exported
 * TypeDoc plugin that forces inclusion of non-exported symbols (variables)
 * Originally from https://github.com/TypeStrong/typedoc/issues/1474#issuecomment-766178261
 * And: https://github.com/tomchen/typedoc-plugin-not-exported
 * CC0
 */

import {
    Application,
    Converter,
    DeclarationReflection,
    ParameterType,
    Reflection,
    ReflectionKind,
    TypeScript
} from 'typedoc'; // version 0.20.16+
import { Context } from 'typedoc/dist/lib/converter/context';
// eslint-disable-next-line import/no-extraneous-dependencies
import * as ts from 'typescript';

import { TypedocPlugin } from '../Utils/Plugins';

// eslint-disable-next-line no-bitwise
const ModuleFlags = TypeScript.SymbolFlags.ValueModule | TypeScript.SymbolFlags.NamespaceModule;

/**
 * A Plugin class that re-defines the `typedoc-plugin-not-exported` plugin.
 *
 * @remarks
 * As it was defined, the `typedoc-plugin-not-exported` plugin is not quite
 * useful to our theme. By making small modifications, the plugin now uses
 * the `internal` flag to also include elements as exported.
 *
 * Note that there are some limitations on the behavior of the plugin. The
 * `internal` modifier should only be used with modules, or members of a module,
 * but not classes or interfaces.
 */
export class NotExportedPlugin extends TypedocPlugin {
    /**
     * The reflections already checked for module exports
     */
    private checkedForModuleExports = new Map<Reflection, Set<ts.SourceFile>>();

    /**
     * The tags to include into the documentation. Note that by default
     * _internal_ is used, thus, requiring the includeInternal option to
     * be set to true.
     */
    private _includedTags: `@${string}`[] = ['@internal'];

    /** @inheritdoc */
    public initialize(): void {
        this.application.options.addDeclaration({
            name: 'includeTags',
            defaultValue: this._includedTags,
            help: '[typedoc-theme-gobstones]: A set of tags used to add elements within it, even if not exported directly by the module.',
            type: ParameterType.Array
        });

        this.application.converter.on(Converter.EVENT_BEGIN, () => {
            const includeTagTemp = this.application.options.getValue('includeTags');
            if (typeof includeTagTemp === 'string') {
                const tagName = includeTagTemp.toLocaleLowerCase();
                this._includedTags = (tagName.startsWith('@') ? [tagName] : [`@${tagName}`]) as `@${string}`[];
            } else if (Array.isArray(includeTagTemp)) {
                this._includedTags = includeTagTemp as `@${string}`[];
            }
        });

        this.application.converter.on(
            Converter.EVENT_CREATE_DECLARATION,
            (context: Context, reflection: DeclarationReflection) => {
                this._lookForFakeExports(context, reflection);
            }
        );

        this.application.converter.on(Converter.EVENT_END, () => {
            this.checkedForModuleExports.clear();
        });

        // Fix for the new TypeDoc JSDoc tag linting.
        this.application.on(Application.EVENT_BOOTSTRAP_END, () => {
            const modifiers = this.application.options.getValue('modifierTags');
            for (const tag of this._includedTags) {
                if (!modifiers.includes(tag)) {
                    this.application.options.setValue('modifierTags', [...modifiers, tag]);
                }
            }
        });
    }

    private _lookForFakeExports(context: Context, reflection: DeclarationReflection): void {
        // Figure out where "not exports" will be placed, go up the tree until we get to
        // the module where it belongs.
        let targetModule = reflection;
        // eslint-disable-next-line no-bitwise
        while (!targetModule.kindOf(ReflectionKind.Module | ReflectionKind.Project)) {
            targetModule = targetModule.parent as DeclarationReflection;
        }
        const moduleContext = context.withScope(targetModule);

        const reflSymbol = context.project.getSymbolFromReflection(reflection);

        if (!reflSymbol) {
            // Global file, no point in doing anything here. TypeDoc will already
            // include everything declared in this file.
            return;
        }

        for (const declaration of reflSymbol.declarations || []) {
            this._checkFakeExportsOfFile(declaration.getSourceFile(), moduleContext);
        }
    }

    private _checkFakeExportsOfFile(file: ts.SourceFile, context: Context): void {
        const moduleSymbol = context.checker.getSymbolAtLocation(file);

        // Make sure we are allowed to call getExportsOfModule
        // eslint-disable-next-line no-bitwise
        if (!moduleSymbol || (moduleSymbol.flags & ModuleFlags) === 0) {
            return;
        }

        const checkedScopes = this.checkedForModuleExports.get(context.scope) || new Set();
        this.checkedForModuleExports.set(context.scope, checkedScopes);

        if (checkedScopes.has(file)) return;
        checkedScopes.add(file);

        const exportedSymbols = context.checker.getExportsOfModule(moduleSymbol);

        const symbols: ts.Symbol[] = context.checker
            .getSymbolsInScope(file, TypeScript.SymbolFlags.ModuleMember)
            .filter(
                (symbol: ts.Symbol) =>
                    symbol.declarations?.some((d) => d.getSourceFile() === file) && !exportedSymbols.includes(symbol)
            );

        for (const symbol of symbols) {
            if (
                symbol
                    .getJsDocTags()
                    .some((tag: ts.JSDocTagInfo) => this._includedTags.includes(`@${tag.name.toLocaleLowerCase()}`))
            ) {
                context.converter.convertSymbol(context, symbol);
            }
        }
    }
}

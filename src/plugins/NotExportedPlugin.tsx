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
 * Adapted copy of
 * typedoc-plugin-not-exported
 * TypeDoc plugin that forces inclusion of non-exported symbols (variables)
 * Originally from https://github.com/TypeStrong/typedoc/issues/1474#issuecomment-766178261
 * And: https://github.com/tomchen/typedoc-plugin-not-exported
 * CC0
 */

import {
    Converter,
    TypeScript,
    Application,
    DeclarationReflection,
    ReflectionKind,
    ParameterType,
    Reflection
} from 'typedoc'; // version 0.20.16+
import { Context } from 'typedoc/dist/lib/converter/context';
// eslint-disable-next-line import/namespace
import * as ts from 'typescript';

import { TypedocPlugin } from '.';

const ModuleFlags = TypeScript.SymbolFlags.ValueModule | TypeScript.SymbolFlags.NamespaceModule;

export class NotExportedPlugin extends TypedocPlugin {
    private checkedForModuleExports = new Map<Reflection, Set<ts.SourceFile>>();
    private _includedTags: `@${string}`[] = ['@internal'];

    public initialize(application: Application) {
        application.options.addDeclaration({
            name: 'includeTags',
            defaultValue: this._includedTags,
            help: '[typedoc-theme-gobstones]: A set of tags used to add elements within it, even if not exported directly by the module.',
            type: ParameterType.Array
        });

        application.converter.on(Converter.EVENT_BEGIN, () => {
            const includeTagTemp = application.options.getValue('includeTags');
            if (typeof includeTagTemp === 'string') {
                const tagName = includeTagTemp.toLocaleLowerCase();
                this._includedTags = (tagName.startsWith('@') ? [tagName] : [`@${tagName}`]) as `@${string}`[];
            } else if (Array.isArray(includeTagTemp)) {
                this._includedTags = includeTagTemp as `@${string}`[];
            }
        });

        application.converter.on(
            Converter.EVENT_CREATE_DECLARATION,
            (context: Context, reflection: DeclarationReflection) => {
                this._lookForFakeExports(context, reflection);
            }
        );

        application.converter.on(Converter.EVENT_END, () => {
            this.checkedForModuleExports.clear();
        });

        // Fix for the new TypeDoc JSDoc tag linting.
        application.on(Application.EVENT_BOOTSTRAP_END, () => {
            const modifiers = application.options.getValue('modifierTags');
            for (const tag of this._includedTags) {
                if (!modifiers.includes(tag)) {
                    application.options.setValue('modifierTags', [...modifiers, tag]);
                }
            }
        });
    }

    private _lookForFakeExports(context: Context, reflection: DeclarationReflection) {
        // Figure out where "not exports" will be placed, go up the tree until we get to
        // the module where it belongs.
        let targetModule = reflection;
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

    private _checkFakeExportsOfFile(file: ts.SourceFile, context: Context) {
        const moduleSymbol = context.checker.getSymbolAtLocation(file);

        // Make sure we are allowed to call getExportsOfModule
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

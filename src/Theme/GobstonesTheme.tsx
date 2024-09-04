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
 * @module Theme
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */

import fs from 'fs';
import path from 'path';

import {
    DeclarationReflection,
    DefaultTheme,
    DefaultThemeRenderContext,
    DocumentReflection,
    PageEvent,
    Reflection,
    RendererEvent,
    SignatureReflection
} from 'typedoc';

import { GobstonesThemeContext } from './GobstonesThemeContext';

/**
 * This class represents the main element of the theme.
 * An instance of this class is automatically created by
 * TypeDoc when the theme is going to be used, and it's
 * `initialize` method called upon theme initialization.
 *
 * @remarks
 * A Theme can be defined as a subclass of the built-in TypeDoc's
 * `Theme` class. Yet, it is most useful to re-use basic behavior by
 * extending the `DefaultTheme` class instead.
 * By extending this class, we should only overwrite methods that are
 * going to change from the default class, most likely the {@link initialize}
 * method and the {@link getRenderContext} methods. By doing this we can also
 * have the benefit of accessing the currently running application through the
 * `this.application` property, allowing us to access different hooks.
 */
export class GobstonesTheme extends DefaultTheme {
    /**
     * The initialize method is called upon theme setup by TypeDoc.
     * This method's main purpose is to provide basic theme setup,
     * either at startup or at specific moments by using the application
     * hooks.
     */
    public initialize(): void {
        super.initialize();

        const staticResourceFolder = path.resolve(__dirname, path.join('..', 'static'));
        // Triggered when all elements are ready at output folder
        this.application.renderer.on(RendererEvent.END, () => {
            // We are going to reorganize assets se they live in a proper
            // folder into the assets directory

            // Get the directories for the output files
            const outputFolder = this.application.options.getValue('out');
            const assetsFolder = path.join(outputFolder, 'assets');

            // copy the assets from the theme to the output folder
            fs.cpSync(staticResourceFolder, outputFolder, { recursive: true });

            // ensure the three base folders for organization exist
            for (const folder of ['css', 'js', 'img']) {
                if (!fs.existsSync(path.join(assetsFolder, folder))) {
                    fs.mkdirSync(path.join(assetsFolder, folder));
                }
            }

            // move assets that came from default typedoc to proper folders
            fs.readdirSync(assetsFolder).forEach((file) => {
                if (file.endsWith('.css')) {
                    fs.renameSync(path.join(assetsFolder, file), path.join(assetsFolder, 'css', file));
                }
                if (file.endsWith('.js')) {
                    fs.renameSync(path.join(assetsFolder, file), path.join(assetsFolder, 'js', file));
                }
                if (file.endsWith('.jpg') || file.endsWith('.png') || file.endsWith('.svg')) {
                    fs.renameSync(path.join(assetsFolder, file), path.join(assetsFolder, 'img', file));
                }
            });
        });
        // All assets are now copied over the destination folder
    }

    /**
     * Returns the render context for this theme.
     *
     * @param pageEvent - A page event with a reflection.
     *
     * @returns The associated render context for this theme.
     */
    public getRenderContext(pageEvent: PageEvent<Reflection>): DefaultThemeRenderContext {
        // The render controls the different components and files this
        // theme is going to use.
        return new GobstonesThemeContext(this, pageEvent, this.application.options);
    }

    /**
     * Get the reflection classes of this theme.
     *
     * @remarks
     * Reflection classes are used at the theme's representation when
     * presented into the interface. This being here doesn't seem to make
     * much sense, as it has to do with the rendering and not with the
     * theme itself. Yet, this is how it's defined in the original theme,
     * thus, we need to overwrite it here.
     *
     * @param reflection - The reflection to get the classes from.
     *
     * @returns A string that represents all reflection classes.
     */
    public getReflectionClasses(reflection: DeclarationReflection | DocumentReflection): string {
        const toStyleClass = (str: string): string =>
            str.replace(/(\w)([A-Z])/g, (_m, m1: string, m2: string) => m1 + '-' + m2).toLowerCase();

        const filters = this.application.options.getValue('visibilityFilters') as Record<string, boolean>;

        const classes: string[] = [];

        // Filter classes should match up with the settings function in
        // partials/navigation.tsx.
        for (const key of Object.keys(filters)) {
            if (key === 'inherited') {
                if (reflection.flags.isInherited) {
                    classes.push('tsd-is-inherited');
                }
            } else if (key === 'protected') {
                if (reflection.flags.isProtected) {
                    classes.push('tsd-is-protected');
                }
            } else if (key === 'private') {
                if (reflection.flags.isPrivate) {
                    classes.push('tsd-is-private');
                }
            } else if (key === 'external') {
                if (reflection.flags.isExternal) {
                    classes.push('tsd-is-external');
                }
            } else if (key.startsWith('@')) {
                let firstSignature: SignatureReflection | undefined;

                if (reflection.isDeclaration()) {
                    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
                    const declRefl = reflection as DeclarationReflection;
                    firstSignature = declRefl.signatures?.[0];
                }

                if (key === '@deprecated') {
                    if (reflection.isDeprecated()) {
                        classes.push(toStyleClass(`tsd-is-${key.substring(1)}`));
                    }
                } else if (
                    reflection.comment?.hasModifier(key as `@${string}`) ||
                    reflection.comment?.getTag(key as `@${string}`) ||
                    firstSignature?.comment?.hasModifier(key as `@${string}`) ||
                    firstSignature?.comment?.getTag(key as `@${string}`)
                ) {
                    classes.push(toStyleClass(`tsd-is-${key.substring(1)}`));
                }
            }
        }

        return classes.join(' ');
    }
}

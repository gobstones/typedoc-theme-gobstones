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
import fs from 'fs';
import path from 'path';

import {
    DeclarationReflection,
    DefaultTheme,
    DocumentReflection,
    PageEvent,
    Reflection,
    RendererEvent,
    SignatureReflection
} from 'typedoc';

import { GobstonesThemeContext } from './GobstonesThemeContext';

export class GobstonesTheme extends DefaultTheme {
    initialize() {
        // The initialize method is called upon theme setting,
        // it allows to hook up at different places to perform some actions.
        super.initialize();

        const staticResourceFolder = path.resolve(__dirname, path.join('..', 'src', 'static'));

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

    getRenderContext(pageEvent: PageEvent<Reflection>) {
        // The render controls the different components and files this
        // theme is going to use.
        return new GobstonesThemeContext(this, pageEvent, this.application.options);
    }

    getReflectionClasses(reflection: DeclarationReflection | DocumentReflection) {
        function toStyleClass(str: string): string {
            return str.replace(/(\w)([A-Z])/g, (_m, m1: string, m2: string) => m1 + '-' + m2).toLowerCase();
        }

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
                    (firstSignature && firstSignature.comment?.hasModifier(key as `@${string}`)) ||
                    (firstSignature && firstSignature.comment?.getTag(key as `@${string}`))
                ) {
                    classes.push(toStyleClass(`tsd-is-${key.substring(1)}`));
                }
            }
        }

        return classes.join(' ');
    }
}

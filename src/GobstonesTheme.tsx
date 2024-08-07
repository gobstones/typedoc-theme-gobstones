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

import { DefaultTheme, PageEvent, Reflection, RendererEvent } from 'typedoc';

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
}

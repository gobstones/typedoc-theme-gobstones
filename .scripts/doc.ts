#!/usr/bin/env zx
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
import { argv, fs, path, spinner } from 'zx';
import { $, projectRootPath, script, typedocConfigPath } from './_helpers.ts';

/**
 * Generate the project documentation by running typedoc.
 * Pass --serve to run a server with the documentation.
 */
await script('clean', '--docs');
await script('build');

await $ `typedoc --options ${typedocConfigPath}`;
if (fs.existsSync(path.join(projectRootPath, 'docs/index.html'))) {
    fs.copySync(path.join(projectRootPath, 'docs/index.html'), path.join(projectRootPath, 'docs/globals.html'));
}
if (argv['serve']) {
    await spinner('Serving on http://localhost:3000', () => $ `serve ./docs`);
}

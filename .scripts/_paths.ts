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
/* eslint-disable */
import { path } from 'zx';

export const projectRootPath: string = path.dirname(__dirname);
export const tsConfigPath: string = path.join(projectRootPath, 'tsconfig.json');
export const tsTestConfigPath: string = path.join(projectRootPath, 'tsconfig.test.json');
export const typedocConfigPath: string = path.join(projectRootPath, 'typedoc.config.mjs');
export const rollupConfigPath: string = path.join(projectRootPath, 'rollup.config.mjs');
export const jestConfigPath: string = path.join(projectRootPath, 'jest.config.mjs');
export const licenseHeaderConfigPath: string = path.join(projectRootPath, 'LICENSE_HEADER');

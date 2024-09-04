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
 * This module includes a set of plugins that are going to
 * be automatically loaded when using the gobstones theme.
 *
 * @remarks
 * Most of these are third-party plugins that are just wrapped
 * inside a custom class, as to provide a simple mechanism
 * for loading them.
 *
 * @module Plugins
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 *
 * @internal
 */

export * from './MdnLinksPlugin';
export * from './MergeModulePlugin';
export * from './NotExportedPlugin';
export * from './RemoveReferencesPlugin';

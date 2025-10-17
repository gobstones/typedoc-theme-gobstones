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
 * This module exports types that wrap around the TypeDoc's
 * type system classes and options, including some minimalistic
 * functions and service classes to make the options, plugins and
 * theme loading sequence a more modular process.
 *
 * @privateRemarks
 * The reason to use this Wrappers instead of the TypeDoc's type system
 * ones is to avoid a fragile dependency. The TypeDoc's theme system is
 * not fully standardized and changes from one version of TypeDoc to the next
 * in (sometimes) painful ways. By providing this wrapper times we can
 * (hopefully) abstract away the problems, by just adapting the exported
 * types if needed.
 *
 * @module Wrappers
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 *
 * @internal
 */

export * from './TypedocApplication';
export * from './TypedocOptions';
export * from './TypedocTheme';
export * from './TypedocThemes';
export * from './TypedocPlugin';
export * from './TypedocPlugins';
export * from './TypedocRendererContext';

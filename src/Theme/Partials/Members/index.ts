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
 * This module contains the components that are used when rendering different members.
 *
 * @remarks
 * In this particular case, all elements remain identical to the ones in the default theme,
 * except for the way a particular member is rendered. The member.tsx file contains changes
 * regarding the position where the reflection flags are presented in theme, so they can be
 * styled in a particular fashion.
 *
 * @module Theme/Partials/Members
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 *
 * @internal
 */

export * from './member';
export * from './members';
export * from './member.declaration';
export * from './member.getterSetter';
export * from './member.signatures';
export * from './member.signature.body';
export * from './member.signature.title';
export * from './member.sources';

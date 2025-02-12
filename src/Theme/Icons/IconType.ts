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
 * @module Theme/Icons
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */

import { JSX, ReflectionKind } from 'typedoc';

export type IconType =
    | ReflectionKind
    | 'chevronDown'
    | 'checkbox'
    | 'menu'
    | 'search'
    | 'chevronSmall'
    | 'anchor'
    | 'folder'
    | 'alertNote'
    | 'alertTip'
    | 'alertImportant'
    | 'alertWarning'
    | 'alertCaution';

export type IconRecord = Record<IconType, () => JSX.Element>;

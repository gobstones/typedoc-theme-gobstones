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
 * @module Strings
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */

/**
 * Translate the name of a tag using the current translation mechanism.
 *
 * @privateRemarks
 * As english is the only supported language, no translation is needed,
 * as only title case is required.
 *
 * @param tag - THe tag to translate.
 * @returns The translated tag name.
 *
 * @internal
 */
export const translateTagName = (tag: `@${string}`): string => {
    const tagName = tag.substring(1);
    // In English, the tag names are the translated names, once turned
    // into title case.
    return (
        tagName.substring(0, 1).toUpperCase() + tagName.substring(1).replace(/[a-z][A-Z]/g, (x) => `${x[0]} ${x[1]}`)
    );
};

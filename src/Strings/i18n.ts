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
import { en } from './en';

/**
 * A type that represents the function of another type.
 *
 * @internal
 */
export type Functonalize<T> = {
    [P in keyof T]: () => T[P];
};

/**
 * This proxy object allows to access the translations of the page.
 */
export const i18n = new Proxy(en, {
    get:
        (target: typeof en, key: keyof typeof en): ((...args: string[]) => string) =>
        (...args: string[]) => {
            const template = en[key] || key;
            return template.replace(/\{(\d+)\}/g, (_, index) => args[+index] ?? '(no placeholder)');
        },
    has: (target: typeof en, key: keyof typeof en): boolean => Object.prototype.hasOwnProperty.call(en, key)
}) as unknown as Functonalize<typeof en>;

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
 * @module Wrappers
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */

import { TypedocApplication } from './TypedocApplication';

/**
 * The TypedocOptions module holds functions to load
 * the default options for the configuration of the theme
 * and associated plugins into the application.
 */
export namespace TypedocOptions {
    /**
     * Hook a set of options to the application, both at the moment
     * and just after the bootstrapping of the application has been performed.
     *
     * @param typedocApp - The instance of the running TypeDoc application
     * @param optionValuesGetter - A function that is given the TYpeDoc application,
     *              and returns the options to set.
     */
    export const hookThemeDefaultOptions = (
        typedocApp: TypedocApplication,
        optionValuesGetter: (app: TypedocApplication) => Record<string, unknown>
    ): void => {
        // Do a first setup right now with the properties that can be set
        TypedocOptions.setThemeDefaultOptions(typedocApp, optionValuesGetter);
        // Then hook to the bootstrap end
        // eslint-disable-next-line
        (typedocApp as any).on(TypedocApplication.EVENT_BOOTSTRAP_END, () => {
            TypedocOptions.setThemeDefaultOptions(typedocApp, optionValuesGetter);
        });
    };

    /**
     * Set the given options that are not defined already into the application.
     *
     * @param typedocApp - The instance of the running TypeDoc application
     * @param optionValuesGetter - A function that is given the TYpeDoc application,
     *              and returns the options to set.
     *
     * @internal
     */
    export const setThemeDefaultOptions = (
        typedocApp: TypedocApplication,
        optionValuesGetter: (app: TypedocApplication) => Record<string, unknown>
    ): void => {
        for (const optionName of Object.keys(optionValuesGetter(typedocApp))) {
            const optionValues = optionValuesGetter(typedocApp);
            TypedocOptions.setOptionIfNotDefined(typedocApp, optionName, optionValues[optionName]);
        }
    };

    /**
     * Set a given option with the given value on the application if not previously defined.
     *
     * @param typedocApp - The instance of the running TypeDoc application
     * @param option - The option name to set.
     * @param value - The value to set the option to.
     *
     * @internal
     */
    export const setOptionIfNotDefined = (typedocApp: TypedocApplication, option: string, value: unknown): void => {
        let isDefined: boolean = false;
        let isSet: boolean = false;
        try {
            // Note that we can not set all options defined, always, as some options
            // only become available after some plugins have defined them.
            // The isSet function throws if the option is not defined, thus, the
            // try catch is required to verify if the option was or not defined
            // before setting it.
            isSet = typedocApp.options.isSet(option);
            isDefined = true;
        } catch {
            isDefined = false;
        }

        const mustSetOptions = ['excludeExternals', 'excludeInternal', 'excludePrivate'];

        if ((isDefined && !isSet) || mustSetOptions.includes(option)) {
            typedocApp.options.setValue(option, value);
        }
    };
}

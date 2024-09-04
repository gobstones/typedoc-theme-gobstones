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
 * @module Utils
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */

import { Application } from 'typedoc';

/**
 * Hook a set of options to the application, both at the moment
 * and just after the bootstrapping of the application has been performed.
 *
 * @param typedocApp - The instance of the running TypeDoc application
 * @param optionValues - The options to set in the application.
 */
export const hookThemeDefaultOptions = (typedocApp: Application, optionValues: Record<string, unknown>): void => {
    // Do a first setup right now with the properties that can be set
    setThemeDefaultOptions(typedocApp, optionValues);
    // Then hook to the bootstrap end
    typedocApp.on(Application.EVENT_BOOTSTRAP_END, () => {
        setThemeDefaultOptions(typedocApp, optionValues);
    });
};

/**
 * Set the given options that are not defined already into the application.
 *
 * @param typedocApp - The instance of the running TypeDoc application
 * @param optionValues - The options to set in the application.
 *
 * @internal
 */
const setThemeDefaultOptions = (typedocApp: Application, optionValues: Record<string, unknown>): void => {
    for (const optionName of Object.keys(optionValues)) {
        setOptionIfNotDefined(typedocApp, optionName, optionValues[optionName]);
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
const setOptionIfNotDefined = (typedocApp: Application, option: string, value: unknown): void => {
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

    if (isDefined && !isSet) {
        typedocApp.options.setValue(option, value);
    }
};

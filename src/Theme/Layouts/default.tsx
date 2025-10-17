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
 * @module Theme/Layouts
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */

import path from 'path';

import { DeclarationReflection, JSX, PageEvent, ProjectReflection, Reflection, RenderTemplate } from 'typedoc';

import type { TypedocRendererContext } from '../../Wrappers';

/**
 * Calculate the favicon file based on the extension.
 *
 * @param context The theme context.
 * @returns The favicon component to use in the template.
 */
const favicon = (context: TypedocRendererContext): JSX.Element | undefined => {
    const fav = context.options.getValue('favicon');
    if (!fav) return undefined;

    switch (path.extname(fav)) {
        case '.ico':
            return <link rel="icon" href={context.relativeURL('assets/favicon.ico', true)} />;
        case '.png':
            return <link rel="icon" href={context.relativeURL('assets/favicon.png', true)} type="image/png" />;
        case '.svg':
            return <link rel="icon" href={context.relativeURL('assets/favicon.svg', true)} type="image/svg+xml" />;
        default:
            return undefined;
    }
};

const buildSiteMetadata = (context: TypedocRendererContext): JSX.Element | undefined => {
    try {
        // We have to know where we are hosted in order to generate this block
        const url = new URL(context.options.getValue('hostedBaseUrl'));

        // No point in generating this if we aren't the root page on the site
        if (url.pathname !== '/') {
            return undefined;
        }

        return (
            <script type="application/ld+json">
                <JSX.Raw
                    html={JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'WebSite',
                        name: context.page.project.name,
                        url: url.toString()
                    })}
                />
            </script>
        );
    } catch {
        return undefined;
    }
};

/**
 * The name to display as the main title of the documentation.
 * Default to the package name followed by a dash and a "v" followd
 * by the version number.
 *
 * @param refl - The main reflection
 *
 * @returns The display name as a string
 */
export const getDisplayName = (refl: Reflection): string => {
    let version = '';
    if ((refl instanceof DeclarationReflection || refl instanceof ProjectReflection) && refl.packageVersion) {
        version = ` - v${refl.packageVersion}`;
    }

    return `${refl.name}${version}`;
};

/**
 * The default layout to use by the theme.
 *
 * @remarks
 * The layout is the main structure of the produced HTML document, including
 * the main tags, such as head and body, as well as loading all the scripts
 * and styles.
 *
 * @privateRemarks
 * Note that there are ways to load a style or script into a theme through code,
 * yet, as we are redefining the template, loading custom elements is done entirely
 * into this file.
 *
 * @param context - The theme's context
 * @param template - The template in use.
 * @param props - The page event with the reflection.
 *
 * @returns The default layout in use as a JSX.Element.
 */
export const defaultLayout = (
    context: TypedocRendererContext,
    template: RenderTemplate<PageEvent<Reflection>>,
    props: PageEvent<Reflection>
): JSX.Element => (
    <html class="default" lang={context.options.getValue('lang')} data-base={context.relativeURL('./')}>
        <head>
            <meta charset="utf-8" />
            {context.hook('head.begin', context)}
            <meta http-equiv="x-ua-compatible" content="IE=edge" />
            <title>
                {props.model.isProject()
                    ? getDisplayName(props.model)
                    : `${getDisplayName(props.model)} | ${getDisplayName(props.project)}`}
            </title>
            {favicon(context)}
            {props.url === 'index.html' && buildSiteMetadata(context)}
            <meta name="description" content={'Documentation for ' + props.project.name} />
            <meta name="viewport" content="width=device-width, initial-scale=1" />

            <link rel="stylesheet" href={context.relativeURL('assets/css/style.css', true)} />
            <link rel="stylesheet" href={context.relativeURL('assets/css/highlight.css', true)} />
            <link rel="stylesheet" href={context.relativeURL('assets/css/typedoc-theme-gobstones.css', true)} />

            {context.options.getValue('customCss') && (
                <link rel="stylesheet" href={context.relativeURL('assets/custom.css', true)} />
            )}

            <script async src={context.relativeURL('assets/js/icons.js', true)} id="tsd-icons-script"></script>
            <script async src={context.relativeURL('assets/js/search.js', true)} id="tsd-search-script"></script>
            <script async src={context.relativeURL('assets/js/navigation.js', true)} id="tsd-nav-script"></script>
            <script defer src={context.relativeURL('assets/js/main.js', true)}></script>
            <script defer src={context.relativeURL('assets/js/typedoc-theme-gobstones.js', true)}></script>
            {context.hook('head.end', context)}
        </head>
        <body>
            {context.hook('body.begin', context)}
            <script>
                <JSX.Raw html='document.documentElement.dataset.theme = localStorage.getItem("tsd-theme") || "os";' />
                {/* Hide the entire page for up to 0.5 seconds so that if navigating between pages on a fast */}
                {/* device the navigation pane doesn't appear to flash if it loads just after the page displays. */}
                {/* This could still happen if we're unlucky, but from experimenting with Firefox's throttling */}
                {/* settings, this appears to be a reasonable tradeoff between displaying page content without the */}
                {/* navigation on exceptionally slow connections and not having the navigation obviously repaint. */}
                <JSX.Raw html='document.body.style.display="none";' />
                <JSX.Raw html='setTimeout(() => app?app.showPage():document.body.style.removeProperty("display"),500)' />
            </script>
            {context.toolbar(props)}

            <div class="container container-main">
                <div class="col-content">
                    {context.hook('content.begin', context)}
                    {context.header(props)}
                    {template(props)}
                    {context.hook('content.end', context)}
                </div>
                <div class="col-sidebar">
                    <div class="page-menu">
                        {context.hook('pageSidebar.begin', context)}
                        {context.pageSidebar(props)}
                        {context.hook('pageSidebar.end', context)}
                    </div>
                    <div class="site-menu">
                        {context.hook('sidebar.begin', context)}
                        {context.sidebar(props)}
                        {context.hook('sidebar.end', context)}
                    </div>
                </div>
            </div>

            {context.footer()}

            <div class="overlay"></div>

            {context.hook('body.end', context)}
        </body>
    </html>
);

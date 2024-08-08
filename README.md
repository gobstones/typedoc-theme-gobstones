# typedoc-theme-gobstones

This a customized theme for [TypeDoc](https://typedoc.org/) used for all the generated documentation throughout the **GobstonesWeb2** project.
It's based on the default theme used by TypeDoc, with mild improvements in readability and styling, and includes by default several plugins built-in so the user does not require to include them in their configuration. Included plugins are:
    * [typedoc-plugin-mdn-links](https://github.com/Gerrit0/typedoc-plugin-mdn-links)
    * [typedoc-plugin-merge-modules](https://github.com/krisztianb/typedoc-plugin-merge-modules)
    * [typedoc-plugin-remove-references](https://github.com/eyworldwide/typedoc-plugin-remove-references)
    * [typedoc-plugin-missing-exports](https://github.com/Gerrit0/typedoc-plugin-missing-exports) (With modifications)

[![Licence](https://img.shields.io/badge/AGPL--3.0_with_additional_terms-olivegreen?style=plastic&label=License&logo=open-source-initiative&logoColor=white&color=olivegreen)](https://github.com/gobstones/typedoc-theme-gobstones/blob/main/LICENSE) [![Version](https://img.shields.io/github/package-json/v/gobstones/typedoc-theme-gobstones?style=plastic&label=Version&logo=git-lfs&logoColor=white&color=crimson)](https://www.npmjs.com/package/@gobstones/typedoc-theme-gobstones)

[![API Docs](https://img.shields.io/github/package-json/homepage/gobstones/typedoc-theme-gobstones?color=blue&label=API%20Docs&logo=gitbook&logoColor=white&style=plastic)](https://gobstones.github.io/typedoc-theme-gobstones)

![GitHub Workflow Tests](https://img.shields.io/github/actions/workflow/status/gobstones/typedoc-theme-gobstones/on-commit-test.yml?style=plastic&label=Tests&logo=github-actions&logoColor=white) ![GitHub Workflow Build](https://img.shields.io/github/actions/workflow/status/gobstones/typedoc-theme-gobstones/on-commit-build.yml?style=plastic&label=Build&logo=github-actions&logoColor=white)

## Install

This library is included in the [gobstones-scripts](https://gobstones.github.io/gobstones-scripts) library, and used in the provided TypeDoc configuration by default. If you are using `gobstones-scripts` you don't need to do anything to use this library.

If you want to add this to a project that does not include `gobstones-scripts`, just install by using `npm`.

```bash
npm install @gobstones/typedoc-theme-gobstones
```

### Usage

Again, if you are using `gobstones-scripts` with the default configuration you don't need to do anything. If you want to use in different type of project, or provide your custom configuration, read the following.

Configure your project to use this theme by editing your `typedoc.config.js` file. Add the theme as a plugin, and set the theme to be `gobstones`. Additionally, configure properties for the default theme and plugins so the theme behaves as expected.

```js
module.exports = {
    // ...
    // You default configuration before this point
    plugin: [
        // ...
        // Set up the theme, alongside your other plugins
        '@gobstones/typedoc-theme-gobstones'
    ],
    excludeTags: [
        // Remove the @internal from the excluded tags
        "@override",
        "@virtual",
        "@satisfies",
        "@overload",
    ],
    visibilityFilters: {
        // Add @internal as a visibility filter
        '@internal': false,
        protected: false,
        private: false,
        inherited: false
    },
    // Set `gobstones` as the theme
    theme: 'gobstones',
    // Configure the merge modules strategy as a module or module-category
    mergeModulesMergeMode: 'module'
};
```

You should now be able to run `typedoc` command to get the documentation. If you are using `gobstones-scripts`, just execute `nps start doc` or one of it's related commands as usual.

## Testing newer versions of the library

To develop this library you will need to build the library and publish to a local repository, similar as to how you test `gobstones-scripts`. You may read about [how to setup a verdaccio server in your local environment](https://gobstones.github.io/gobstones-scripts/#md:testing-newer-versions-of-the-library) at the `gobstones-scripts` documentation, and if you have the gobstones-scripts project, you may even run the same server.

## Contributing

See our [Contributions Guidelines](https://gobstones-github.io/gobstones-guidelines) to contribute.

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
 * @module Theme
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */

import {
    CommentDisplayPart,
    ContainerReflection,
    DeclarationHierarchy,
    DeclarationReflection,
    DefaultTheme,
    DefaultThemeRenderContext,
    DocumentReflection,
    JSX,
    Options,
    PageEvent,
    ProjectReflection,
    Reflection,
    RenderTemplate,
    SignatureReflection,
    SomeType,
    Type,
    TypeParameterReflection
} from 'typedoc';

import { IconRecord, buildRefIcons } from './Icons';
import { defaultLayout as _defaultLayout } from './Layouts';
import {
    breadcrumb as _breadcrumb,
    commentShortSummary as _commentShortSummary,
    commentSummary as _commentSummary,
    commentTags as _commentTags,
    footer as _footer,
    header as _header,
    hierarchy as _hierarchy,
    index as _index,
    member as _member,
    memberDeclaration as _memberDeclaration,
    memberGetterSetter as _memberGetterSetter,
    memberSignatureBody as _memberSignatureBody,
    memberSignatureTitle as _memberSignatureTitle,
    memberSignatures as _memberSignatures,
    memberSources as _memberSources,
    members as _members,
    moduleReflection as _moduleReflection,
    navigation as _navigation,
    pageNavigation as _pageNavigation,
    pageSidebar as _pageSidebar,
    reflectionFlags as _reflectionFlags,
    reflectionPreview as _reflectionPreview,
    renderDisplayParts as _renderDisplayParts,
    settings as _settings,
    sidebar as _sidebar,
    sidebarLinks as _sidebarLinks,
    toolbar as _toolbar,
    type as _type,
    typeAndParent as _typeAndParent,
    typeDeclaration as _typeDeclaration,
    typeDetails as _typeDetails,
    typeDetailsIfUseful as _typeDetailsIfUseful,
    typeParameters as _typeParameters
} from './Partials';
import {
    documentTemplate as _documentTemplate,
    hierarchyTemplate as _hierarchyTemplate,
    indexTemplate as _indexTemplate,
    reflectionTemplate as _reflectionTemplate
} from './Templates';

/**
 * Return a partially applied version of the given function, such that
 * the first argument will be the given `first` element.
 *
 * @param fn - The function to partially apply.
 * @param first - The first argument to apply.
 *
 * @returns A partially applied function
 */
const bind =
    <T, F, L extends T[], R>(fn: (f: F, ...a: L) => R, first: F) =>
    (...r: L) =>
        fn(first, ...r);

/**
 * The main context of the theme. This class contains the
 * basic behavior of how the theme should look on different scenarios,
 * that is, how it will render every part of the theme depending on
 * the reflection to render.
 */
export class GobstonesThemeContext extends DefaultThemeRenderContext {
    // Custom Icons
    // ------------
    // This is required so that icons can be returned based on
    // locations of theme, and not default locations of Typedoc's default theme.
    private _customRefIcons: IconRecord;

    // Layout
    // ------
    // The original layout of Typedoc's default theme has changed.
    public override defaultLayout: (
        template: RenderTemplate<PageEvent<Reflection>>,
        props: PageEvent<Reflection>
    ) => JSX.Element = bind(_defaultLayout, this);

    // Templates
    // ---------
    // The templates of the Gobstones theme are the same as
    // Typedoc's default theme for now, so this is not truly needed
    public override documentTemplate: (props: PageEvent<DocumentReflection>) => JSX.Element = bind(
        _documentTemplate,
        this
    );
    public override hierarchyTemplate: (props: PageEvent<ProjectReflection>) => JSX.Element = bind(
        _hierarchyTemplate,
        this
    );
    public override indexTemplate: (props: PageEvent<ProjectReflection>) => JSX.Element = bind(_indexTemplate, this);
    public override reflectionTemplate: (props: PageEvent<ContainerReflection>) => JSX.Element = bind(
        _reflectionTemplate,
        this
    );

    // Navigation
    // ----------
    // The toolbar has changed regarding Typedoc's default theme, as well as
    // the sidebar's navigation, to direct the user to the readme when clicking overview,
    // others have not, so assigning them is not really needed
    public override toolbar: (props: PageEvent<Reflection>) => JSX.Element = bind(_toolbar, this);
    public override footer: () => JSX.Element = bind(_footer, this);
    // -- Left Navigation
    public override sidebar: (props: PageEvent<Reflection>) => JSX.Element = bind(_sidebar, this);
    public override pageSidebar: (props: PageEvent<Reflection>) => JSX.Element = bind(_pageSidebar, this);
    public override sidebarLinks: () => JSX.Element | null = bind(_sidebarLinks, this);
    // -- Right Navigation
    public override settings: () => JSX.Element = bind(_settings, this);
    public override navigation: (props: PageEvent<Reflection>) => JSX.Element = bind(_navigation, this);
    public override pageNavigation: (props: PageEvent<Reflection>) => JSX.Element = bind(_pageNavigation, this);

    // Sections (Main Content)
    // -----------------------
    // The main content of a page has not change from Typedoc's
    // default theme, so there is no need for this assignments truly
    public override header: (props: PageEvent<Reflection>) => JSX.Element = bind(_header, this);
    public override breadcrumb: (props: Reflection) => JSX.Element | undefined = bind(_breadcrumb, this);

    // Comments (Main Content)
    // -----------------------
    // This are the same as their counterparts in the default theme,
    // so the assignment is not really needed.
    public override commentShortSummary: (props: Reflection) => JSX.Element | undefined = bind(
        _commentShortSummary,
        this
    );
    public override commentSummary: (props: Reflection) => JSX.Element | undefined = bind(_commentSummary, this);
    public override commentTags: (props: Reflection) => JSX.Element | undefined = bind(_commentTags, this);
    public override reflectionFlags: (props: Reflection) => JSX.Element = bind(_reflectionFlags, this);
    public override displayParts: (parts: readonly CommentDisplayPart[] | undefined) => JSX.Element | undefined = bind(
        _renderDisplayParts,
        this
    );

    // Types (Main Content)
    // --------------------
    // Types have not changed from the default theme, so they are not really needed for assignment.
    public override type: (typ: SomeType | undefined, options?: { topLevelLinks: boolean }) => JSX.Element = bind(
        _type,
        this
    );
    public override typeAndParent: (props: Type) => JSX.Element = bind(_typeAndParent, this);
    public override typeParameters: (typeParameters: TypeParameterReflection[]) => JSX.Element = bind(
        _typeParameters,
        this
    );
    public override typeDetails: (props: SomeType, renderAnchors: boolean) => JSX.Children = bind(_typeDetails, this);
    public override typeDetailsIfUseful: (props: SomeType | undefined) => JSX.Children = bind(
        _typeDetailsIfUseful,
        this
    );
    public override typeDeclaration: (props: SomeType) => JSX.Children = bind(_typeDeclaration, this);

    // Members
    // -------
    // These remain identical to their counterparts in the default theme, except for member, which
    // is slightly different to support theming in a particular fashion the tag elements.
    public override member: (props: DeclarationReflection | DocumentReflection) => JSX.Element = bind(_member, this);
    public override memberDeclaration: (props: DeclarationReflection) => JSX.Element = bind(_memberDeclaration, this);
    public override memberGetterSetter: (props: DeclarationReflection) => JSX.Element = bind(_memberGetterSetter, this);
    public override memberSignatureBody: (props: SignatureReflection) => JSX.Element = bind(_memberSignatureBody, this);
    public override memberSignatureTitle: (props: SignatureReflection) => JSX.Element = bind(
        _memberSignatureTitle,
        this
    );
    public override memberSignatures: (props: DeclarationReflection) => JSX.Element = bind(_memberSignatures, this);
    public override memberSources: (props: SignatureReflection | DeclarationReflection) => JSX.Element = bind(
        _memberSources,
        this
    );

    public override members: (props: ContainerReflection) => JSX.Element = bind(_members, this);

    // Others
    // ------
    // These are the same as their counterparts in the default theme.
    /**
     * Rendered just after the description for a reflection.
     * This can be used to render a shortened type display of a reflection that the
     * rest of the page expands on.
     *
     * Note: Will not be called for variables/type aliases, as they are summarized
     * by their type declaration, which is already rendered by {@link GobstonesThemeContext.memberDeclaration}
     */
    public override reflectionPreview: (props: Reflection) => JSX.Element | undefined = bind(_reflectionPreview, this);
    public override moduleReflection: (mod: ProjectReflection | DeclarationReflection) => JSX.Element = bind(
        _moduleReflection,
        this
    );

    public override hierarchy: (props: DeclarationHierarchy | undefined) => JSX.Element | undefined = bind(
        _hierarchy,
        this
    );
    public override index: (props: ContainerReflection) => JSX.Element = bind(_index, this);

    public constructor(
        public readonly theme: DefaultTheme,
        public page: PageEvent<Reflection>,
        options: Options
    ) {
        super(theme, page, options);
        this._customRefIcons = buildRefIcons(theme.icons, this);
    }

    /**
     * Icons available for use within the page.
     */
    public get icons(): Readonly<IconRecord> {
        return this._customRefIcons;
    }

    // Markdown
    public override markdown = (md: readonly CommentDisplayPart[] | string | undefined): string => {
        const parsed = this.theme.markedPlugin.parseMarkdown(md || '', this.page, this);
        return parsed;
    };
}

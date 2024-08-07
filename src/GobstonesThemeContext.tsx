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
import {
    DefaultThemeRenderContext,
    PageEvent,
    Reflection,
    RenderTemplate,
    JSX,
    DocumentReflection,
    ProjectReflection,
    ContainerReflection,
    DeclarationHierarchy,
    DeclarationReflection,
    ReferenceReflection,
    SignatureReflection,
    Type,
    TypeParameterReflection,
    DefaultTheme,
    Options,
    CommentDisplayPart
} from 'typedoc';

import { defaultLayout as _defaultLayout } from './layouts/default';
// Comments
import { commentSummary as _commentSummary } from './partials/comments/commentSummary';
import { commentTags as _commentTags } from './partials/comments/commentTags';
import { reflectionFlags as _reflectionFlags } from './partials/comments/reflectionFlags';
// Others
import { hierarchy as _hierarchy } from './partials/hierarchy';
// Icons
import { buildRefIcons, icons } from './partials/icon';
import { index as _index } from './partials/index';
// Members
import { member as _member } from './partials/members/member';
import { memberDeclaration as _memberDeclaration } from './partials/members/member.declaration';
import { memberGetterSetter as _memberGetterSetter } from './partials/members/member.getterSetter';
import { memberReference as _memberReference } from './partials/members/member.reference';
import { memberSignatureBody as _memberSignatureBody } from './partials/members/member.signature.body';
import { memberSignatureTitle as _memberSignatureTitle } from './partials/members/member.signature.title';
import { memberSignatures as _memberSignatures } from './partials/members/member.signatures';
import { memberSources as _memberSources } from './partials/members/member.sources';
import { members as _members } from './partials/members/members';
// Navigation
import { pageNavigation as _pageNavigation } from './partials/navigation/pageSidebar/pageNavigation';
import { pageSidebar as _pageSidebar } from './partials/navigation/pageSidebar/pageSidebar';
import { settings as _settings } from './partials/navigation/pageSidebar/settings';
import { navigation as _navigation } from './partials/navigation/sidebar/navigation';
import { sidebar as _sidebar } from './partials/navigation/sidebar/sidebar';
import { sidebarLinks as _sidebarLinks } from './partials/navigation/sidebar/sidebarLinks';
import { toolbar as _toolbar } from './partials/navigation/toolbar/toolbar';
// Other
import { parameter as _parameter } from './partials/parameter';
import { reflectionPreview as _reflectionPreview } from './partials/reflectionPreview';
// Sections
import { breadcrumb as _breadcrumb } from './partials/sections/breadcrumb';
import { footer as _footer } from './partials/sections/footer';
import { header as _header } from './partials/sections/header';
// Types
import { type as _type } from './partials/types/type';
import { typeAndParent as _typeAndParent } from './partials/types/typeAndParent';
import { typeParameters as _typeParameters } from './partials/types/typeParameters';
// Templates
import { documentTemplate as _documentTemplate } from './templates/document';
import { hierarchyTemplate as _hierarchyTemplate } from './templates/hierarchy';
import { indexTemplate as _indexTemplate } from './templates/index';
import { reflectionTemplate as _reflectionTemplate } from './templates/reflection';

function bind<T, F, L extends T[], R>(fn: (f: F, ...a: L) => R, first: F) {
    return (...r: L) => fn(first, ...r);
}

export class GobstonesThemeContext extends DefaultThemeRenderContext {
    private _customRefIcons: typeof icons;

    constructor(
        readonly theme: DefaultTheme,
        public page: PageEvent<Reflection>,
        options: Options
    ) {
        super(theme, page, options);
        this._customRefIcons = buildRefIcons(theme.icons, this);
    }

    get icons(): Readonly<typeof icons> {
        return this._customRefIcons;
    }

    // Markdown
    override markdown = (md: readonly CommentDisplayPart[] | string | undefined) => {
        const parsed = this.theme.markedPlugin.parseMarkdown(md || '', this.page, this);
        return parsed;
    };

    // Layout
    override defaultLayout: (
        template: RenderTemplate<PageEvent<Reflection>>,
        props: PageEvent<Reflection>
    ) => JSX.Element = bind(_defaultLayout, this);

    // Templates
    override documentTemplate: (props: PageEvent<DocumentReflection>) => JSX.Element = bind(_documentTemplate, this);
    override hierarchyTemplate: (props: PageEvent<ProjectReflection>) => JSX.Element = bind(_hierarchyTemplate, this);
    override indexTemplate: (props: PageEvent<ProjectReflection>) => JSX.Element = bind(_indexTemplate, this);
    override reflectionTemplate: (props: PageEvent<ContainerReflection>) => JSX.Element = bind(
        _reflectionTemplate,
        this
    );

    // Navigation
    override toolbar: (props: PageEvent<Reflection>) => JSX.Element = bind(_toolbar, this);
    override sidebar: (props: PageEvent<Reflection>) => JSX.Element = bind(_sidebar, this);
    override pageSidebar: (props: PageEvent<Reflection>) => JSX.Element = bind(_pageSidebar, this);
    override sidebarLinks: () => JSX.Element | null = bind(_sidebarLinks, this);
    override settings: () => JSX.Element = bind(_settings, this);
    override navigation: (props: PageEvent<Reflection>) => JSX.Element = bind(_navigation, this);
    override pageNavigation: (props: PageEvent<Reflection>) => JSX.Element = bind(_pageNavigation, this);

    // Header and footer
    override header: (props: PageEvent<Reflection>) => JSX.Element = bind(_header, this);
    override breadcrumb: (props: Reflection) => JSX.Element | undefined = bind(_breadcrumb, this);
    override footer: () => JSX.Element = bind(_footer, this);

    // Comments
    override commentSummary: (props: Reflection) => JSX.Element | undefined = bind(_commentSummary, this);
    override commentTags: (props: Reflection) => JSX.Element | undefined = bind(_commentTags, this);
    override reflectionFlags: (props: Reflection) => JSX.Element = bind(_reflectionFlags, this);

    // Types
    override type: (type: Type | undefined, options?: { topLevelLinks: boolean }) => JSX.Element = bind(_type, this);
    override typeAndParent: (props: Type) => JSX.Element = bind(_typeAndParent, this);
    override typeParameters: (typeParameters: TypeParameterReflection[]) => JSX.Element = bind(_typeParameters, this);

    // Members
    override member: (props: DeclarationReflection | DocumentReflection) => JSX.Element = bind(_member, this);
    override memberDeclaration: (props: DeclarationReflection) => JSX.Element = bind(_memberDeclaration, this);
    override memberGetterSetter: (props: DeclarationReflection) => JSX.Element = bind(_memberGetterSetter, this);
    override memberReference: (props: ReferenceReflection) => JSX.Element = bind(_memberReference, this);
    override memberSignatureBody: (props: SignatureReflection) => JSX.Element = bind(_memberSignatureBody, this);
    override memberSignatureTitle: (props: SignatureReflection) => JSX.Element = bind(_memberSignatureTitle, this);
    override memberSignatures: (props: DeclarationReflection) => JSX.Element = bind(_memberSignatures, this);
    override memberSources: (props: SignatureReflection | DeclarationReflection) => JSX.Element = bind(
        _memberSources,
        this
    );
    override members: (props: ContainerReflection) => JSX.Element = bind(_members, this);

    // Others
    override reflectionPreview: (props: Reflection) => JSX.Element | undefined = bind(_reflectionPreview, this);

    override hierarchy: (props: DeclarationHierarchy | undefined) => JSX.Element | undefined = bind(_hierarchy, this);
    override index: (props: ContainerReflection) => JSX.Element = bind(_index, this);

    override parameter: (props: DeclarationReflection) => JSX.Element = bind(_parameter, this);
}

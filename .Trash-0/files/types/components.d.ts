
import type { DefineComponent, SlotsType } from 'vue'
type IslandComponent<T> = DefineComponent<{}, {refresh: () => Promise<void>}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, SlotsType<{ fallback: { error: unknown } }>> & T

type HydrationStrategies = {
  hydrateOnVisible?: IntersectionObserverInit | true
  hydrateOnIdle?: number | true
  hydrateOnInteraction?: keyof HTMLElementEventMap | Array<keyof HTMLElementEventMap> | true
  hydrateOnMediaQuery?: string
  hydrateAfter?: number
  hydrateWhen?: boolean
  hydrateNever?: true
}
type LazyComponent<T> = DefineComponent<HydrationStrategies, {}, {}, {}, {}, {}, {}, { hydrated: () => void }> & T

interface _GlobalComponents {
  ArticleCard: typeof import("../../../../../app/components/article/ArticleCard.vue")['default']
  ArticleMarkdownRenderer: typeof import("../../../../../app/components/article/MarkdownRenderer.vue")['default']
  ArticleTableOfContents: typeof import("../../../../../app/components/article/TableOfContents.vue")['default']
  CommentSection: typeof import("../../../../../app/components/comment/CommentSection.vue")['default']
  EssayCard: typeof import("../../../../../app/components/essay/EssayCard.vue")['default']
  LayoutFooter: typeof import("../../../../../app/components/layout/Footer.vue")['default']
  LayoutHeroBanner: typeof import("../../../../../app/components/layout/HeroBanner.vue")['default']
  LayoutNavbar: typeof import("../../../../../app/components/layout/Navbar.vue")['default']
  LayoutNavbarSearch: typeof import("../../../../../app/components/layout/NavbarSearch.vue")['default']
  LayoutProfileCard: typeof import("../../../../../app/components/layout/ProfileCard.vue")['default']
  LayoutSidebarWidgets: typeof import("../../../../../app/components/layout/SidebarWidgets.vue")['default']
  LayoutThemeToggle: typeof import("../../../../../app/components/layout/ThemeToggle.vue")['default']
  NoteNotebookTree: typeof import("../../../../../app/components/note/NotebookTree.vue")['default']
  UiBadge: typeof import("../../../../../app/components/ui/Badge.vue")['default']
  UiBrandIcon: typeof import("../../../../../app/components/ui/BrandIcon.vue")['default']
  UiButton: typeof import("../../../../../app/components/ui/Button.vue")['default']
  UiCard: typeof import("../../../../../app/components/ui/Card.vue")['default']
  UiLive2DWidget: typeof import("../../../../../app/components/ui/Live2DWidget.vue")['default']
  UiLiveClock: typeof import("../../../../../app/components/ui/LiveClock.vue")['default']
  UiPagination: typeof import("../../../../../app/components/ui/Pagination.vue")['default']
  UiSelect: typeof import("../../../../../app/components/ui/Select.vue")['default']
  UiSkeletonCard: typeof import("../../../../../app/components/ui/SkeletonCard.vue")['default']
  UiTagSelect: typeof import("../../../../../app/components/ui/TagSelect.vue")['default']
  NuxtWelcome: typeof import("../../../../.pnpm/nuxt@3.21.11_@oxc-project+types@0.143.0_@types+node@20.19.43_@vue+compiler-sfc@3.5.41_c_18cbc041533af932bcb03e20deddf35b/node_modules/nuxt/dist/app/components/welcome.vue")['default']
  NuxtLayout: typeof import("../../../../.pnpm/nuxt@3.21.11_@oxc-project+types@0.143.0_@types+node@20.19.43_@vue+compiler-sfc@3.5.41_c_18cbc041533af932bcb03e20deddf35b/node_modules/nuxt/dist/app/components/nuxt-layout")['default']
  NuxtErrorBoundary: typeof import("../../../../.pnpm/nuxt@3.21.11_@oxc-project+types@0.143.0_@types+node@20.19.43_@vue+compiler-sfc@3.5.41_c_18cbc041533af932bcb03e20deddf35b/node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']
  ClientOnly: typeof import("../../../../.pnpm/nuxt@3.21.11_@oxc-project+types@0.143.0_@types+node@20.19.43_@vue+compiler-sfc@3.5.41_c_18cbc041533af932bcb03e20deddf35b/node_modules/nuxt/dist/app/components/client-only")['default']
  DevOnly: typeof import("../../../../.pnpm/nuxt@3.21.11_@oxc-project+types@0.143.0_@types+node@20.19.43_@vue+compiler-sfc@3.5.41_c_18cbc041533af932bcb03e20deddf35b/node_modules/nuxt/dist/app/components/dev-only")['default']
  ServerPlaceholder: typeof import("../../../../.pnpm/nuxt@3.21.11_@oxc-project+types@0.143.0_@types+node@20.19.43_@vue+compiler-sfc@3.5.41_c_18cbc041533af932bcb03e20deddf35b/node_modules/nuxt/dist/app/components/server-placeholder")['default']
  NuxtLink: typeof import("../../../../.pnpm/nuxt@3.21.11_@oxc-project+types@0.143.0_@types+node@20.19.43_@vue+compiler-sfc@3.5.41_c_18cbc041533af932bcb03e20deddf35b/node_modules/nuxt/dist/app/components/nuxt-link")['default']
  NuxtLoadingIndicator: typeof import("../../../../.pnpm/nuxt@3.21.11_@oxc-project+types@0.143.0_@types+node@20.19.43_@vue+compiler-sfc@3.5.41_c_18cbc041533af932bcb03e20deddf35b/node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']
  NuxtTime: typeof import("../../../../.pnpm/nuxt@3.21.11_@oxc-project+types@0.143.0_@types+node@20.19.43_@vue+compiler-sfc@3.5.41_c_18cbc041533af932bcb03e20deddf35b/node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']
  NuxtRouteAnnouncer: typeof import("../../../../.pnpm/nuxt@3.21.11_@oxc-project+types@0.143.0_@types+node@20.19.43_@vue+compiler-sfc@3.5.41_c_18cbc041533af932bcb03e20deddf35b/node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']
  NuxtImg: typeof import("../../../../.pnpm/nuxt@3.21.11_@oxc-project+types@0.143.0_@types+node@20.19.43_@vue+compiler-sfc@3.5.41_c_18cbc041533af932bcb03e20deddf35b/node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']
  NuxtPicture: typeof import("../../../../.pnpm/nuxt@3.21.11_@oxc-project+types@0.143.0_@types+node@20.19.43_@vue+compiler-sfc@3.5.41_c_18cbc041533af932bcb03e20deddf35b/node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']
  ColorScheme: typeof import("../../../../.pnpm/@nuxtjs+color-mode@3.5.0_magicast@0.5.4/node_modules/@nuxtjs/color-mode/dist/runtime/component.vue3.vue")['default']
  Motion: typeof import("@vueuse/motion")['MotionComponent']
  MotionGroup: typeof import("@vueuse/motion")['MotionGroupComponent']
  NuxtPage: typeof import("../../../../.pnpm/nuxt@3.21.11_@oxc-project+types@0.143.0_@types+node@20.19.43_@vue+compiler-sfc@3.5.41_c_18cbc041533af932bcb03e20deddf35b/node_modules/nuxt/dist/pages/runtime/page")['default']
  NoScript: typeof import("../../../../.pnpm/nuxt@3.21.11_@oxc-project+types@0.143.0_@types+node@20.19.43_@vue+compiler-sfc@3.5.41_c_18cbc041533af932bcb03e20deddf35b/node_modules/nuxt/dist/head/runtime/components")['NoScript']
  Link: typeof import("../../../../.pnpm/nuxt@3.21.11_@oxc-project+types@0.143.0_@types+node@20.19.43_@vue+compiler-sfc@3.5.41_c_18cbc041533af932bcb03e20deddf35b/node_modules/nuxt/dist/head/runtime/components")['Link']
  Base: typeof import("../../../../.pnpm/nuxt@3.21.11_@oxc-project+types@0.143.0_@types+node@20.19.43_@vue+compiler-sfc@3.5.41_c_18cbc041533af932bcb03e20deddf35b/node_modules/nuxt/dist/head/runtime/components")['Base']
  Title: typeof import("../../../../.pnpm/nuxt@3.21.11_@oxc-project+types@0.143.0_@types+node@20.19.43_@vue+compiler-sfc@3.5.41_c_18cbc041533af932bcb03e20deddf35b/node_modules/nuxt/dist/head/runtime/components")['Title']
  Meta: typeof import("../../../../.pnpm/nuxt@3.21.11_@oxc-project+types@0.143.0_@types+node@20.19.43_@vue+compiler-sfc@3.5.41_c_18cbc041533af932bcb03e20deddf35b/node_modules/nuxt/dist/head/runtime/components")['Meta']
  Style: typeof import("../../../../.pnpm/nuxt@3.21.11_@oxc-project+types@0.143.0_@types+node@20.19.43_@vue+compiler-sfc@3.5.41_c_18cbc041533af932bcb03e20deddf35b/node_modules/nuxt/dist/head/runtime/components")['Style']
  Head: typeof import("../../../../.pnpm/nuxt@3.21.11_@oxc-project+types@0.143.0_@types+node@20.19.43_@vue+compiler-sfc@3.5.41_c_18cbc041533af932bcb03e20deddf35b/node_modules/nuxt/dist/head/runtime/components")['Head']
  Html: typeof import("../../../../.pnpm/nuxt@3.21.11_@oxc-project+types@0.143.0_@types+node@20.19.43_@vue+compiler-sfc@3.5.41_c_18cbc041533af932bcb03e20deddf35b/node_modules/nuxt/dist/head/runtime/components")['Html']
  Body: typeof import("../../../../.pnpm/nuxt@3.21.11_@oxc-project+types@0.143.0_@types+node@20.19.43_@vue+compiler-sfc@3.5.41_c_18cbc041533af932bcb03e20deddf35b/node_modules/nuxt/dist/head/runtime/components")['Body']
  NuxtIsland: typeof import("../../../../.pnpm/nuxt@3.21.11_@oxc-project+types@0.143.0_@types+node@20.19.43_@vue+compiler-sfc@3.5.41_c_18cbc041533af932bcb03e20deddf35b/node_modules/nuxt/dist/app/components/nuxt-island")['default']
  LazyArticleCard: LazyComponent<typeof import("../../../../../app/components/article/ArticleCard.vue")['default']>
  LazyArticleMarkdownRenderer: LazyComponent<typeof import("../../../../../app/components/article/MarkdownRenderer.vue")['default']>
  LazyArticleTableOfContents: LazyComponent<typeof import("../../../../../app/components/article/TableOfContents.vue")['default']>
  LazyCommentSection: LazyComponent<typeof import("../../../../../app/components/comment/CommentSection.vue")['default']>
  LazyEssayCard: LazyComponent<typeof import("../../../../../app/components/essay/EssayCard.vue")['default']>
  LazyLayoutFooter: LazyComponent<typeof import("../../../../../app/components/layout/Footer.vue")['default']>
  LazyLayoutHeroBanner: LazyComponent<typeof import("../../../../../app/components/layout/HeroBanner.vue")['default']>
  LazyLayoutNavbar: LazyComponent<typeof import("../../../../../app/components/layout/Navbar.vue")['default']>
  LazyLayoutNavbarSearch: LazyComponent<typeof import("../../../../../app/components/layout/NavbarSearch.vue")['default']>
  LazyLayoutProfileCard: LazyComponent<typeof import("../../../../../app/components/layout/ProfileCard.vue")['default']>
  LazyLayoutSidebarWidgets: LazyComponent<typeof import("../../../../../app/components/layout/SidebarWidgets.vue")['default']>
  LazyLayoutThemeToggle: LazyComponent<typeof import("../../../../../app/components/layout/ThemeToggle.vue")['default']>
  LazyNoteNotebookTree: LazyComponent<typeof import("../../../../../app/components/note/NotebookTree.vue")['default']>
  LazyUiBadge: LazyComponent<typeof import("../../../../../app/components/ui/Badge.vue")['default']>
  LazyUiBrandIcon: LazyComponent<typeof import("../../../../../app/components/ui/BrandIcon.vue")['default']>
  LazyUiButton: LazyComponent<typeof import("../../../../../app/components/ui/Button.vue")['default']>
  LazyUiCard: LazyComponent<typeof import("../../../../../app/components/ui/Card.vue")['default']>
  LazyUiLive2DWidget: LazyComponent<typeof import("../../../../../app/components/ui/Live2DWidget.vue")['default']>
  LazyUiLiveClock: LazyComponent<typeof import("../../../../../app/components/ui/LiveClock.vue")['default']>
  LazyUiPagination: LazyComponent<typeof import("../../../../../app/components/ui/Pagination.vue")['default']>
  LazyUiSelect: LazyComponent<typeof import("../../../../../app/components/ui/Select.vue")['default']>
  LazyUiSkeletonCard: LazyComponent<typeof import("../../../../../app/components/ui/SkeletonCard.vue")['default']>
  LazyUiTagSelect: LazyComponent<typeof import("../../../../../app/components/ui/TagSelect.vue")['default']>
  LazyNuxtWelcome: LazyComponent<typeof import("../../../../.pnpm/nuxt@3.21.11_@oxc-project+types@0.143.0_@types+node@20.19.43_@vue+compiler-sfc@3.5.41_c_18cbc041533af932bcb03e20deddf35b/node_modules/nuxt/dist/app/components/welcome.vue")['default']>
  LazyNuxtLayout: LazyComponent<typeof import("../../../../.pnpm/nuxt@3.21.11_@oxc-project+types@0.143.0_@types+node@20.19.43_@vue+compiler-sfc@3.5.41_c_18cbc041533af932bcb03e20deddf35b/node_modules/nuxt/dist/app/components/nuxt-layout")['default']>
  LazyNuxtErrorBoundary: LazyComponent<typeof import("../../../../.pnpm/nuxt@3.21.11_@oxc-project+types@0.143.0_@types+node@20.19.43_@vue+compiler-sfc@3.5.41_c_18cbc041533af932bcb03e20deddf35b/node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']>
  LazyClientOnly: LazyComponent<typeof import("../../../../.pnpm/nuxt@3.21.11_@oxc-project+types@0.143.0_@types+node@20.19.43_@vue+compiler-sfc@3.5.41_c_18cbc041533af932bcb03e20deddf35b/node_modules/nuxt/dist/app/components/client-only")['default']>
  LazyDevOnly: LazyComponent<typeof import("../../../../.pnpm/nuxt@3.21.11_@oxc-project+types@0.143.0_@types+node@20.19.43_@vue+compiler-sfc@3.5.41_c_18cbc041533af932bcb03e20deddf35b/node_modules/nuxt/dist/app/components/dev-only")['default']>
  LazyServerPlaceholder: LazyComponent<typeof import("../../../../.pnpm/nuxt@3.21.11_@oxc-project+types@0.143.0_@types+node@20.19.43_@vue+compiler-sfc@3.5.41_c_18cbc041533af932bcb03e20deddf35b/node_modules/nuxt/dist/app/components/server-placeholder")['default']>
  LazyNuxtLink: LazyComponent<typeof import("../../../../.pnpm/nuxt@3.21.11_@oxc-project+types@0.143.0_@types+node@20.19.43_@vue+compiler-sfc@3.5.41_c_18cbc041533af932bcb03e20deddf35b/node_modules/nuxt/dist/app/components/nuxt-link")['default']>
  LazyNuxtLoadingIndicator: LazyComponent<typeof import("../../../../.pnpm/nuxt@3.21.11_@oxc-project+types@0.143.0_@types+node@20.19.43_@vue+compiler-sfc@3.5.41_c_18cbc041533af932bcb03e20deddf35b/node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']>
  LazyNuxtTime: LazyComponent<typeof import("../../../../.pnpm/nuxt@3.21.11_@oxc-project+types@0.143.0_@types+node@20.19.43_@vue+compiler-sfc@3.5.41_c_18cbc041533af932bcb03e20deddf35b/node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']>
  LazyNuxtRouteAnnouncer: LazyComponent<typeof import("../../../../.pnpm/nuxt@3.21.11_@oxc-project+types@0.143.0_@types+node@20.19.43_@vue+compiler-sfc@3.5.41_c_18cbc041533af932bcb03e20deddf35b/node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']>
  LazyNuxtImg: LazyComponent<typeof import("../../../../.pnpm/nuxt@3.21.11_@oxc-project+types@0.143.0_@types+node@20.19.43_@vue+compiler-sfc@3.5.41_c_18cbc041533af932bcb03e20deddf35b/node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']>
  LazyNuxtPicture: LazyComponent<typeof import("../../../../.pnpm/nuxt@3.21.11_@oxc-project+types@0.143.0_@types+node@20.19.43_@vue+compiler-sfc@3.5.41_c_18cbc041533af932bcb03e20deddf35b/node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']>
  LazyColorScheme: LazyComponent<typeof import("../../../../.pnpm/@nuxtjs+color-mode@3.5.0_magicast@0.5.4/node_modules/@nuxtjs/color-mode/dist/runtime/component.vue3.vue")['default']>
  LazyMotion: LazyComponent<typeof import("@vueuse/motion")['MotionComponent']>
  LazyMotionGroup: LazyComponent<typeof import("@vueuse/motion")['MotionGroupComponent']>
  LazyNuxtPage: LazyComponent<typeof import("../../../../.pnpm/nuxt@3.21.11_@oxc-project+types@0.143.0_@types+node@20.19.43_@vue+compiler-sfc@3.5.41_c_18cbc041533af932bcb03e20deddf35b/node_modules/nuxt/dist/pages/runtime/page")['default']>
  LazyNoScript: LazyComponent<typeof import("../../../../.pnpm/nuxt@3.21.11_@oxc-project+types@0.143.0_@types+node@20.19.43_@vue+compiler-sfc@3.5.41_c_18cbc041533af932bcb03e20deddf35b/node_modules/nuxt/dist/head/runtime/components")['NoScript']>
  LazyLink: LazyComponent<typeof import("../../../../.pnpm/nuxt@3.21.11_@oxc-project+types@0.143.0_@types+node@20.19.43_@vue+compiler-sfc@3.5.41_c_18cbc041533af932bcb03e20deddf35b/node_modules/nuxt/dist/head/runtime/components")['Link']>
  LazyBase: LazyComponent<typeof import("../../../../.pnpm/nuxt@3.21.11_@oxc-project+types@0.143.0_@types+node@20.19.43_@vue+compiler-sfc@3.5.41_c_18cbc041533af932bcb03e20deddf35b/node_modules/nuxt/dist/head/runtime/components")['Base']>
  LazyTitle: LazyComponent<typeof import("../../../../.pnpm/nuxt@3.21.11_@oxc-project+types@0.143.0_@types+node@20.19.43_@vue+compiler-sfc@3.5.41_c_18cbc041533af932bcb03e20deddf35b/node_modules/nuxt/dist/head/runtime/components")['Title']>
  LazyMeta: LazyComponent<typeof import("../../../../.pnpm/nuxt@3.21.11_@oxc-project+types@0.143.0_@types+node@20.19.43_@vue+compiler-sfc@3.5.41_c_18cbc041533af932bcb03e20deddf35b/node_modules/nuxt/dist/head/runtime/components")['Meta']>
  LazyStyle: LazyComponent<typeof import("../../../../.pnpm/nuxt@3.21.11_@oxc-project+types@0.143.0_@types+node@20.19.43_@vue+compiler-sfc@3.5.41_c_18cbc041533af932bcb03e20deddf35b/node_modules/nuxt/dist/head/runtime/components")['Style']>
  LazyHead: LazyComponent<typeof import("../../../../.pnpm/nuxt@3.21.11_@oxc-project+types@0.143.0_@types+node@20.19.43_@vue+compiler-sfc@3.5.41_c_18cbc041533af932bcb03e20deddf35b/node_modules/nuxt/dist/head/runtime/components")['Head']>
  LazyHtml: LazyComponent<typeof import("../../../../.pnpm/nuxt@3.21.11_@oxc-project+types@0.143.0_@types+node@20.19.43_@vue+compiler-sfc@3.5.41_c_18cbc041533af932bcb03e20deddf35b/node_modules/nuxt/dist/head/runtime/components")['Html']>
  LazyBody: LazyComponent<typeof import("../../../../.pnpm/nuxt@3.21.11_@oxc-project+types@0.143.0_@types+node@20.19.43_@vue+compiler-sfc@3.5.41_c_18cbc041533af932bcb03e20deddf35b/node_modules/nuxt/dist/head/runtime/components")['Body']>
  LazyNuxtIsland: LazyComponent<typeof import("../../../../.pnpm/nuxt@3.21.11_@oxc-project+types@0.143.0_@types+node@20.19.43_@vue+compiler-sfc@3.5.41_c_18cbc041533af932bcb03e20deddf35b/node_modules/nuxt/dist/app/components/nuxt-island")['default']>
}

declare module 'vue' {
  export interface GlobalComponents extends _GlobalComponents { }
}

export {}

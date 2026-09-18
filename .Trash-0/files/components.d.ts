
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


export const ArticleCard: typeof import("../../../../app/components/article/ArticleCard.vue")['default']
export const ArticleMarkdownRenderer: typeof import("../../../../app/components/article/MarkdownRenderer.vue")['default']
export const ArticleTableOfContents: typeof import("../../../../app/components/article/TableOfContents.vue")['default']
export const CommentSection: typeof import("../../../../app/components/comment/CommentSection.vue")['default']
export const EssayCard: typeof import("../../../../app/components/essay/EssayCard.vue")['default']
export const LayoutFooter: typeof import("../../../../app/components/layout/Footer.vue")['default']
export const LayoutHeroBanner: typeof import("../../../../app/components/layout/HeroBanner.vue")['default']
export const LayoutNavbar: typeof import("../../../../app/components/layout/Navbar.vue")['default']
export const LayoutNavbarSearch: typeof import("../../../../app/components/layout/NavbarSearch.vue")['default']
export const LayoutProfileCard: typeof import("../../../../app/components/layout/ProfileCard.vue")['default']
export const LayoutSidebarWidgets: typeof import("../../../../app/components/layout/SidebarWidgets.vue")['default']
export const LayoutThemeToggle: typeof import("../../../../app/components/layout/ThemeToggle.vue")['default']
export const NoteNotebookTree: typeof import("../../../../app/components/note/NotebookTree.vue")['default']
export const UiBadge: typeof import("../../../../app/components/ui/Badge.vue")['default']
export const UiBrandIcon: typeof import("../../../../app/components/ui/BrandIcon.vue")['default']
export const UiButton: typeof import("../../../../app/components/ui/Button.vue")['default']
export const UiCard: typeof import("../../../../app/components/ui/Card.vue")['default']
export const UiLive2DWidget: typeof import("../../../../app/components/ui/Live2DWidget.vue")['default']
export const UiLiveClock: typeof import("../../../../app/components/ui/LiveClock.vue")['default']
export const UiPagination: typeof import("../../../../app/components/ui/Pagination.vue")['default']
export const UiSelect: typeof import("../../../../app/components/ui/Select.vue")['default']
export const UiSkeletonCard: typeof import("../../../../app/components/ui/SkeletonCard.vue")['default']
export const UiTagSelect: typeof import("../../../../app/components/ui/TagSelect.vue")['default']
export const NuxtWelcome: typeof import("../../../.pnpm/nuxt@3.21.11_@oxc-project+types@0.143.0_@types+node@20.19.43_@vue+compiler-sfc@3.5.41_c_18cbc041533af932bcb03e20deddf35b/node_modules/nuxt/dist/app/components/welcome.vue")['default']
export const NuxtLayout: typeof import("../../../.pnpm/nuxt@3.21.11_@oxc-project+types@0.143.0_@types+node@20.19.43_@vue+compiler-sfc@3.5.41_c_18cbc041533af932bcb03e20deddf35b/node_modules/nuxt/dist/app/components/nuxt-layout")['default']
export const NuxtErrorBoundary: typeof import("../../../.pnpm/nuxt@3.21.11_@oxc-project+types@0.143.0_@types+node@20.19.43_@vue+compiler-sfc@3.5.41_c_18cbc041533af932bcb03e20deddf35b/node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']
export const ClientOnly: typeof import("../../../.pnpm/nuxt@3.21.11_@oxc-project+types@0.143.0_@types+node@20.19.43_@vue+compiler-sfc@3.5.41_c_18cbc041533af932bcb03e20deddf35b/node_modules/nuxt/dist/app/components/client-only")['default']
export const DevOnly: typeof import("../../../.pnpm/nuxt@3.21.11_@oxc-project+types@0.143.0_@types+node@20.19.43_@vue+compiler-sfc@3.5.41_c_18cbc041533af932bcb03e20deddf35b/node_modules/nuxt/dist/app/components/dev-only")['default']
export const ServerPlaceholder: typeof import("../../../.pnpm/nuxt@3.21.11_@oxc-project+types@0.143.0_@types+node@20.19.43_@vue+compiler-sfc@3.5.41_c_18cbc041533af932bcb03e20deddf35b/node_modules/nuxt/dist/app/components/server-placeholder")['default']
export const NuxtLink: typeof import("../../../.pnpm/nuxt@3.21.11_@oxc-project+types@0.143.0_@types+node@20.19.43_@vue+compiler-sfc@3.5.41_c_18cbc041533af932bcb03e20deddf35b/node_modules/nuxt/dist/app/components/nuxt-link")['default']
export const NuxtLoadingIndicator: typeof import("../../../.pnpm/nuxt@3.21.11_@oxc-project+types@0.143.0_@types+node@20.19.43_@vue+compiler-sfc@3.5.41_c_18cbc041533af932bcb03e20deddf35b/node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']
export const NuxtTime: typeof import("../../../.pnpm/nuxt@3.21.11_@oxc-project+types@0.143.0_@types+node@20.19.43_@vue+compiler-sfc@3.5.41_c_18cbc041533af932bcb03e20deddf35b/node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']
export const NuxtRouteAnnouncer: typeof import("../../../.pnpm/nuxt@3.21.11_@oxc-project+types@0.143.0_@types+node@20.19.43_@vue+compiler-sfc@3.5.41_c_18cbc041533af932bcb03e20deddf35b/node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']
export const NuxtImg: typeof import("../../../.pnpm/nuxt@3.21.11_@oxc-project+types@0.143.0_@types+node@20.19.43_@vue+compiler-sfc@3.5.41_c_18cbc041533af932bcb03e20deddf35b/node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']
export const NuxtPicture: typeof import("../../../.pnpm/nuxt@3.21.11_@oxc-project+types@0.143.0_@types+node@20.19.43_@vue+compiler-sfc@3.5.41_c_18cbc041533af932bcb03e20deddf35b/node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']
export const ColorScheme: typeof import("../../../.pnpm/@nuxtjs+color-mode@3.5.0_magicast@0.5.4/node_modules/@nuxtjs/color-mode/dist/runtime/component.vue3.vue")['default']
export const Motion: typeof import("@vueuse/motion")['MotionComponent']
export const MotionGroup: typeof import("@vueuse/motion")['MotionGroupComponent']
export const NuxtPage: typeof import("../../../.pnpm/nuxt@3.21.11_@oxc-project+types@0.143.0_@types+node@20.19.43_@vue+compiler-sfc@3.5.41_c_18cbc041533af932bcb03e20deddf35b/node_modules/nuxt/dist/pages/runtime/page")['default']
export const NoScript: typeof import("../../../.pnpm/nuxt@3.21.11_@oxc-project+types@0.143.0_@types+node@20.19.43_@vue+compiler-sfc@3.5.41_c_18cbc041533af932bcb03e20deddf35b/node_modules/nuxt/dist/head/runtime/components")['NoScript']
export const Link: typeof import("../../../.pnpm/nuxt@3.21.11_@oxc-project+types@0.143.0_@types+node@20.19.43_@vue+compiler-sfc@3.5.41_c_18cbc041533af932bcb03e20deddf35b/node_modules/nuxt/dist/head/runtime/components")['Link']
export const Base: typeof import("../../../.pnpm/nuxt@3.21.11_@oxc-project+types@0.143.0_@types+node@20.19.43_@vue+compiler-sfc@3.5.41_c_18cbc041533af932bcb03e20deddf35b/node_modules/nuxt/dist/head/runtime/components")['Base']
export const Title: typeof import("../../../.pnpm/nuxt@3.21.11_@oxc-project+types@0.143.0_@types+node@20.19.43_@vue+compiler-sfc@3.5.41_c_18cbc041533af932bcb03e20deddf35b/node_modules/nuxt/dist/head/runtime/components")['Title']
export const Meta: typeof import("../../../.pnpm/nuxt@3.21.11_@oxc-project+types@0.143.0_@types+node@20.19.43_@vue+compiler-sfc@3.5.41_c_18cbc041533af932bcb03e20deddf35b/node_modules/nuxt/dist/head/runtime/components")['Meta']
export const Style: typeof import("../../../.pnpm/nuxt@3.21.11_@oxc-project+types@0.143.0_@types+node@20.19.43_@vue+compiler-sfc@3.5.41_c_18cbc041533af932bcb03e20deddf35b/node_modules/nuxt/dist/head/runtime/components")['Style']
export const Head: typeof import("../../../.pnpm/nuxt@3.21.11_@oxc-project+types@0.143.0_@types+node@20.19.43_@vue+compiler-sfc@3.5.41_c_18cbc041533af932bcb03e20deddf35b/node_modules/nuxt/dist/head/runtime/components")['Head']
export const Html: typeof import("../../../.pnpm/nuxt@3.21.11_@oxc-project+types@0.143.0_@types+node@20.19.43_@vue+compiler-sfc@3.5.41_c_18cbc041533af932bcb03e20deddf35b/node_modules/nuxt/dist/head/runtime/components")['Html']
export const Body: typeof import("../../../.pnpm/nuxt@3.21.11_@oxc-project+types@0.143.0_@types+node@20.19.43_@vue+compiler-sfc@3.5.41_c_18cbc041533af932bcb03e20deddf35b/node_modules/nuxt/dist/head/runtime/components")['Body']
export const NuxtIsland: typeof import("../../../.pnpm/nuxt@3.21.11_@oxc-project+types@0.143.0_@types+node@20.19.43_@vue+compiler-sfc@3.5.41_c_18cbc041533af932bcb03e20deddf35b/node_modules/nuxt/dist/app/components/nuxt-island")['default']
export const LazyArticleCard: LazyComponent<typeof import("../../../../app/components/article/ArticleCard.vue")['default']>
export const LazyArticleMarkdownRenderer: LazyComponent<typeof import("../../../../app/components/article/MarkdownRenderer.vue")['default']>
export const LazyArticleTableOfContents: LazyComponent<typeof import("../../../../app/components/article/TableOfContents.vue")['default']>
export const LazyCommentSection: LazyComponent<typeof import("../../../../app/components/comment/CommentSection.vue")['default']>
export const LazyEssayCard: LazyComponent<typeof import("../../../../app/components/essay/EssayCard.vue")['default']>
export const LazyLayoutFooter: LazyComponent<typeof import("../../../../app/components/layout/Footer.vue")['default']>
export const LazyLayoutHeroBanner: LazyComponent<typeof import("../../../../app/components/layout/HeroBanner.vue")['default']>
export const LazyLayoutNavbar: LazyComponent<typeof import("../../../../app/components/layout/Navbar.vue")['default']>
export const LazyLayoutNavbarSearch: LazyComponent<typeof import("../../../../app/components/layout/NavbarSearch.vue")['default']>
export const LazyLayoutProfileCard: LazyComponent<typeof import("../../../../app/components/layout/ProfileCard.vue")['default']>
export const LazyLayoutSidebarWidgets: LazyComponent<typeof import("../../../../app/components/layout/SidebarWidgets.vue")['default']>
export const LazyLayoutThemeToggle: LazyComponent<typeof import("../../../../app/components/layout/ThemeToggle.vue")['default']>
export const LazyNoteNotebookTree: LazyComponent<typeof import("../../../../app/components/note/NotebookTree.vue")['default']>
export const LazyUiBadge: LazyComponent<typeof import("../../../../app/components/ui/Badge.vue")['default']>
export const LazyUiBrandIcon: LazyComponent<typeof import("../../../../app/components/ui/BrandIcon.vue")['default']>
export const LazyUiButton: LazyComponent<typeof import("../../../../app/components/ui/Button.vue")['default']>
export const LazyUiCard: LazyComponent<typeof import("../../../../app/components/ui/Card.vue")['default']>
export const LazyUiLive2DWidget: LazyComponent<typeof import("../../../../app/components/ui/Live2DWidget.vue")['default']>
export const LazyUiLiveClock: LazyComponent<typeof import("../../../../app/components/ui/LiveClock.vue")['default']>
export const LazyUiPagination: LazyComponent<typeof import("../../../../app/components/ui/Pagination.vue")['default']>
export const LazyUiSelect: LazyComponent<typeof import("../../../../app/components/ui/Select.vue")['default']>
export const LazyUiSkeletonCard: LazyComponent<typeof import("../../../../app/components/ui/SkeletonCard.vue")['default']>
export const LazyUiTagSelect: LazyComponent<typeof import("../../../../app/components/ui/TagSelect.vue")['default']>
export const LazyNuxtWelcome: LazyComponent<typeof import("../../../.pnpm/nuxt@3.21.11_@oxc-project+types@0.143.0_@types+node@20.19.43_@vue+compiler-sfc@3.5.41_c_18cbc041533af932bcb03e20deddf35b/node_modules/nuxt/dist/app/components/welcome.vue")['default']>
export const LazyNuxtLayout: LazyComponent<typeof import("../../../.pnpm/nuxt@3.21.11_@oxc-project+types@0.143.0_@types+node@20.19.43_@vue+compiler-sfc@3.5.41_c_18cbc041533af932bcb03e20deddf35b/node_modules/nuxt/dist/app/components/nuxt-layout")['default']>
export const LazyNuxtErrorBoundary: LazyComponent<typeof import("../../../.pnpm/nuxt@3.21.11_@oxc-project+types@0.143.0_@types+node@20.19.43_@vue+compiler-sfc@3.5.41_c_18cbc041533af932bcb03e20deddf35b/node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']>
export const LazyClientOnly: LazyComponent<typeof import("../../../.pnpm/nuxt@3.21.11_@oxc-project+types@0.143.0_@types+node@20.19.43_@vue+compiler-sfc@3.5.41_c_18cbc041533af932bcb03e20deddf35b/node_modules/nuxt/dist/app/components/client-only")['default']>
export const LazyDevOnly: LazyComponent<typeof import("../../../.pnpm/nuxt@3.21.11_@oxc-project+types@0.143.0_@types+node@20.19.43_@vue+compiler-sfc@3.5.41_c_18cbc041533af932bcb03e20deddf35b/node_modules/nuxt/dist/app/components/dev-only")['default']>
export const LazyServerPlaceholder: LazyComponent<typeof import("../../../.pnpm/nuxt@3.21.11_@oxc-project+types@0.143.0_@types+node@20.19.43_@vue+compiler-sfc@3.5.41_c_18cbc041533af932bcb03e20deddf35b/node_modules/nuxt/dist/app/components/server-placeholder")['default']>
export const LazyNuxtLink: LazyComponent<typeof import("../../../.pnpm/nuxt@3.21.11_@oxc-project+types@0.143.0_@types+node@20.19.43_@vue+compiler-sfc@3.5.41_c_18cbc041533af932bcb03e20deddf35b/node_modules/nuxt/dist/app/components/nuxt-link")['default']>
export const LazyNuxtLoadingIndicator: LazyComponent<typeof import("../../../.pnpm/nuxt@3.21.11_@oxc-project+types@0.143.0_@types+node@20.19.43_@vue+compiler-sfc@3.5.41_c_18cbc041533af932bcb03e20deddf35b/node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']>
export const LazyNuxtTime: LazyComponent<typeof import("../../../.pnpm/nuxt@3.21.11_@oxc-project+types@0.143.0_@types+node@20.19.43_@vue+compiler-sfc@3.5.41_c_18cbc041533af932bcb03e20deddf35b/node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']>
export const LazyNuxtRouteAnnouncer: LazyComponent<typeof import("../../../.pnpm/nuxt@3.21.11_@oxc-project+types@0.143.0_@types+node@20.19.43_@vue+compiler-sfc@3.5.41_c_18cbc041533af932bcb03e20deddf35b/node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']>
export const LazyNuxtImg: LazyComponent<typeof import("../../../.pnpm/nuxt@3.21.11_@oxc-project+types@0.143.0_@types+node@20.19.43_@vue+compiler-sfc@3.5.41_c_18cbc041533af932bcb03e20deddf35b/node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']>
export const LazyNuxtPicture: LazyComponent<typeof import("../../../.pnpm/nuxt@3.21.11_@oxc-project+types@0.143.0_@types+node@20.19.43_@vue+compiler-sfc@3.5.41_c_18cbc041533af932bcb03e20deddf35b/node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']>
export const LazyColorScheme: LazyComponent<typeof import("../../../.pnpm/@nuxtjs+color-mode@3.5.0_magicast@0.5.4/node_modules/@nuxtjs/color-mode/dist/runtime/component.vue3.vue")['default']>
export const LazyMotion: LazyComponent<typeof import("@vueuse/motion")['MotionComponent']>
export const LazyMotionGroup: LazyComponent<typeof import("@vueuse/motion")['MotionGroupComponent']>
export const LazyNuxtPage: LazyComponent<typeof import("../../../.pnpm/nuxt@3.21.11_@oxc-project+types@0.143.0_@types+node@20.19.43_@vue+compiler-sfc@3.5.41_c_18cbc041533af932bcb03e20deddf35b/node_modules/nuxt/dist/pages/runtime/page")['default']>
export const LazyNoScript: LazyComponent<typeof import("../../../.pnpm/nuxt@3.21.11_@oxc-project+types@0.143.0_@types+node@20.19.43_@vue+compiler-sfc@3.5.41_c_18cbc041533af932bcb03e20deddf35b/node_modules/nuxt/dist/head/runtime/components")['NoScript']>
export const LazyLink: LazyComponent<typeof import("../../../.pnpm/nuxt@3.21.11_@oxc-project+types@0.143.0_@types+node@20.19.43_@vue+compiler-sfc@3.5.41_c_18cbc041533af932bcb03e20deddf35b/node_modules/nuxt/dist/head/runtime/components")['Link']>
export const LazyBase: LazyComponent<typeof import("../../../.pnpm/nuxt@3.21.11_@oxc-project+types@0.143.0_@types+node@20.19.43_@vue+compiler-sfc@3.5.41_c_18cbc041533af932bcb03e20deddf35b/node_modules/nuxt/dist/head/runtime/components")['Base']>
export const LazyTitle: LazyComponent<typeof import("../../../.pnpm/nuxt@3.21.11_@oxc-project+types@0.143.0_@types+node@20.19.43_@vue+compiler-sfc@3.5.41_c_18cbc041533af932bcb03e20deddf35b/node_modules/nuxt/dist/head/runtime/components")['Title']>
export const LazyMeta: LazyComponent<typeof import("../../../.pnpm/nuxt@3.21.11_@oxc-project+types@0.143.0_@types+node@20.19.43_@vue+compiler-sfc@3.5.41_c_18cbc041533af932bcb03e20deddf35b/node_modules/nuxt/dist/head/runtime/components")['Meta']>
export const LazyStyle: LazyComponent<typeof import("../../../.pnpm/nuxt@3.21.11_@oxc-project+types@0.143.0_@types+node@20.19.43_@vue+compiler-sfc@3.5.41_c_18cbc041533af932bcb03e20deddf35b/node_modules/nuxt/dist/head/runtime/components")['Style']>
export const LazyHead: LazyComponent<typeof import("../../../.pnpm/nuxt@3.21.11_@oxc-project+types@0.143.0_@types+node@20.19.43_@vue+compiler-sfc@3.5.41_c_18cbc041533af932bcb03e20deddf35b/node_modules/nuxt/dist/head/runtime/components")['Head']>
export const LazyHtml: LazyComponent<typeof import("../../../.pnpm/nuxt@3.21.11_@oxc-project+types@0.143.0_@types+node@20.19.43_@vue+compiler-sfc@3.5.41_c_18cbc041533af932bcb03e20deddf35b/node_modules/nuxt/dist/head/runtime/components")['Html']>
export const LazyBody: LazyComponent<typeof import("../../../.pnpm/nuxt@3.21.11_@oxc-project+types@0.143.0_@types+node@20.19.43_@vue+compiler-sfc@3.5.41_c_18cbc041533af932bcb03e20deddf35b/node_modules/nuxt/dist/head/runtime/components")['Body']>
export const LazyNuxtIsland: LazyComponent<typeof import("../../../.pnpm/nuxt@3.21.11_@oxc-project+types@0.143.0_@types+node@20.19.43_@vue+compiler-sfc@3.5.41_c_18cbc041533af932bcb03e20deddf35b/node_modules/nuxt/dist/app/components/nuxt-island")['default']>

export const componentNames: string[]

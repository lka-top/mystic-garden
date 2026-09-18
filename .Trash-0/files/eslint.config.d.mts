import type { FlatConfigComposer } from "../../../.pnpm/eslint-flat-config-utils@3.2.0/node_modules/eslint-flat-config-utils/dist/index.mjs"
import { defineFlatConfigs } from "../../../.pnpm/@nuxt+eslint-config@1.17.0_@typescript-eslint+utils@8.67.0_eslint@10.8.1_jiti@2.7.0_sup_0f761b38bc884a879fb8f2107efb6b98/node_modules/@nuxt/eslint-config/dist/flat.mjs"
import type { NuxtESLintConfigOptionsResolved } from "../../../.pnpm/@nuxt+eslint-config@1.17.0_@typescript-eslint+utils@8.67.0_eslint@10.8.1_jiti@2.7.0_sup_0f761b38bc884a879fb8f2107efb6b98/node_modules/@nuxt/eslint-config/dist/flat.mjs"

declare const configs: FlatConfigComposer
declare const options: NuxtESLintConfigOptionsResolved
declare const withNuxt: typeof defineFlatConfigs
export default withNuxt
export { withNuxt, defineFlatConfigs, configs, options }
// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite';

export default defineNuxtConfig({
  modules: [
    '@nuxt/content',
    '@nuxt/fonts',
  ],

  compatibilityDate: '2026-09-20',

  app: {
    head: {
      htmlAttrs: { lang: 'zh-CN' },
      title: '金华市外国语学校科创中心',
      meta: [
        { name: 'description', content: '致力于培养有野心的高中生成为创新创业者。' },
      ],
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    },
  },

  css: ['~/assets/css/main.css'],

  routeRules: {
    '/**': { prerender: true },
  },

  vite: {
    plugins: [tailwindcss()],
  },

  // Bun 下构建时强制使用 node:sqlite（db0 node-sqlite 连接器），
  // 避免默认 bun:sqlite 连接器打不进 cloudflare-pages 的 worker 包
  // （rollup 无法 resolve bun: 协议且 preset 禁止 externals）。
  content: {
    experimental: { sqliteConnector: 'native' },
  },

  fonts: {
    // 默认走 bunny（Google Fonts 在国内不可用，构建期由模块下载并打包到本地）。
    // 项目里字体名写在 CSS 变量里（var(--mono)），扫描不一定命中，
    // 按文档用 global: true 确保 @font-face 始终注入；family 名保持原样，视觉不变。
    provider: 'bunny',
    providers: {
      google: false,
      googleicons: false,
    },
    families: [
      { name: 'IBM Plex Mono', weights: [400, 500, 600], global: true },
    ],
  },

  // 静态内容为主：全站预渲染，输出可直接部署到 Cloudflare Pages。
  // Cloudflare preset 会产出 dist（含静态 HTML + _worker.js）。
  nitro: {
    preset: 'cloudflare-pages',
    // Cloudflare 部署配置收敛在这里：构建时 nitro 会生成 dist/_worker.js/wrangler.json
    // （name / compatibility_date / compatibility_flags / pages_build_output_dir），
    // 不再需要在仓库里放 wrangler.jsonc。
    compatibilityDate: '2026-09-20',
    cloudflare: {
      deployConfig: true,
      nodeCompat: true,
      wrangler: { name: 'jhfls-itc-homepage' },
    },
    prerender: {
      // 从首页爬全站：所有身份页均有站内链接，爬虫可达；再显式列出以防漏页。
      crawlLinks: true,
      routes: ['/', '/roles', '/roles/creator', '/roles/mentor', '/roles/media', '/roles/fellow', '/roles/visitor'],
    },
  },
});

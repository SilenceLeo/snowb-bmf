// @ts-check
import starlight from '@astrojs/starlight'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'
import starlightThemeBlack from 'starlight-theme-black'
import sitemap from '@astrojs/sitemap'

// https://astro.build/config
export default defineConfig({
  site: 'https://snowb.org',
  vite: {
    resolve: {
      alias: {
        '~': '/src',
      },
    },

    plugins: [tailwindcss()],
  },
  devToolbar: {
    enabled: false,
  },
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: {
          en: 'en',
          'zh-cn': 'zh-CN',
        },
      },
    }),
    starlight({
      title: 'SnowB BMF',
      defaultLocale: 'en',
      favicon: '/favicon.ico',
      customCss: ['./src/styles/global.css'],
      head: [
        {
          tag: 'script',
          attrs: {
            src: 'https://www.googletagmanager.com/gtag/js?id=G-8KVLZM97BB',
            defer: true,
            async: true,
          },
        },
        {
          tag: 'script',
          content:
            'window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments)}gtag("js",new Date());gtag("config", "G-8KVLZM97BB")',
        },
        {
          tag: 'meta',
          attrs: {
            property: 'og:image',
            content: 'https://snowb.org/summary_large_image.png',
          },
        },
        {
          tag: 'meta',
          attrs: {
            property: 'og:image:width',
            content: '1200',
          },
        },
        {
          tag: 'meta',
          attrs: {
            property: 'og:image:height',
            content: '630',
          },
        },
        {
          tag: 'meta',
          attrs: {
            property: 'og:image:alt',
            content: 'SnowB BMF - Free Online Bitmap Font Generator',
          },
        },
        {
          tag: 'meta',
          attrs: {
            name: 'twitter:image',
            content: 'https://snowb.org/summary_large_image.png',
          },
        },
      ],
      plugins: [
        starlightThemeBlack({
          navLinks: [
            {
              label: 'App',
              link: 'https://snowb.org',
            },
            {
              label: 'Home',
              link: '/',
            },
            {
              label: 'Docs',
              link: '/docs/',
            },
          ],
          footerText: '',
        }),
      ],
      locales: {
        en: {
          label: 'English',
          lang: 'en',
        },
        'zh-cn': {
          label: '简体中文',
          lang: 'zh-CN',
        },
      },
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/SilenceLeo/snowb-bmf',
        },
      ],
      components: {
        Hero: './src/components/Hero.astro',
        Head: './src/components/Head.astro',
      },
      sidebar: [
        {
          label: 'Getting Started',
          translations: {
            'zh-CN': '快速开始',
          },
          items: [
            {
              label: 'Overview',
              translations: {
                'zh-CN': '概述',
              },
              slug: 'docs/getting-started/overview',
            },
            {
              label: 'Interface Guide',
              translations: {
                'zh-CN': '界面指南',
              },
              slug: 'docs/getting-started/interface-guide',
            },
            {
              label: 'Workflow Guide',
              translations: {
                'zh-CN': '工作流指南',
              },
              slug: 'docs/getting-started/workflow-guide',
            },
            {
              label: 'Keyboard Shortcuts',
              translations: { 'zh-CN': '快捷键' },
              slug: 'docs/getting-started/keyboard-shortcuts',
            },
          ],
        },
        {
          label: 'Font Design',
          translations: {
            'zh-CN': '字体设计',
          },
          items: [
            {
              label: 'Font Configuration',
              translations: { 'zh-CN': '字体配置' },
              items: [
                {
                  label: 'Character Sets',
                  translations: { 'zh-CN': '字符集' },
                  slug: 'docs/font-design/character-sets',
                },
                {
                  label: 'Font Import',
                  translations: { 'zh-CN': '导入字体' },
                  slug: 'docs/font-design/font-import',
                },
                {
                  label: 'Variable Fonts',
                  translations: { 'zh-CN': '可变字体' },
                  slug: 'docs/font-design/variable-fonts',
                },
                {
                  label: 'Sharp',
                  translations: { 'zh-CN': '锐化' },
                  slug: 'docs/font-design/sharp',
                },
                {
                  label: 'Font Size',
                  translations: { 'zh-CN': '字号' },
                  slug: 'docs/font-design/font-size',
                },
                {
                  label: 'Image Glyphs',
                  translations: { 'zh-CN': '图片字形' },
                  slug: 'docs/font-design/image-glyphs',
                },
              ],
            },
            {
              label: 'Visual Styles',
              translations: { 'zh-CN': '视觉样式' },
              items: [
                {
                  label: 'Fill Styles',
                  translations: { 'zh-CN': '填充样式' },
                  slug: 'docs/font-design/fill-styles',
                },
                {
                  label: 'Stroke Styles',
                  translations: { 'zh-CN': '描边样式' },
                  slug: 'docs/font-design/stroke-styles',
                },
                {
                  label: 'Shadow Effects',
                  translations: { 'zh-CN': '阴影效果' },
                  slug: 'docs/font-design/shadow-effects',
                },
                {
                  label: 'Inner Shadow Effects',
                  translations: { 'zh-CN': '内阴影效果' },
                  slug: 'docs/font-design/inner-shadow-effects',
                },
              ],
            },
            {
              label: 'Layout & Packing',
              translations: { 'zh-CN': '布局与打包' },
              items: [
                {
                  label: 'Layout Settings',
                  translations: { 'zh-CN': '布局设置' },
                  slug: 'docs/font-design/layout-settings',
                },
                {
                  label: 'Texture Packing',
                  translations: { 'zh-CN': '纹理打包' },
                  slug: 'docs/font-design/texture-packing',
                },
              ],
            },
            {
              label: 'Typography',
              translations: { 'zh-CN': '排版' },
              items: [
                {
                  label: 'Glyph Metrics',
                  translations: { 'zh-CN': '字形度量' },
                  slug: 'docs/font-design/glyph-metrics',
                },
                {
                  label: 'Kerning Pairs',
                  translations: { 'zh-CN': '字偶距' },
                  slug: 'docs/font-design/kerning-pairs',
                },
                {
                  label: 'SDF Rendering',
                  translations: { 'zh-CN': 'SDF 渲染' },
                  slug: 'docs/font-design/sdf-rendering',
                },
              ],
            },
          ],
        },
        {
          label: 'Project Management',
          translations: {
            'zh-CN': '项目管理',
          },
          items: [
            {
              label: 'Project Operations',
              translations: {
                'zh-CN': '项目操作',
              },
              slug: 'docs/project-management/project-operations',
            },
            {
              label: 'Export Formats',
              translations: {
                'zh-CN': '导出BMF',
              },
              slug: 'docs/project-management/export-formats',
            },
            {
              label: 'PWA & Offline',
              translations: { 'zh-CN': 'PWA 与离线' },
              slug: 'docs/project-management/pwa-offline',
            },
          ],
        },
        {
          label: 'FAQ',
          translations: {
            'zh-CN': '常见问题',
          },
          slug: 'docs/faq',
        },
      ],
    }),
  ],
})

// @ts-check
import starlight from '@astrojs/starlight'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'
import starlightThemeBlack from 'starlight-theme-black'

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
          lang: 'en', // lang 是 root 语言必须的
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
          ],
        },
        {
          label: 'Font Design',
          translations: {
            'zh-CN': '字体设计',
          },
          items: [
            {
              label: 'Character Sets',
              translations: {
                'zh-CN': '字符集',
              },
              slug: 'docs/font-design/character-sets',
            },
            {
              label: 'Font Import',
              translations: {
                'zh-CN': '导入字体',
              },
              slug: 'docs/font-design/font-import',
            },
            {
              label: 'Sharp',
              translations: {
                'zh-CN': '锐化',
              },
              slug: 'docs/font-design/sharp',
            },
            {
              label: 'Font Size',
              translations: {
                'zh-CN': '字号',
              },
              slug: 'docs/font-design/font-size',
            },
            {
              label: 'Image Glyphs',
              translations: {
                'zh-CN': '图片字形',
              },
              slug: 'docs/font-design/image-glyphs',
            },
            {
              label: 'Layout Settings',
              translations: {
                'zh-CN': '布局设置',
              },
              slug: 'docs/font-design/layout-settings',
            },
            {
              label: 'Texture Packing',
              translations: {
                'zh-CN': '纹理打包',
              },
              slug: 'docs/font-design/texture-packing',
            },
            {
              label: 'Glyph Metrics',
              translations: {
                'zh-CN': '字形度量',
              },
              slug: 'docs/font-design/glyph-metrics',
            },
            {
              label: 'Fill Styles',
              translations: {
                'zh-CN': '填充样式',
              },
              slug: 'docs/font-design/fill-styles',
            },
            {
              label: 'Stroke Styles',
              translations: {
                'zh-CN': '描边样式',
              },
              slug: 'docs/font-design/stroke-styles',
            },
            {
              label: 'Shadow Effects',
              translations: {
                'zh-CN': '阴影效果',
              },
              slug: 'docs/font-design/shadow-effects',
            },
            {
              label: 'Kerning Pairs',
              translations: {
                'zh-CN': '字偶距',
              },
              slug: 'docs/font-design/kerning-pairs',
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

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
      customCss: ['./src/styles/global.css'],
      plugins: [
        starlightThemeBlack({
          navLinks: [
            {
              // optional
              label: 'App',
              link: 'https://snowb.org',
            },
            {
              // optional
              label: 'Home',
              link: '/',
            },
            {
              // optional
              label: 'Docs',
              link: '/docs',
            },
          ],
          //optional
          footerText: '',
        }),
      ],
      locales: {
        en: {
          label: 'English',
        },
        // 'zh-cn': {
        //   label: '简体中文',
        // },
      },
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/SilenceLeo/snowb-bmf',
        },
      ],
      components: {
        // Header: './src/components/CustomHeader.astro',
        Hero: './src/components/Hero.astro',
        // ContentPanel: '@astrojs/starlight/components/ContentPanel.astro',
      },
      sidebar: [
        {
          label: 'Getting Started',
          items: [
            { label: 'Overview', slug: 'docs/getting-started/overview' },
            {
              label: 'Interface Guide',
              slug: 'docs/getting-started/interface-guide',
            },
            {
              label: 'Workflow Guide',
              slug: 'docs/getting-started/workflow-guide',
            },
          ],
        },
        {
          label: 'Font Design',
          items: [
            {
              label: 'Character Sets',
              slug: 'docs/font-design/character-sets',
            },
            { label: 'Font Import', slug: 'docs/font-design/font-import' },
            { label: 'Sharp', slug: 'docs/font-design/sharp' },
            { label: 'Font Size', slug: 'docs/font-design/font-size' },
            { label: 'Image Glyphs', slug: 'docs/font-design/image-glyphs' },
            {
              label: 'Layout Settings',
              slug: 'docs/font-design/layout-settings',
            },
            {
              label: 'Texture Packing',
              slug: 'docs/font-design/texture-packing',
            },
            { label: 'Glyph Metrics', slug: 'docs/font-design/glyph-metrics' },
            { label: 'Fill Styles', slug: 'docs/font-design/fill-styles' },
            { label: 'Stroke Styles', slug: 'docs/font-design/stroke-styles' },
            {
              label: 'Shadow Effects',
              slug: 'docs/font-design/shadow-effects',
            },
            { label: 'Kerning Pairs', slug: 'docs/font-design/kerning-pairs' },
          ],
        },
        {
          label: 'Project Management',
          items: [
            {
              label: 'Project Operations',
              slug: 'docs/project-management/project-operations',
            },
            {
              label: 'Export Formats',
              slug: 'docs/project-management/export-formats',
            },
          ],
        },
        { label: 'FAQ', slug: 'docs/faq' },
      ],
    }),
  ],
})

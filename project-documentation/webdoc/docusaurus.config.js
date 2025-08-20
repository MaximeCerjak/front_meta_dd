// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'DigitalDrifter documentation',
  tagline: 'Surf differently & navigate the extraordinary',
  favicon: 'img/fav/favicon.ico',

  // Set the production url of your site here
  url: 'https://your-docusaurus-site.example.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'DigitalDrifter & cie', // Usually your GitHub org/user name.
  projectName: 'DigitalDrifter', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'fr',
    locales: ['fr', 'en'],
    localeConfigs: {
      fr: {
        label: 'Français',
        direction: 'ltr',
      },
      en: {
        label: 'English',
        direction: 'ltr',
      },
    },
  },  

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  plugins: [
    [
      'docusaurus-plugin-openapi-docs',
      {
        id: 'api',
        docsPluginId: 'default',
        config: {
          gateway: {
            specPath: 'http://gateway-service:8080/openapi.json',
            outputDir: 'docs/api/gateway',
            sidebarOptions: { groupPathsBy: 'tag' },
          },
          user: {
            specPath: 'http://user-service:3000/openapi.json',
            outputDir: 'docs/api/user',
            sidebarOptions: { groupPathsBy: 'tag' },
          },
          asset: {
            specPath: 'http://asset-service:4000/openapi.json',
            outputDir: 'docs/api/asset',
            sidebarOptions: { groupPathsBy: 'tag' },
          },
          map: {
            specPath: 'http://map-service:5000/openapi.json',
            outputDir: 'docs/api/map',
            sidebarOptions: { groupPathsBy: 'tag' },
          },
        },
      },
    ],
  ], 
  themes: ["docusaurus-theme-openapi-docs"], 

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      navbar: {
        title: 'DDdoc',
        logo: {
          alt: 'My Site Logo',
          src: 'img/fav/logo.png',
        },
        items: [
          {
            type: 'docSidebar', // Changez ce paramètre pour spécifier les IDs des sidebars par langue.
            sidebarId: 'fr', // Pour le français
            position: 'left',
            label: 'Documentation',
          },
          {
            type: 'docSidebar',
            sidebarId: 'en', // Pour l'anglais
            position: 'left',
            label: 'Documentation (EN)',
          },
          {
            href: 'https://gitlab.com/digitaldrifter/project-documentation',
            label: 'GitLab',
            position: 'right',
          },
        ],
      },

      sidebar: {
        hideable: true,
        autoCollapseCategories: true, 
      },
      
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Documentation',
                to: '/docs/intro',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Stack Overflow',
                href: 'https://stackoverflow.com/questions/tagged/docusaurus',
              },
              {
                label: 'Discord',
                href: 'https://discordapp.com/invite/docusaurus',
              },
              {
                label: 'X',
                href: 'https://x.com/docusaurus',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'GitLab',
                href: 'https://gitlab.com/digitaldrifter/project-documentation',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} My Project, Inc. Built with Docusaurus.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;

import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'

const clientPort = process.env.CLIENT_PORT || process.env.HTTPS_CLIENT_PORT || 8080

export default withMermaid(
  defineConfig({
    base: '/',
    title: 'Kalisio Crisis',
    description: 'Situational intelligence solution to inform and coordinate fieldworkers',
    ignoreDeadLinks: true,
    head: [
      ['link', { href: 'https://cdnjs.cloudflare.com/ajax/libs/line-awesome/1.3.0/line-awesome/css/line-awesome.min.css', rel: 'stylesheet' }],
      ['link', { rel: 'icon', href: `https://s3.eu-central-1.amazonaws.com/kalisioscope/crisis/crisis-icon-color-64x64.png` }]
    ],
    locales: {
      root: {
        label: 'English',
        lang: 'en'
      },
      fr: {
        label: 'French',
        lang: 'fr',
        themeConfig: {
          nav: [
            { text: 'Démarrer', link: '/fr/quickstart/introduction' },
            { text: 'Aller plus loin', link: '/fr/gofurther/introduction' },
            { text: 'Didacticiels', link: '/fr/tutorials/introduction' },
            { text: 'A propos', link: '/fr/about/introduction'}
          ],
          sidebar: {
            '/fr/quickstart/': getQuickStartSidebar('fr'),
            '/fr/gofurther/': getGoFurtherSidebar('fr'),
            '/fr/tutorials/': getTutorialsSidebar('fr'),
            '/fr/about/': getAboutSidebar('fr')
          },
          docFooter: {
            prev: 'page précédente',
            next: 'page suivante'
          }
        }
      }
    },
    themeConfig: {
      logo: 'https://s3.eu-central-1.amazonaws.com/kalisioscope/crisis/crisis-icon-color-64x64.png',
      appUrl: (process.env.NODE_ENV === 'development' ? `http://localhost:${clientPort}/` : 'https://crisis.kalisio.com/'),
      nav: [
        { text: 'Quickstart', link: '/quickstart/introduction' },
        { text: 'Go further', link: '/gofurther/introduction' },
        { text: 'About', link: '/about/introduction' }
      ],
      sidebar: {
        '/quickstart/': getQuickStartSidebar(),
        '/gofurther/': getGoFurtherSidebar(),
        '/tutorials/': getTutorialsSidebar(),
        '/about/': getAboutSidebar()
      },
      footer: {
        copyright: 'MIT Licensed | Copyright © 2017-20xx Kalisio'
      }
    },
    mermaid: {
      // refer https://mermaid.js.org/config/setup/modules/mermaidAPI.html#mermaidapi-configuration-defaults for options
    },
    build: {
      chunkSizeWarningLimit: 1600
    }
  })
)

function getQuickStartSidebar (lang = 'en') {
  if (lang === 'en') {
    return [
      { text: 'Introduction', link: '/quickstart/introduction' },
      { text: 'Features', link: '/quickstart/features' },
      { text: 'Benefits', link: '/quickstart/benefits' },
      { text: 'Installation', link: '/quickstart/installation' },
      { text: 'Update', link: '/quickstart/update' },
      { text: 'Concepts', link: '/quickstart/concepts' },
      { text: 'History', link: '/quickstart/history' }
    ]
  }
  return [
    { text: 'Présentation', link: '/fr/quickstart/introduction' },
    { text: 'Fonctionnalités', link: '/fr/quickstart/features' },
    { text: 'Bénéfices', link: '/fr/quickstart/benefits' },
    { text: 'Installation', link: '/fr/quickstart/installation' },
    { text: 'Mise à jour', link: '/fr/quickstart/update' },
    { text: 'Concepts de base', link: '/fr/quickstart/concepts' },
    { text: 'Historique', link: '/fr/quickstart/history' }
  ]
}

function getGoFurtherSidebar (lang = 'en') {
  if (lang === 'en') {
    return [
      { text: 'Go further', link: '/gofurther/introduction' },
      { text: 'Processes', link: '/gofurther/workflow' },
      { text: 'Logbook', link: '/gofurther/archiving' },
      { text: 'Mapping catalog', link: '/gofurther/catalog' },
      { text: 'Environmental alerts', link: '/gofurther/alert' },
      { text: 'Plan', link: '/gofurther/plan' }
    ]
  }
  return [
    { text: 'Aller plus loin', link: '/fr/gofurther/introduction' },
    { text: 'Processus', link: '/fr/gofurther/workflow' },
    { text: 'Main courante', link: '/fr/gofurther/archiving' },
    { text: 'Catalogue cartographique', link: '/fr/gofurther/catalog' },
    { text: 'Alertes environnementales', link: '/fr/gofurther/alert' },
    { text: 'Plan', link: '/fr/gofurther/plan' }
  ]
}

function getTutorialsSidebar (lang = 'en') {
  if (lang === 'en') {
    return [
      { text: 'Video Tutorials', link: '/tutorials/introduction' }
    ]
  }
  return [
    { text: 'Didacticiels Vidéo', link: '/fr/tutorials/introduction' }
  ]
}

function getAboutSidebar (lang = 'en') {
  if (lang === 'en') {
    return [
      { text: 'About', link: '/about/introduction' },
      { text: 'Contributing', link: '/about/contributing' },
      { text: 'License', link: '/about/license' },
      { text: 'Contact', link: '/about/contact' }
    ]
  }
  return [
    { text: 'A propos', link: '/fr/about/introduction' },
    { text: 'Contribuer', link: '/fr/about/contributing' },
    { text: 'Licence', link: '/fr/about/license' },
    { text: 'Contact', link: '/fr/about/contact' }
  ]
}
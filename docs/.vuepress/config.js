const clientPort = process.env.CLIENT_PORT || process.env.HTTPS_CLIENT_PORT || 8080

module.exports = {
  base: '/',
  title: `Kalisio Crisis`,
  description: 'Situational intelligence solution to inform and coordinate fieldworkers',
  head: [
    ['link', { rel: 'icon', href: `https://s3.eu-central-1.amazonaws.com/kalisioscope/crisis/crisis-icon-color-64x64.png` }],
    ['link', { rel: 'manifest', href: '/manifest.json' }]
  ],
  locales: {
    '/': {
      lang: 'en',
      title: `Kalisio Crisis`,
      description: 'Situational intelligence solution to inform and coordinate fieldworkers',
    },
    '/fr/': {
      lang: 'fr',
      title: `Kalisio Crisis`,
      description: `Solution d'intelligence situationnelle pour informer et coordonner les acteurs de terrain`,
    },
  },
  theme: 'kalisio',
  themeConfig: {
    docsDir: 'docs',
    banner: {
      image: 'https://s3.eu-central-1.amazonaws.com/kalisioscope/crisis/crisis-logo-color-256x128.png',
      slogan: 'Better decisions with instant geographic insights'
    },
    appUrl: (process.env.NODE_ENV === 'development' ?
      `http://localhost:${clientPort}/` : 'https://crisis.kalisio.com/'),
    locales: {
      '/': {
        label: 'English',
        selectText: 'Languages',
        nav: [
          { text: 'Quickstart', link: '/quickstart/' },
          { text: 'Go further', link: '/gofurther/' },
          { text: 'About', link: '/about/'}
        ],
        sidebar: {
          '/quickstart/': getQuickStartSidebar(),
          '/gofurther/': getGoFurtherSidebar(),
          '/tutorials/': getTutorialsSidebar(),
          '/about/': getAboutSidebar()
        }
      },
      '/fr/': {
        label: 'Français',
        selectText: 'Langues',
        nav: [
          { text: 'Démarrer', link: '/fr/quickstart/' },
          { text: 'Aller plus loin', link: '/fr/gofurther/' },
          { text: 'Didacticiels', link: '/fr/tutorials/' },
          { text: 'A propos', link: '/fr/about/' }
        ],
        sidebar: {
          '/fr/quickstart/': getQuickStartSidebar(),
          '/fr/gofurther/': getGoFurtherSidebar(),
          '/fr/tutorials/': getTutorialsSidebar(),
          '/fr/about/': getAboutSidebar()
        }
      },
    }
  },
  head: [
    [
      "link",
      {
        rel: "stylesheet",
        href: "https://maxst.icons8.com/vue-static/landings/line-awesome/line-awesome/1.3.0/css/line-awesome.min.css"
      }
    ]
  ],
  plugins: [
    ['vuepress-plugin-redirect', {
      // provide i18n redirection
      // it will automatically redirect `/foo/bar/` to `/:locale/foo/bar/` if exists
      locales: true
    }]
  ]
}

function getQuickStartSidebar () {
  return [
    '',
    'features',
    'benefits',
    'installation',
    'update',
    'concepts',
    'history'
  ]
}

function getGoFurtherSidebar () {
  return [
    '',
    'workflow',
    'archiving',
    'catalog',
    'alert',
    'plan'
  ]
}

function getTutorialsSidebar () {
  return [
    ''
  ]
}

function getAboutSidebar () {
  return [
    '',
    'contributing',
    'license',
    'contact'
  ]
}
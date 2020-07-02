module.exports = {
  base: '/aktnmap/',
  title: `Akt'n'Map`,
  description: 'Situational intelligence solution to inform and coordinate fieldworkers',
  head: [
    ['link', { rel: 'icon', href: `https://s3.eu-central-1.amazonaws.com/kalisioscope/aktnmap/aktnmap-icon-64x64.png` }],
    ['link', { rel: 'manifest', href: '/manifest.json' }]
  ],
  locales: {
    '/': {
      lang: 'en',
      title: `Akt'n'Map`,
      description: 'Situational intelligence solution to inform and coordinate fieldworkers',
    },
    '/fr/': {
      lang: 'fr',
      title: `Akt'n'Map`,
      description: `Solution d'intelligence situationnelle pour informer et coordonner les acteurs de terrain`,
    },
  },
  theme: 'kalisio',
  themeConfig: {
    docsDir: 'docs',
    locales: {
      '/': {
        label: 'English',
        selectText: 'Languages',
        nav: [
          { text: 'Quickstart', link: '/quickstart/' },
          { text: 'Go further', link: '/gofurther/' },
          { text: 'About', link: '/about/' }
        ],
        sidebar: {
          '/quickstart/': getQuickStartSidebar(),
          '/gofurther/': getGoFurtherSidebar(),
          '/about/': getAboutSidebar()
        }
      },
      '/fr/': {
        label: 'Français',
        selectText: 'Langues',
        nav: [
          { text: 'Démarrer', link: '/fr/quickstart/' },
          { text: 'Aller plus loin', link: '/fr/gofurther/' },
          { text: 'A propos', link: '/fr/about/' }
        ],
        sidebar: {
          '/fr/quickstart/': getQuickStartSidebar(),
          '/fr/gofurther/': getGoFurtherSidebar(),
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
  ]
}

function getQuickStartSidebar () {
  return [
    '',
    'features',
    'benefits'
  ]
}

function getGoFurtherSidebar () {
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

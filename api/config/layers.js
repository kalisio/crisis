// Override defaults if env provided
const kargoDomain = (process.env.SUBDOMAIN ? process.env.SUBDOMAIN : 'kargo.kalisio.xyz')
const mapproxyUrl = 'https://mapproxy.' + kargoDomain

module.exports = [
  {
    name: 'Sentinel 2',
    description: 'Cloudless',
    tags: [
      'satellite'
    ],
    iconUrl: `${mapproxyUrl}/wmts/s2/GLOBAL_WEBMERCATOR/0/0/0.jpeg`,
    icon: 'satellite',
    attribution: 'Sentinel-2 cloudless <a href="https://s2maps.eu">by EOX IT Services GmbH </a>',
    type: 'BaseLayer',
    leaflet: {
      type: 'tileLayer',
      source: `${mapproxyUrl}/wmts/s2/GLOBAL_WEBMERCATOR/{z}/{x}/{y}.jpeg`,
      maxZoom: 18
    },
    cesium: {
      type: 'OpenStreetMap',
      isVisible: true,
      fileExtension: 'jpeg',
      url: `${mapproxyUrl}/wmts/s2/GLOBAL_WEBMERCATOR`
    }
  },
  {
    name: 'OSM Bright',
    description: 'OpenStreetMap',
    tags: [
      'street'
    ],
    iconUrl: `${mapproxyUrl}/wmts/osm-bright/GLOBAL_WEBMERCATOR/0/0/0.png`,
    icon: 'streetview',
    attribution: 'OpenMapTiles © <a href="https://openmaptiles.com">OpenMapTiles</a> & OpenStreetMap © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
    type: 'BaseLayer',
    leaflet: {
      type: 'tileLayer',
      isVisible: true,
      source: `${mapproxyUrl}/wmts/osm-bright/GLOBAL_WEBMERCATOR/{z}/{x}/{y}.png`,
      maxZoom: 18
    },
    cesium: {
      type: 'OpenStreetMap',
      url: `${mapproxyUrl}/wmts/osm-bright/GLOBAL_WEBMERCATOR`
    }
  },
  {
    name: 'OSM Dark',
    description: 'OpenStreetMap',
    tags: [
      'street'
    ],
    iconUrl: `${mapproxyUrl}/wmts/osm-dark/GLOBAL_WEBMERCATOR/0/0/0.png`,
    icon: 'streetview',
    attribution: 'OpenMapTiles © <a href="https://openmaptiles.com">OpenMapTiles</a> & OpenStreetMap © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
    type: 'BaseLayer',
    leaflet: {
      type: 'tileLayer',
      source: `${mapproxyUrl}/wmts/osm-dark/GLOBAL_WEBMERCATOR/{z}/{x}/{y}.png`,
      maxZoom: 18
    },
    cesium: {
      type: 'OpenStreetMap',
      url: `${mapproxyUrl}/wmts/osm-dark/GLOBAL_WEBMERCATOR`
    }
  },
  {
    name: 'OSMT bright',
    description: 'OpenStreetMap & Terrain',
    tags: [
      'street',
      'terrain'
    ],
    iconUrl: `${mapproxyUrl}/wmts/osm-terrain-bright/GLOBAL_WEBMERCATOR/0/0/0.png`,
    icon: 'terrain',
    attribution: 'OpenMapTiles © <a href="https://openmaptiles.com">OpenMapTiles</a> & OpenStreetMap © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
    type: 'BaseLayer',
    leaflet: {
      type: 'tileLayer',
      source: `${mapproxyUrl}/wmts/osm-terrain-bright/GLOBAL_WEBMERCATOR/{z}/{x}/{y}.png`,
      maxZoom: 18
    },
    cesium: {
      type: 'OpenStreetMap',
      url: `${mapproxyUrl}/wmts/osm-terrain-bright/GLOBAL_WEBMERCATOR`
    }
  },
  {
    name: 'OSMT dark',
    description: 'OpenStreetMap & Terrain',
    tags: [
      'street',
      'terrain'
    ],
    iconUrl: `${mapproxyUrl}/wmts/osm-terrain-dark/GLOBAL_WEBMERCATOR/0/0/0.png`,
    icon: 'terrain',
    attribution: 'OpenMapTiles © <a href="https://openmaptiles.com">OpenMapTiles</a> & OpenStreetMap © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
    type: 'BaseLayer',
    leaflet: {
      type: 'tileLayer',
      source: `${mapproxyUrl}/wmts/osm-terrain-dark/GLOBAL_WEBMERCATOR/{z}/{x}/{y}.png`,
      maxZoom: 18
    },
    cesium: {
      type: 'OpenStreetMap',
      url: `${mapproxyUrl}/wmts/osm-terrain-dark/GLOBAL_WEBMERCATOR`
    }
  },
  {
    name: 'WGS84',
    description: 'Standard Ellipsoid',
    tags: [
      'terrain'
    ],
    iconUrl: 'statics/Cesium/Widgets/Images/TerrainProviders/Ellipsoid.png',
    icon: 'fiber_manual_record',
    attribution: '',
    'default': true,
    type: 'TerrainLayer',
    cesium: {
      type: 'Ellipsoid',
      isVisible: true
    }
  },
  {
    name: 'Cesium Terrain',
    description: 'World-wide 30m',
    tags: [
      'terrain'
    ],
    iconUrl: 'statics/Cesium/Widgets/Images/TerrainProviders/CesiumWorldTerrain.png',
    icon: 'terrain',
    attribution: 'High-resolution, mesh-based terrain for the entire globe.\nBy https://cesiumjs.org',
    type: 'TerrainLayer',
    cesium: {
      type: 'Cesium',
      requestWaterMask: 'true',
      requestVertexNormals: 'true'
    }
  },
  {
    name: 'Kalisio Terrain',
    description: 'World-wide 30m',
    tags: [
      'terrain'
    ],
    iconUrl: 'statics/Cesium/Widgets/Images/TerrainProviders/CesiumWorldTerrain.png',
    icon: 'terrain',
    attribution: 'High-resolution, mesh-based terrain for the entire globe.\nBy http://www.kalisio.com',
    type: 'TerrainLayer',
    cesium: {
      type: 'Cesium',
      url: 'http://cesiumterrainserver.kalisio.xyz/tilesets/md15-tiles',
      requestWaterMask: 'true',
      requestVertexNormals: 'true'
    }
  },
  {
    name: 'Téléray',
    description: 'Dose rate',
    tags: [
      'measure'
    ],
    iconUrl: 'https://s3.eu-central-1.amazonaws.com/kalisioscope/assets/teleray-icon.jpg',
    attribution: '',
    type: 'OverlayLayer',
    featureId: 'irsnId',
    leaflet: {
      type: 'geoJson',
      source: 'https://s3.eu-central-1.amazonaws.com/kargo/teleray.json',
      realtime: true,
      interval: 600000,
      container: 'markerClusterGroup',
      popup: {
        pick: [
          'name'
        ]
      },
      tooltip: {
        template: '<% if (properties.value) { %>Dose = <%= properties.value.toFixed(2) %> nSv/h</br>\
                   <%= new Date(properties.measureDateFormatted).toLocaleString() %><% } %>'
      }
    },
    cesium: {
      type: 'geoJson',
      source: 'https://s3.eu-central-1.amazonaws.com/kargo/teleray.json',
      realtime: true,
      interval: 600000,
      cluster: {
        pixelRange: 50
      },
      'marker-symbol': 'lighthouse',
      'marker-color': '#180EF1'
    }
  },
  {
    name: 'Sites',
    description: 'Nuclear sites',
    tags: [
      'business'
    ],
    icon: 'star',
    attribution: '',
    type: 'OverlayLayer',
    probe: 'nuclear-sites',
    leaflet: {
      type: 'geoJson',
      source: 'https://s3.eu-central-1.amazonaws.com/kargo/nuclear-sites.json',
      cluster: {},
      'marker-color': 'orange',
      'icon-color': 'white',
      'icon-classes': 'fa fa-star',
      popup: {
        pick: [
          'NAME'
        ]
      },
      tooltip: {
        property: 'LABEL'
      }
    },
    cesium: {
      type: 'geoJson',
      source: 'https://s3.eu-central-1.amazonaws.com/kargo/nuclear-sites.json',
      cluster: {
        pixelRange: 50
      },
      'marker-symbol': 'star',
      'marker-color': '#FFA500'
    }
  },
  {
    name: 'Airports',
    description: 'Major airports',
    tags: [
      'business'
    ],
    icon: 'local_airport',
    attribution: '',
    type: 'OverlayLayer',
    probe: 'ne_10m_airports',
    leaflet: {
      type: 'geoJson',
      source: 'https://s3.eu-central-1.amazonaws.com/kargo/ne_10m_airports.json',
      cluster: {},
      'marker-color': 'blue',
      'icon-color': 'white',
      'icon-classes': 'fa fa-plane',
      popup: {
        pick: [
          'NAME'
        ]
      },
      tooltip: {
        property: 'LABEL'
      }
    },
    cesium: {
      type: 'geoJson',
      source: 'https://s3.eu-central-1.amazonaws.com/kargo/ne_10m_airports.json',
      cluster: {
        pixelRange: 50
      },
      'marker-symbol': 'airfield',
      'marker-color': '#00A5FF'
    }
  },
  {
    name: 'Airbus EV ADS-B',
    description: 'Flight positions',
    tags: [
      'business'
    ],
    icon: 'flight',
    iconUrl: 'https://s3.eu-central-1.amazonaws.com/kalisioscope/assets/adsb-icon.jpg',
    attribution: '',
    type: 'OverlayLayer',
    featureId: 'icao',
    leaflet: {
      type: 'geoJson',
      source: 'https://s3-eu-west-1.amazonaws.com/gift-backbone-adsb/adsb-airline-one.json',
      realtime: true,
      interval: 5000,
      'marker-symbol': '/statics/paper-plane.png',
      'marker-size': 32,
      'icon-anchor': [
        16,
        32
      ],
      popup: {
        pick: [
          'icao'
        ]
      },
      tooltip: {
        property: 'callsign'
      }
    },
    cesium: {
      type: 'geoJson',
      source: 'https://s3-eu-west-1.amazonaws.com/gift-backbone-adsb/adsb-airline-one.json',
      realtime: true,
      interval: 5000,
      'marker-symbol': 'airport',
      'marker-color': '#57D824'
    }
  }
]
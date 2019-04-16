// Override defaults if env provided
// const kargoDomain = (process.env.SUBDOMAIN ? process.env.SUBDOMAIN : 'kargo.kalisio.xyz')
// We don't yet use production KArgo and have a dedicated one for app
const kargoDomain = 'app.aktnmap.com'
const mapproxyUrl = 'https://mapproxy.' + kargoDomain

module.exports = [
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
    }
  }
]
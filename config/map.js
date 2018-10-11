module.exports = {
  baseLayers: [
    {
      type: 'tileLayer',
      arguments: [
        'https://mapproxy.app.aktnmap.com/wmts/osm-bright/GLOBAL_WEBMERCATOR/{z}/{x}/{y}.png',
        {
          maxZoom: 18,
          label: 'OpenStreetMap',
          attribution: 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
        }
      ]
    }
  ]
}

import { toGeoJSON, runQuery } from './util';

mapboxgl.accessToken = 'pk.eyJ1IjoiaGFiYmVzIiwiYSI6ImNqN3ZsdW5xNjVhNDMzM21sY2Y4Y3d3OHQifQ.5Z4dZGEYlOH2-ToSNskghg';
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/satellite-v9',
  center: [34.6857, 2.1540],
  zoom: 9
});
map.addControl(new mapboxgl.NavigationControl());

function init() {
  runQuery([
    { $match: { 'species.name': 'zebra' } },
    { $limit: 10 }
  ]).then(data => {
    console.log('ran query');
    const geoData = toGeoJSON(data);
    map.on('load', () => {
      map.addSource('animals', {
        type: 'geojson',
        data: {
          'type': 'FeatureCollection',
          'features': geoData
        }
      });
      console.log('added source', geoData);
  
      map.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'animals',
        paint: {
          'circle-color': {
              property: 'count',
              type: 'interval',
              stops: [
                  [0, '#41A337'],
                  [100, '#2D7026'],
                  [750, '#0B5703'],
              ]
          },
          'circle-radius': {
              property: 'count',
              type: 'interval',
              stops: [
                  [0, 20],
                  [100, 30],
                  [750, 40]
              ]
          }
      }
      })
    });
  });  
}

window.onload = init;

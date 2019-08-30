import { runQuery, processData, createChart } from './util';
import { updateFilters, registerFilters } from './filters';

mapboxgl.accessToken = 'pk.eyJ1IjoiaGFiYmVzIiwiYSI6ImNqN3ZsdW5xNjVhNDMzM21sY2Y4Y3d3OHQifQ.5Z4dZGEYlOH2-ToSNskghg';
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/satellite-v9',
  // center: [34.6857, 2.1540],
  // zoom: 9
});
map.addControl(new mapboxgl.NavigationControl());

function init() {
  runQuery([{ $unwind: '$species' }]).then(data => {
    const bundle = processData(data);

    map.addSource('animals', {
      type: 'geojson',
      data: {
        'type': 'FeatureCollection',
        'features': bundle.geoData
      }
    });
    console.log('added source', bundle.geoData);
    map.fitBounds([
      [bundle.minLng, bundle.minLat],
      [bundle.maxLng, bundle.maxLat]
    ]);
  
    map.addLayer({
      id: 'clusters',
      type: 'circle',
      source: 'animals',
      paint: {
          'circle-color': [
            'interpolate', ['linear'], ['get', 'timestamp'],
            bundle.minTimestamp, '#00aa00',
            bundle.maxTimestamp, '#aaffaa'
          ],
          // 'circle-color': '#aaffaa',
          'circle-opacity': [
            'interpolate', ['linear'], ['get', 'timestamp'],
            bundle.minTimestamp, 0.5,
            bundle.maxTimestamp, 1
          ],
          'circle-radius': [
            'interpolate', ['linear'], ['zoom'],
            1, 1,
            12, 10
          ]
      }
    });

    updateFilters(bundle);
    registerFilters(map);
    createChart(data);
  });  
}

map.on('load', init);


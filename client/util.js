const URL = process.env.NODE_ENV === 'production' ? 'https://serengeti-explorer.herokuapp.com' : 'http://localhost:3000';

export function runQuery(query) {
  return fetch(`${URL}/query`, {
    method: 'POST',
    body: JSON.stringify(query),
    headers: {
      'Content-Type': 'application/json',
      'Accepts': 'application/json'
    }
  }).then(resp => resp.json());
}

export function toGeoJSON(data) {
  return data.map(item => ({
    type: 'feature',
    geometry: item.geolocation,
    properties: {
      ...item
    }
  }));
}

export function processData(data) {
  let minTimestamp = Infinity;
  let maxTimestamp = 0;
  let minLng = Infinity;
  let maxLng = 0;
  let minLat = Infinity;
  let maxLat = 0;
  const geoData = [];

  data.forEach((item) => {
    const [lng, lat] = item.geolocation.coordinates;
    if (lng > maxLng) {
      maxLng = lng;
    }
    if (lng < minLng) {
      minLng = lng;
    }
    if (lat > maxLat) {
      maxLat = lat;
    }
    if (lat < minLat) {
      minLat = lat;
    }
    if (item.timestamp > maxTimestamp) {
      maxTimestamp = item.timestamp;
    }
    if (item.timestamp < minTimestamp) {
      minTimestamp = item.timestamp;
    }

    const geoItem = {
      type: 'feature',
      geometry: item.geolocation,
      properties: {
        ...item
      }
    };

    geoData.push(geoItem);
  });

  return {
    geoData,
    minLng,
    maxLng,
    minLat,
    maxLat,
    minTimestamp,
    maxTimestamp
  };
}

export function updateMap(map, data) {
  const bundle = processData(data);
    // map.setCenter(geoData[0].geometry.coordinates);
  console.log('new bundle', bundle);

  map.getSource('animals').setData({
    'type': 'FeatureCollection',
    features: bundle.geoData
  });
    console.log('added source', bundle.geoData);
  map.fitBounds([
    [bundle.minLng, bundle.minLat],
    [bundle.maxLng, bundle.maxLat]
  ]);
}

export function createChart(data) {
  const vlSpec = {
    $schema: 'https://vega.github.io/schema/vega-lite/v4.json',
    data: {
      values: data
    },
    width: 650,
    height: 500,
    mark: 'bar',
    encoding: {
      x: {field: 'species.name', type: 'nominal', axis: { title: 'Species' } },
      y: {
        aggregate: 'count',
        field: '*',
        type: 'quantitative',
        axis: {
          title: 'Number of sightings'
        }
      }
    }
  };

  vegaEmbed('#chart', vlSpec);
}

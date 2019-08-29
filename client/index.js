const URL = 'http://localhost:3000';

function runQuery(query) {
  return fetch(`${URL}/query`, {
    method: 'POST',
    body: JSON.stringify(query)
  }).then(resp => resp.json());
}

function toGeoJSON(data) {
  return data.map(item => ({
    type: 'feature',
    geometry: item.geolocation,
    properties: {
      ...item
    }
  }));
}

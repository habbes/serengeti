const URL = process.env.NODE_ENV === 'production' ? 'https://serengeti-explorer.herokuapp.com' : 'http://localhost:3000';

export function runQuery(query) {
  return fetch(`${URL}/query`, {
    method: 'POST',
    body: JSON.stringify(query)
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

import { runQuery, processData, updateMap } from './util';
import { SPECIES } from './species';

export function updateFilters({ minTimestamp, maxTimestamp }) {
  const minDate = new Date(minTimestamp).toISOString().split('T')[0];
  const maxDate = new Date(maxTimestamp).toISOString().split('T')[0];

  const fromDate = document.querySelector('#dateFrom');
  const toDate = document.querySelector('#dateTo');

  fromDate.value = minDate;
  toDate.value = maxDate;
}

export function createSpeciesFilters (){
  SPECIES.forEach((name) => {
    const wrapper = document.createElement('div');
    const label = document.createElement('label');
    label.textContent = name;
    label.classList.add('filter-label');
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.dataset.field = 'species';
    input.dataset.name = name;
    input.className = 'filter-input';

    wrapper.appendChild(label);
    wrapper.appendChild(input);

    document.querySelector('#speciesInputs').appendChild(wrapper);
  });
}

export function registerFilters (map) {
  createSpeciesFilters();
  const inputs = document.querySelectorAll('.filter-input');
  console.log('inputs', inputs);
  inputs.forEach((input) => {
    input.addEventListener('change', () => queryAndUpdate(map));
  });
}

export function generateQuery () {
  const inputs = document.querySelectorAll('.filter-input');
  console.log('inputs', inputs);
  const query = { };
  const species = [];
  inputs.forEach((input) => {
    const field = input.dataset.field;
    const rawValue = input.value;
    let value;
    switch (field) {
      case 'dateFrom':
        value = new Date(rawValue).getTime();
        query.timestamp = { ...query.timestamp, $gte: value };
        break;
      case 'dateTo':
        value = new Date(rawValue).getTime();
        query.timestamp = { ...query.timestamp, $lte: value };
        break;
      case 'species': 
        if (input.checked) {
          species.push(input.dataset.name);
        }
        break;
    }
  });
  if (species.length) {
    query['species.name'] = { $in: species };
  }
  return [ { $match: query } ];
}

export function queryAndUpdate(map) {
  const query = generateQuery();
  runQuery(query).then((data) => {
    console.log('SOURCE', data);
    updateMap(map, data);
    console.log('map updated');
  });
}
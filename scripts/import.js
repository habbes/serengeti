const config = require('../config');
const mongodb = require('mongodb');
const UtmConverter = require('utm-latlng');
const utmConverter = new UtmConverter();

const rawData = require('../data/data.json');

function processData(rawData) {
    return rawData.map((row) => {
        const latLng = utmConverter.convertUtmToLatLng(row.location_x, row.location_y, 36, 'S');
        const date = new Date(row.datetime);
        return {
            ...row,
            datetime: date,
            timestamp: date.getTime(),
            geolocation: {
                type: 'Point',
                coordinates: [latLng.lng, latLng.lat]
            }
        };
    });
}

async function importData () {
    const client = await mongodb.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    const db = client.db();
    console.log('Clearing existing data...');
    await db.createCollection(config.COLLECTION);
    await db.dropCollection(config.COLLECTION);

    console.log('Processing data...');
    const data = processData(rawData);
    
    console.log('Importing data...');
    await db.collection(config.COLLECTION).insertMany(data);
    console.log('Data import complete.');
    process.exit(0);
}

importData();

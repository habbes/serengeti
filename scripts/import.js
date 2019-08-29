const config = require('../config');
const mongodb = require('mongodb');

const rawData = require('../data/data.json');

async function importData () {
    const client = await mongodb.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Importing data...');
    const db = client.db();
    // first clear all data
    await db.createCollection(config.COLLECTION);
    await db.dropCollection(config.COLLECTION);
    // pre-process data
    const data = rawData.map((row) => ({
        ...row,
        datetime: new Date(row.datetime)
    }));
    // import
    await db.collection(config.COLLECTION).insertMany(data);
    console.log('Data import complete.');
    process.exit(0);
}

importData();

const config = require('../config');
const mongodb = require('mongodb');

const data = require('../data/data.json');

async function importData () {
    const client = await mongodb.connect(config.MONGODB_URI);
    console.log('Importing data...');
    await client.db().collection(config.COLLECTION).insertMany(data);
    console.log('Data import complete.');
    process.exit(0);
}

importData();

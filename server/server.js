const config = require('../config');
const path = require('path');
const mongodb = require('mongodb');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

let _dbClient;

async function getDb () {
    if (!_dbClient) {
        _dbClient = await mongodb.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    }
    return _dbClient.db();
}

// this doesn't seem to work, getting 404's when requesting static files
app.use(express.static(path.join(__dirname, 'client')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.all('/status', (req, res) => {
    res.status(200).json({
        status: 'ok',
        uptime: process.uptime()
    });
});

app.post('/query', async (req, res) => {
    const query = req.body;
    console.log('query', query);
    try {
        const db = await getDb();
        const result = await db.collection(config.COLLECTION).aggregate(query).toArray();
        res.status(200).json(result);
    } catch (e) {
        res.status(400).json({
            message: e.message
        });
    }
});


app.listen(config.PORT, () => {
    console.log(`App listening on port ${config.PORT}`);
});

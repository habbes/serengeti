# Serengeti Explorer

Explore Snapshot Serengeti dataset. Deep Learning Indaba 2019 Hackathon. https://serengeti-explorer.web.app

## Installation

- Clone repo
- Start a mongodb server
- Install dependencies:
```
npm install
```
- Import data:
```
npm run import
```
This imports the data in `data/data.json` into the mongodb `serengeti` database in a collection called `events`.

You can override the default mongodb database and url by setting the `MONGODB_URI` env variable.

## Scripts:

- `npm run import`: imports the data from `data/
- `npm start`: starts the server on port 3000
- `npm run client-dev`: starts client server on port 1234, watches for changes.
- `npm run client-build`: builds client bundle
- `npm run deploy`: deploys server to heroku and client to firebase hosting

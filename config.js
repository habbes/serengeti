require('dotenv').config();

exports.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/serengeti';
exports.COLLECTION = 'events';
exports.PORT = process.env.PORT || 3000;

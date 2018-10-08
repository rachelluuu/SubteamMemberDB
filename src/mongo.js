/*jshint node: true, esversion: 6*/
'use strict';
const mongoose = require('mongoose');
const URL = process.env.MONGODB_URL || "mongodb://mongo/nodeappdb";

setTimeout(() => {
  console.log("connecting to database at: " + URL);
  mongoose.connect(URL, { useMongoClient: true });
}, 1000);

const db = mongoose.connection;

mongoose.Promise = global.Promise;

db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function callback() {
  console.log('Connected with database at: ' + URL);
});

exports.db = db;

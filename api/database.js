const mongoose = require('mongoose');
require('dotenv').config({path: '../.env'});
const URI = process.env.MONGO_DB_CONNECTION_STRING;

mongoose.connect(URI, {useNewUrlParser: true, useUnifiedTopology: true})
  .then(db => console.log('Successfully connected to the DB.'))
  .catch(err => console.log(err));

module.exports = mongoose;

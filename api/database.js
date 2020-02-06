const mongoose = require('mongoose');

const URI = 'DB_URI_HERE';

mongoose.connect(URI, {useNewUrlParser: true, useUnifiedTopology: true})
  .then(db => console.log('Successfully connected to the DB.'))
  .catch(err => console.log(err));

module.exports = mongoose;

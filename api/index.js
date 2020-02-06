const express = require('express');
const app = express();

const {mongoose} = require('./database');

// Settings
app.set('port', process.env.PORT || 3000);

// Headers
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

// Middlewares
app.use(express.json());

// Routes
app.use('/api/users', require('./routes/user.route'));

// Starting the server
app.listen(app.get('port'), () => {
  console.log('Server started on port 3000.');
});

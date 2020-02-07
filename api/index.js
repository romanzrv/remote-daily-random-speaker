const express = require('express');
const cors = require('cors')
const app = express();

const {mongoose} = require('./database');

// Settings
app.set('port', process.env.PORT || 3000);

// Headers
app.use(cors());

// Middlewares
app.use(express.json());

// Routes
app.use('/api/users', require('./routes/user.route'));
app.use('/api/meeting', require('./routes/meeting.route'));

// Starting the server
app.listen(app.get('port'), () => {
  console.log('Server started on port 3000.');
});

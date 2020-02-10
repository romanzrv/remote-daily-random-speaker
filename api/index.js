const express = require('express');
const cors = require('cors');
const socket = require('socket.io');
const socketController = require('./socket');
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

// Serving static content
app.use(express.static('public'));

// Starting the server
const server = app.listen(app.get('port'), () => {
  console.log('Server started on port 3000.');
});

// Starting the socket connection
socketController.startSocket(server);

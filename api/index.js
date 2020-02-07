const express = require('express');
const cors = require('cors');
const socket = require('socket.io');
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
const server = app.listen(app.get('port'), () => {
  console.log('Server started on port 3000.');
});

// Creating a socket events listener
const io = socket.listen(server);

io.sockets.on('connection', (socket) => {
  //socket.emit('test', {test: 'testing connection'});
  console.log('user connected to the socket');
  socket.on('disconnect', () => {
    console.log('user disconnected from the socket');
  })
});


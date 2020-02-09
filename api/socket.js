const socket = require('socket.io');
const userModel = require("./models/user.model");

const socketController = {};
const socketConnectedUsers = [];

socketController.startSocket = (server) => {
  const io = socket.listen(server);

  io.sockets.on('connection', (socket) => {
    socketController.getConnectedUserInfo(socket.handshake.query.userId).then((userProfileInfo) => {
      if (!socketController.isUserAlreadyConnected(socket.handshake.query.userId)) {
        socketConnectedUsers.push(JSON.parse(userProfileInfo));
        io.emit('connectedUsers', socketConnectedUsers);
      }
    });
    socket.on('disconnect', () => {
      socketController.removeDisconnectedUser(socket.handshake.query.userId);
      io.emit('connectedUsers', socketConnectedUsers);
    })
  });
};

socketController.getConnectedUserInfo = async (connectedUserId) => {
  const userData = await userModel.findById(connectedUserId);
  return JSON.stringify(userData);
};

socketController.removeDisconnectedUser = (userId) => {
  socketConnectedUsers.forEach((value, index, object) => {
    if (value['_id'] === userId) object.splice(index, 1);
  });
};

socketController.isUserAlreadyConnected = (userId) => {
  let isConnected = false;
  socketConnectedUsers.forEach((value) => {
    if (value._id === userId) isConnected = true;
  });
  return isConnected;
};

module.exports = socketController;

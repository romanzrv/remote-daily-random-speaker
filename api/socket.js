const socket = require('socket.io');
const userModel = require("./models/user.model");

const socketController = {};
socketController.dailySpeakers = [];

let socketConnectedUsers = [];
let finishedSpeakers = [];
let isMeetingEventStarted = false;

socketController.startSocket = (server) => {
  const io = socket.listen(server);

  io.sockets.on('connection', (socket) => {
    socketController.getConnectedUserInfo(socket.handshake.query.userId).then((userProfileInfo) => {
      let parsedUserProfile = JSON.parse(userProfileInfo);
      if (!socketController.isUserAlreadyConnected(socket.handshake.query.userId)) {
        socketController.checkIfHostUser(parsedUserProfile);
        socketConnectedUsers.push(parsedUserProfile);
        io.emit('connectedUsers', socketConnectedUsers);
      }
    });

    socket.on('disconnect', () => {
      socketController.removeDisconnectedUser(socket.handshake.query.userId);
      io.emit('connectedUsers', socketConnectedUsers);
    });

    socket.on('disconnectCurrentUser', () => {
      socketController.removeDisconnectedUser(socket.handshake.query.userId);
      socket.disconnect();
      io.emit('connectedUsers', socketConnectedUsers);
    });

    socket.on('startDaily', (receivedData) => {
      socketController.dailySpeakers = socketConnectedUsers;
      isMeetingEventStarted = true;
      io.emit('dailyStatus', true);
      io.emit('nextSpeaker', socketController.getRandomSpeaker());
    });

    socket.on('nextSpeaker', (userId) => {
      socketController.dailySpeakers = socketController.finishSpeaker(userId);
      if (socketController.checkIfMeetingIsDone(socketController.dailySpeakers)) {
        io.emit('dailyStatus', 'finished');
        socketController.finishMeeting();
      } else {
        io.emit('nextSpeaker', socketController.getRandomSpeaker());
      }
    });
  });
};

socketController.getConnectedUserInfo = async (connectedUserId) => {
  const userData = await userModel.findById(connectedUserId);
  return JSON.stringify(userData);
};

socketController.removeDisconnectedUser = (userId) => {
  socketConnectedUsers.forEach((value, index, object) => {
    if (value['_id'] === userId) {
      if (value.host) {
        delete value.host;
        object.splice(index, 1);
        socketController.addRandomHostUser();
      } else {
        object.splice(index, 1);
      }
    }
  });
};

socketController.isUserAlreadyConnected = (userId) => {
  let isConnected = false;
  socketConnectedUsers.forEach((value) => {
    if (value._id === userId) isConnected = true;
  });
  return isConnected;
};

socketController.checkIfHostUser = (userProfile) => {
  if (socketConnectedUsers.length === 0) {
    userProfile.host = true;
  }
};

socketController.addRandomHostUser = () => {
  if (socketConnectedUsers[0]) {
    socketConnectedUsers[0].host = true;
  }
};

socketController.finishSpeaker = (speakerId) => {
  finishedSpeakers.push(speakerId);
  socketController.dailySpeakers.forEach((value, index, object) => {
    if (value._id === speakerId) {
      object.splice(index, 1);
    }
  });
  return socketController.dailySpeakers;
};

socketController.getRandomSpeaker = () => {
  let randomArrayIndex = Math.floor(Math.random() * socketController.dailySpeakers.length) + 1;
  return socketController.dailySpeakers[randomArrayIndex - 1]._id;
};

socketController.checkIfMeetingIsDone = (dailyMeetingArray) => {
  return (dailyMeetingArray.length === 0);
};

socketController.finishMeeting = () => {
  socketConnectedUsers = [];
  finishedSpeakers = [];
};

module.exports = socketController;

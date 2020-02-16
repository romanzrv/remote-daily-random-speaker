const socket = require('socket.io');
const userModel = require("./models/user.model");

const socketController = {};
socketController.dailySpeakers = [];
socketController.isMeetingEventStarted = false;

let socketConnectedUsers = [];
let finishedSpeakers = [];
let currentSpeaker = '';
let isHostUserConnected = false;

socketController.startSocket = (server) => {
  const io = socket.listen(server, { pingTimeout: 40000000, pingInterval: 40000000 });

  io.sockets.on('connection', (socket) => {
    socketController.getConnectedUserInfo(socket.handshake.query.userId).then((userProfileInfo) => {
      let parsedUserProfile = JSON.parse(userProfileInfo);
      if (!socketController.isUserAlreadyConnected(socket.handshake.query.userId)) {
        socketController.checkIfHostUser(parsedUserProfile);
        socketConnectedUsers.push(parsedUserProfile);
        io.emit('dailyStatus', socketController.isMeetingEventStarted);
        if (socketController.isMeetingEventStarted) {
          if (!socketController.checkIfUserHasAlreadySpoken(parsedUserProfile['_id'])) {
            socketController.dailySpeakers.push(parsedUserProfile);
          }
        }
        io.emit('connectedUsers', socketConnectedUsers);
      } else {
        io.emit('connectionStatus', {userId: socket.handshake.query.userId, action: 'reconnect'});
      }
    });

    socket.on('disconnect', () => {
      socketController.removeDisconnectedUser(socket.handshake.query.userId);
      if (currentSpeaker === socket.handshake.query.userId && socketController.dailySpeakers.length > 0) {
        io.emit('nextSpeaker', socketController.getRandomSpeaker());
      }
      io.emit('connectedUsers', socketConnectedUsers);
    });

    socket.on('disconnectCurrentUser', () => {
      socketController.removeDisconnectedUser(socket.handshake.query.userId);
      socket.disconnect();
      io.emit('connectedUsers', socketConnectedUsers);
    });

    socket.on('startDaily', (receivedData) => {
      socketController.dailySpeakers = JSON.parse(JSON.stringify(socketConnectedUsers))
      socketController.isMeetingEventStarted = true;
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

    socket.on('currentSpeaker', () => {
      io.emit('nextSpeaker', currentSpeaker);
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
        isHostUserConnected = false;
        object.splice(index, 1);
        socketController.addRandomHostUser();
      } else {
        object.splice(index, 1);
      }
    }
  });

  if (socketController.isMeetingEventStarted) {
    socketController.dailySpeakers = socketController.dailySpeakers.filter((item) => item['_id'] !== userId);
  }
};

socketController.isUserAlreadyConnected = (userId) => {
  return (socketConnectedUsers.filter((item) => item._id === userId).length > 0);
};

socketController.checkIfHostUser = (userProfile) => {
  if (!isHostUserConnected) {
    if (!socketConnectedUsers.filter((item) => item.host).length > 0) {
      userProfile.host = true;
      isHostUserConnected = true;
    }
  }
};

socketController.addRandomHostUser = () => {
  if (!isHostUserConnected) {
    if (socketConnectedUsers[0]) {
      socketConnectedUsers[0].host = true;
      isHostUserConnected = true;
    }
  }
};

socketController.finishSpeaker = (speakerId) => {
  finishedSpeakers.push(speakerId);
  socketController.dailySpeakers = socketController.dailySpeakers.filter((item) => item._id !== speakerId);
  return socketController.dailySpeakers;
};

socketController.getRandomSpeaker = () => {
  let randomArrayIndex = Math.floor(Math.random() * socketController.dailySpeakers.length) + 1;
  currentSpeaker = socketController.dailySpeakers[randomArrayIndex - 1]._id;
  return currentSpeaker;
};

socketController.checkIfMeetingIsDone = (dailyMeetingArray) => {
  return (dailyMeetingArray.length === 0);
};

socketController.finishMeeting = () => {
  finishedSpeakers = [];
  socketConnectedUsers = [];
  socketController.dailySpeakers = [];
  socketController.isMeetingEventStarted = false;
  isHostUserConnected = false;
  currentSpeaker = '';
};

socketController.checkIfUserHasAlreadySpoken = (userId) => {
  return (finishedSpeakers.filter((item) => item === userId).length > 0);
};

module.exports = socketController;

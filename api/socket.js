const socket = require('socket.io');
const userModel = require("./models/user.model");

let dailySpeakers = [];
let isMeetingEventStarted = false;
let socketConnectedUsers = [];
let finishedSpeakers = [];
let currentSpeaker = '';
let isHostUserConnected = false;

startSocket = (server) => {
  const io = socket.listen(server, { pingTimeout: 40000000, pingInterval: 40000000 });

  io.sockets.on('connection', (socket) => {
    createNewUserConnection(socket, io);

    socket.on('disconnect', () => {
      closeExistingConnection(socket, io);
    });

    socket.on('disconnectCurrentUser', () => {
      closeExistingUserConnection(socket, io);
    });

    socket.on('startDaily', () => {
      startDailyMeeting(socket, io);
    });

    socket.on('nextSpeaker', (userId) => {
      getNextSpeaker(socket, io, userId)
    });

    socket.on('currentSpeaker', () => {
      getCurrentSpeaker(io);
    });
  });
};

getConnectedUserInfo = async (connectedUserId) => {
  const userData = await userModel.findById(connectedUserId);
  return JSON.parse(JSON.stringify(userData));
};

removeDisconnectedUser = (userId) => {
  socketConnectedUsers.forEach((value, index, object) => {
    if (value['_id'] === userId) {
      if (value.host) {
        delete value.host;
        isHostUserConnected = false;
        object.splice(index, 1);
        addRandomHostUser();
      } else {
        object.splice(index, 1);
      }
    }
  });

  if (isMeetingEventStarted) {
    dailySpeakers = dailySpeakers.filter((item) => item['_id'] !== userId);
  }
};

isUserAlreadyConnected = (userId) => {
  return (socketConnectedUsers.filter((item) => item._id === userId).length > 0);
};

checkIfHostUser = (userProfile) => {
  if (!isHostUserConnected) {
    if (!socketConnectedUsers.filter((item) => item.host).length > 0) {
      userProfile.host = true;
      isHostUserConnected = true;
    }
  }
};

addRandomHostUser = () => {
  if (!isHostUserConnected) {
    if (socketConnectedUsers[0]) {
      socketConnectedUsers[0].host = true;
      isHostUserConnected = true;
    }
  }
};

finishSpeaker = (speakerId) => {
  finishedSpeakers.push(speakerId);
  dailySpeakers = dailySpeakers.filter((item) => item._id !== speakerId);
  return dailySpeakers;
};

getRandomSpeaker = () => {
  let randomArrayIndex = Math.floor(Math.random() * dailySpeakers.length) + 1;
  currentSpeaker = dailySpeakers[randomArrayIndex - 1]._id;
  return currentSpeaker;
};

checkIfMeetingIsDone = (dailyMeetingArray) => {
  return (dailyMeetingArray.length === 0);
};

finishMeeting = () => {
  finishedSpeakers = [];
  socketConnectedUsers = [];
  dailySpeakers = [];
  isMeetingEventStarted = false;
  isHostUserConnected = false;
  currentSpeaker = '';
};

checkIfUserHasAlreadySpoken = (userId) => {
  return (finishedSpeakers.filter((item) => item === userId).length > 0);
};

createNewUserConnection = (socket, io) => {
  getConnectedUserInfo(socket.handshake.query.userId).then((userProfileInfo) => {
    let userProfile = {...userProfileInfo};
    if (!isUserAlreadyConnected(socket.handshake.query.userId)) {
      checkIfHostUser(userProfile);
      socketConnectedUsers.push(userProfile);
      io.emit('dailyStatus', isMeetingEventStarted);
      if (isMeetingEventStarted) {
        if (!checkIfUserHasAlreadySpoken(userProfile['_id'])) {
          dailySpeakers.push(userProfile);
        }
      }
      io.emit('connectedUsers', socketConnectedUsers);
    } else {
      io.emit('connectionStatus', {userId: socket.handshake.query.userId, action: 'reconnect'});
    }
  });
};

closeExistingConnection = (socket, io) => {
  removeDisconnectedUser(socket.handshake.query.userId);
  if (currentSpeaker === socket.handshake.query.userId && dailySpeakers.length > 0) {
    io.emit('nextSpeaker', getRandomSpeaker());
  }
  io.emit('connectedUsers', socketConnectedUsers);
};

closeExistingUserConnection = (socket, io) => {
  removeDisconnectedUser(socket.handshake.query.userId);
  socket.disconnect();
  io.emit('connectedUsers', socketConnectedUsers);
};

startDailyMeeting = (socket, io) => {
  dailySpeakers = [...socketConnectedUsers];
  isMeetingEventStarted = true;
  io.emit('dailyStatus', true);
  io.emit('nextSpeaker', getRandomSpeaker());
};

getNextSpeaker = (socket, io, userId) => {
  dailySpeakers = finishSpeaker(userId);
  if (checkIfMeetingIsDone(dailySpeakers)) {
    io.emit('dailyStatus', 'finished');
    finishMeeting();
  } else {
    io.emit('nextSpeaker', getRandomSpeaker());
  }
};

getCurrentSpeaker = (io) => {
  io.emit('nextSpeaker', currentSpeaker);
};

exports.startSocket = startSocket;
exports.isUserAlreadyConnected = isUserAlreadyConnected;
exports.isMeetingEventStarted = isMeetingEventStarted;

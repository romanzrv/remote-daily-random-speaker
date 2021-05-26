const socket = require('socket.io');
const userModel = require("./models/user.model");

let dailySpeakers = [];
let isMeetingEventStarted = false;
let socketConnectedUsers = [];
let finishedSpeakers = [];
let currentSpeaker = '';
let isHostUserConnected = false;
let timerCounter = {seconds: 0, minutes: 0};
let timerEvent;
let io;

startSocket = (server) => {
  io = socket.listen(server, { pingTimeout: 40000000, pingInterval: 40000000 });

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

checkIfSpectatorUser = (userProfile, isSpectator) => {
  if (isSpectator === 'true') {
    userProfile.spectator = true;
  }
}

addRandomHostUser = () => {
  if (!isHostUserConnected) {
    if (socketConnectedUsers[0]) {
      socketConnectedUsers[0].host = true;
      isHostUserConnected = true;
    }
  }
};

finishSpeaker = (speakerId, io) => {
  finishedSpeakers.push(speakerId);
  socketConnectedUsers = socketConnectedUsers.map((item) => {
    if (item._id === speakerId) {
      item.hasSpoken = true;
    }
    return item;
  });
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
  resetTimer();
};

checkIfUserHasAlreadySpoken = (userId) => {
  return (finishedSpeakers.filter((item) => item === userId).length > 0);
};

createNewUserConnection = (socket, io) => {
  getConnectedUserInfo(socket.handshake.query.userId).then((userProfileInfo) => {
    let userProfile = {...userProfileInfo};
    if (!isUserAlreadyConnected(socket.handshake.query.userId)) {
      checkIfHostUser(userProfile);
      checkIfSpectatorUser(userProfile, socket.handshake.query.spectator);
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
  startTimer();
};

getNextSpeaker = (socket, io, userId) => {
  dailySpeakers = finishSpeaker(userId, io);
  io.emit('connectedUsers', socketConnectedUsers);
  resetTimer();
  if (checkIfMeetingIsDone(dailySpeakers)) {
    io.emit('dailyStatus', 'finished');
    finishMeeting();
  } else {
    io.emit('nextSpeaker', getRandomSpeaker());
    startTimer();
  }
};

getCurrentSpeaker = (io) => {
  io.emit('nextSpeaker', currentSpeaker);
};

getMeetingStatus = () => {
  return isMeetingEventStarted;
};

kickAllUsers = () => {
  finishMeeting();
  io.emit('kickAllUsers', true);
}

startTimer = () => {
  timerEvent = setInterval(incrementTimerAndNotify, 1000);
}

incrementTimerAndNotify = () => {
  if (timerCounter.seconds === 59) {
    timerCounter.minutes++;
    timerCounter.seconds = 0;
  } else {
    timerCounter.seconds++;
  }
  io.emit('timer', timerCounter);
}

resetTimer = () => {
  clearInterval(timerEvent);
  timerCounter.seconds = 0;
  timerCounter.minutes = 0;
}

exports.startSocket = startSocket;
exports.isUserAlreadyConnected = isUserAlreadyConnected;
exports.getMeetingStatus = getMeetingStatus;
exports.kickAllUsers = kickAllUsers;

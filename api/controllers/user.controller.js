// User database model
const UserModel = require('../models/user.model');

// Socket controller
const socketIoController = require('../socket');

// User controller object
const userController = {};

userController.createUser = async (req, res) => {
  const newUser = new UserModel(req.body);

  try {
    await newUser.save();
    res.status(201).json({status: 201, message: 'User successfully created.'});
  } catch (e) {
    res.status(400).json({status: 400, message: 'Operation cannot be executed.'});
  }
};

userController.getUser = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id);
    res.status(201).json(user);
  } catch (e) {
    res.status(400).json({status: 400, message: 'Operation cannot be executed.'});
  }
};

userController.getUsers = async (req, res) => {
  try {
    const users = await UserModel.find();
    res.status(201).json(users);
  } catch (e) {
    res.status(400).json({status: 400, message: 'Operation cannot be executed.'});
  }
};

userController.checkIfUserAlreadyConnectedToDaily = (req, res) => {
  try {
    let isUserConnected = socketIoController.isUserAlreadyConnected(req.params.id);
    res.status(201).json(isUserConnected);
  } catch (e) {
    res.status(400).json({status: 400, message: 'Operation cannot be executed.'});
  }
};

userController.checkIfMeetingStarted = (req, res) => {
  try {
    let isMeetingStarted = socketIoController.getMeetingStatus();
    res.status(201).json(isMeetingStarted);
  } catch (e) {
    res.status(400).json({status: 400, message: 'Operation cannot be executed ddd.'});
  }
};

userController.kickAllUsers = (req, res) => {
  socketIoController.kickAllUsers();
  res.status(201).json({status: 201, message: 'Users successfully kicked'});
}

module.exports = userController;

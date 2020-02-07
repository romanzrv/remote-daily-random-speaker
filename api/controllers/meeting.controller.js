// User database model
const MeetingModel = require('../models/meeting.model');

// User controller object
const userModel = require('../models/user.model');

// Meeting controller object
const meetingController = {};

meetingController.joinUserToTheDaily = async (req, res) => {
  const newDailyUser = new MeetingModel(req.body);

  try {
    await newDailyUser.save();
    res.status(201).json({status: 201, message: 'User successfully joined to the daily.'});
  } catch (e) {
    res.status(400).json({status: 400, message: 'Operation cannot be executed.'});
  }
};

meetingController.removeUserFromTheDaily = async (req, res) => {
  const userIdToRemove = req.params.id;

  try {
    await MeetingModel.findOneAndDelete({userId: userIdToRemove});
    res.status(201).json({status: 201, message: `User with id: ${userIdToRemove} successfully removed from the daily.`});
  } catch (e) {
    res.status(400).json({status: 400, message: 'Operation cannot be executed.'});
  }
};

meetingController.getDailyUsers = async (req, res) => {
  try {
    const dailyUsers = await MeetingModel.find();
    const usersData = [];
    for (const value of dailyUsers) {
      let userObject = await userModel.findById(value.userId);
      usersData.push(userObject);
    }
    res.status(201).json({usersData});
  } catch (e) {
    res.status(400).json({status: 400, message: 'Operation cannot be executed.', trace: e.stack});
  }
};

module.exports = meetingController;

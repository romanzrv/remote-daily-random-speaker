const express = require('express');
const router = express.Router();

const meetingController = require('../controllers/meeting.controller');

router.get('/', meetingController.getDailyUsers);
router.post('/', meetingController.joinUserToTheDaily);
router.delete('/:id', meetingController.removeUserFromTheDaily);

module.exports = router;

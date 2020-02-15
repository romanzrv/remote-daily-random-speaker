const express = require('express');
const router = express.Router();

const userController = require('../controllers/user.controller');

router.get('/:id', userController.getUser);
router.get('/connected/:id', userController.checkIfUserAlreadyConnectedToDaily);
router.get('/meeting/started/', userController.checkIfMeetingStarted);
router.get('/', userController.getUsers);
router.post('/', userController.createUser);

module.exports = router;

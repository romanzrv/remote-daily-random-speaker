var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
  name: {type: String, required: true},
  surname: {type: String, required: true},
  nickname: {type: String, required: true},
});

const user = mongoose.model('User', UserSchema);

module.exports = user;

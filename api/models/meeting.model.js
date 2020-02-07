var mongoose = require('mongoose');

var MeetingSchema = new mongoose.Schema({
  userId: {type: String, required: true}
});

const meeting = mongoose.model('Meeting', MeetingSchema);

module.exports = meeting;

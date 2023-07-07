const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const user = new Schema({
  nickname: {
    required: true,
    type: String,
    unique: true
  },
  email: {
    required: true,
    type: String,
    unique: true
  },
  gender: {
    required: true,
    type: Boolean,
  },
  profile_image: {
    required: true,
    type: String
  },
  rate: {
    required: true,
    type: Number,
    default: 0
  },
  music_genre: {
    required: true,
    type: String
  },
});


const User = mongoose.model('User', user);
module.exports = {
    User
}
const mongoose = require('mongoose');
const { Schema } = require('mongoose');
const dayjs = require('dayjs');
const timezone = require('dayjs/plugin/timezone');
const utc = require('dayjs/plugin/utc');;
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('Asia/Seoul');

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
  createdAt: {
    type: Date,
    default: dayjs().tz().add(9, 'hour').format()
  },
  updatedAt: {
    type: Date,
    default: dayjs().tz().add(9, 'hour').format()
  }
});

const karaoke = new Schema({
  placeId: {
    required: true,
    type: String,
    unique: true
  },
  name: {
    required: true,
    type: String,
  },
  address: {
    required: true,
    type: String,
  },
  roadAddress: {
    required: true,
    type: String
  },
  phone: {
    type: String
  },
  url: {
    type: String
  },
  longitude: {
    type: String,
    required: true
  },
  latitude: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: dayjs().tz().add(9, 'hour').format()
  },
  updatedAt: {
    type: Date,
    default: dayjs().tz().add(9, 'hour').format()
  }
});

const Post = new Schema({
  

}, {
  timestamps: { createdAt: true, updatedAt: false }
});


const User = mongoose.model('User', user);
const Karaoke = mongoose.model("Karaoke", karaoke);
module.exports = {
    User,
    Karaoke
}
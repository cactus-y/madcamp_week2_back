const express = require('express');
const router = express.Router();

const test = require("./test");
const user = require('./user');
const auth = require('./auth');
const image = require('./image');
const karaoke = require('./karaoke');
const board = require('./board');
const guest = require('./guest');

router.use('/', test);
router.use('/user', user);
router.use('/auth', auth);
router.use('/image', image);
router.use('/karaoke', karaoke);
router.use('/board', board);
router.use('/guest', guest);


module.exports = router;
const express = require('express');
const router = express.Router();

const test = require("./test");
const user = require('./user');
const auth = require('./auth');

router.use('/', test);
router.use('/user', user);
router.use('/auth', auth);

module.exports = router;
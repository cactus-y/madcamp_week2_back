const express = require('express');
const router = express.Router();

const test = require("./test");
const user = require('./user');

router.use('/', test);
router.use('/user', user);

module.exports = router;
const express = require('express');
const { User } = require('../database/schema');
const { createUser } = require('../database/user');
const router = express.Router();

router.get('/', async (req, res, next) => {
    res.status(200).json("Success to get user");
})

router.post('/', async (req, res, next)  => {
    // TODO: 이메일, 닉네임 중복 확인
    try {
        console.log("before creating user");
        const user = await createUser(req.body);
        console.log("after creating user");
        res.status(201).json({
            ok: true,
            user: user,
            message: 'User created'
        })
    } catch (e) {
        res.status(500).json({
            ok: false,
            message: 'Failed to create User'
        })
    }
});


module.exports = router;
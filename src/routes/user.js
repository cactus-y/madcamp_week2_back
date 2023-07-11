const express = require('express');
const jwt = require("jsonwebtoken");
const checkAccessToken = require("../middleware/checkAccessToken")
const { createUser, findUserWithEmail, findUserWithNickname, findUserWithId, updateUser } = require('../database/user');
const uploadImage = require('../middleware/imageMiddleware');
const { getImageUrl, deleteImage } = require('../utils/image');
const { Device } = require('../database/schema');
const router = express.Router();
require("dotenv").config();

const { SECRET_KEY, ISSUER } = process.env;

router.get('/', checkAccessToken(true), async (req, res) => {
    try {
        const user = await findUserWithId(req.user.id);
        res.status(200).json({
            success: true,
            user
        });
    }
    catch(error) {
        console.log(error);
        res.status(400).json({
            success: false
        })
    }
})

router.post('/device', checkAccessToken(true), async (req, res) => {
    try {
        await Device.create({
            user_id: req.user.id,
            device_token: req.body.deviceToken
        })
        return res.status(200).json({
            success: true
        })
    }
    catch(e) {
        console.log(e);
        return res.status(400).json({
            success: false
        })
    }
})

router.patch('/device', checkAccessToken(true), async (req, res) => {
    try {
        await Device.findOneAndUpdate({ user_id: req.user.id }, { device_token: req.body.deviceToken })
        return res.status(200).json({
            success: true
        })
    }
    catch(e) {
        return res.status(400).json({
            success: false
        })
    }
})

router.post('/', uploadImage.single("file"), async (req, res)  => {
    console.log(req);
    const data = JSON.parse(req.body.data);
    try {
        if (await findUserWithEmail(data.email)) {
            return res.status(400).json({
                success: false,
                message: '중복된 이메일입니다.'
            })
        }
        if (await findUserWithNickname(data.nickname)) {
            return res.status(400).json({
                success: false,
                message: '중복된 닉네임입니다.'
            })
        }
        const user = await createUser({
            ...data,
            profile_image: req.file ? req.file.filename : '',
            music_genre: JSON.stringify(data.musicGenre)
        });
        const payload = {
            type: 'JWT',
            userId: user.id,
            gender: user.gender,
            email: user.email,
            nickname: user.nickname,
            musicGenre: JSON.parse(user.music_genre),
            profileImage: getImageUrl(user.profile_image)
        };
        const token = jwt.sign(payload, SECRET_KEY, {
            issuer: ISSUER,
        });
        return res.status(201).json({
            success: true,
            token,
            user: {
                id: user.id,
                email: user.email,
                nickname: user.nickname,
                gender: user.gender,
                rate: user.rate,
                musicGenre: JSON.parse(user.music_genre),
                profileImage: getImageUrl(user.profile_image),
                createdAt: user.created_at.toISOString().split('.')[0]
            },
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            success: false,
            message: 'Failed to create User'
        })
    }
});



router.patch('/:id', 
    async (req, res, next) => {
        console.log(req);
        let user = await findUserWithId(req.params.id);
        if (!user) {
            return res.status(400).json({
                success: false,
                message: '사용자가 존재하지 않습니다.'
            })
        }
        else {
            next();
        }
    }, 
    uploadImage.single('file'), 
    async (req, res) => {
        try {
            let user = await findUserWithId(req.params.id);
            const previousImageFilename = user.profileImage;
            const data = JSON.parse(req.body.data);
            user = await findUserWithEmail(data.email)
            if (user && user.id != req.params.id) {
                return res.status(400).json({
                    success: false,
                    message: '중복된 이메일입니다.'
                })
            }
            user = await findUserWithNickname(data.nickname)
            if (user && user.id != req.params.id) {
                return res.status(400).json({
                    success: false,
                    message: '중복된 닉네임입니다.'
                })
            }
            const newUser = await updateUser({
                id: req.params.id,
                data: {
                    ...data,
                    music_genre: JSON.stringify(data.music_genre),
                    profile_image: req.file.filename
                }
            });
            deleteImage(previousImageFilename);
            return res.status(201).json({
                success: true,
                user: {
                    id: newUser.id,
                    email: newUser.email,
                    nickname: newUser.nickname,
                    gender: newUser.gender,
                    rate: newUser.rate,
                    musicGenre: JSON.parse(newUser.music_genre),
                    profileImage: getImageUrl(newUser.profile_image),
                    createdAt: newUser.created_at.toISOString().split('.')[0]
                },
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                success: false,
                error
            })
        }
    }
)


module.exports = router;
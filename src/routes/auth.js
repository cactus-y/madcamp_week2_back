const { OAuth2Client } = require('google-auth-library');
const { findUserWithEmail } = require('../database/user');
const { getImageUrl } = require('../utils/image');
const express = require('express');
const jwt = require("jsonwebtoken");
require("dotenv").config();

const { SECRET_KEY, CLIENT_ID, ISSUER } = process.env;


const router = express.Router();
// body: idToken, email
router.post('/login/google', async (req, res, next) => {
    try {
        const user = await findUserWithEmail(req.body.email);
        if (user) {
            const payload = {
                type: 'JWT',
                userId: user.id,
            };
            const token = jwt.sign(payload, SECRET_KEY, {
                issuer: ISSUER,
            });
            return res.status(200).json({ 
                success: true, 
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    nickname: user.nickname,
                    gender: user.gender,
                    rate: user.rate,
                    musicGenre: JSON.parse(user.music_genre),
                    profileImage: user.profile_image ? getImageUrl(user.profile_image): null,
                    createdAt: user.created_at.toISOString().split('.')[0]
                }
            });
        }
        else {
            const client = new OAuth2Client(CLIENT_ID);
            const ticket = await client.verifyIdToken({
                idToken: req.body.idToken,
                audience: CLIENT_ID
            })
            const payload = ticket.getPayload();
            // console.log(payload);
            return res.status(200).json({ 
                success: true,
                token: null,
                user: {
                    nickname: payload.name,
                    email: payload.email, 
                    profileImage: payload.picture 
                }
            });
        }
    }
    catch(error) {
        console.log(error);
        return res.status(400).json({ success: false, error });
    }
})

// router.post('/logout', (req, res, next) => {
    
// });



module.exports = router;
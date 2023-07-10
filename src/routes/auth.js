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
                nickname: user.nickname, 
                email: user.email, 
                profileImage: getImageUrl(user.profile_image)   
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
                nickname: payload.name,
                email: payload.email, 
                profileImage: payload.picture 
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
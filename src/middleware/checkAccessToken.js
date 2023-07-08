const jwt = require('jsonwebtoken');
const { findUserWithId } = require('../database/user');
require('dotenv').config();

const checkAccessToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (token) {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const user = await findUserWithId(decoded.userId);
        req.user = user;
        console.log(`user id : ${req.user.id}`);
        return next();
    }
    else if (!req.authNeeded) {
        return next();
    }
    else {
        return res.status(400).json({
            success: false,
            message: '토큰이 존재하지 않습니다.'
        })
    }
  } catch (error) {
    //유효시간 만료
    if (error.name === 'TokenExpiredError') {
      return res.status(419).json({
        success: false,
        message: '토큰이 만료되었습니다.',
        error,
      });
    }
    //비밀키 일치 오류
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: '유효하지 않은 토큰입니다',
        error,
      });
    }
  }
};

module.exports = checkAccessToken;
const express = require('express');
const fs = require('fs');
const { getImagePath } = require('../utils/image');
const router = express.Router();

router.get('/:filename', async (req, res) => {
    try {
        const path = getImagePath(req.params.filename);
        const data = fs.readFileSync(path);
        res.writeHead(200, { 'Content-Type': 'image/jpeg' });
        res.write(data);
        return res.end();
    } catch (error) {
        console.log(error.message);
        return res
        .status(400)
        .json({ success: false, message: '이미지 조회 실패', error });
    }
});

module.exports = router;
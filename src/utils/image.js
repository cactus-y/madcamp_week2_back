const fs = require('fs');
require('dotenv').config();

const getImageUrl = (filename) => filename ? process.env.BACKEND_BASE_URL + '/image/' + filename : null;
const getImagePath = (filename) => 'uploads/' + filename;
const deleteImage = (filename) => {
    fs.unlink(getImagePath(filename), (err) => {
        if (err) throw err;
        console.log('delete success');
    });
}

module.exports = {
    getImageUrl,
    getImagePath,
    deleteImage
};
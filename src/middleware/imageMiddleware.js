const multer = require("multer");
const path = require('path');

const limits = {
    fieldNameSize: 200, // 필드명 사이즈 최대값 (기본값 100bytes)
    filedSize: 1024 * 1024, // 필드 사이즈 값 설정 (기본값 1MB)
    fields: 2, // 파일 형식이 아닌 필드의 최대 개수 (기본 값 무제한)
    fileSize: 16777216, //multipart 형식 폼에서 최대 파일 사이즈(bytes) "16MB 설정" (기본 값 무제한)
    files: 1, //multipart 형식 폼에서 파일 필드 최대 개수 (기본 값 무제한)
};

const fileFilter = (req, file, callback) => {
    const typeArray = file.originalname.split('.');
    const fileType = typeArray[typeArray.length - 1]; // 이미지 확장자 추출
    //이미지 확장자 구분 검사
    if (fileType === 'jpg' || fileType === 'jpeg' || fileType === 'png' || fileType === 'webp') {
      callback(null, true);
    } else {
      return callback(
        { message: '*.jpg, *.jpeg, *.png 파일만 업로드가 가능합니다.' },
        false
      );
    }
};

//multer 미들웨어 설정
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // 파일 이름 설정
    },
});

const uploadImage = multer({
    storage: storage,
    dest: path.join(__dirname, '/uploads/'), // 이미지 업로드 경로
    limits: limits, // 이미지 업로드 제한 설정
    fileFilter: fileFilter, // 이미지 업로드 필터링 설정
});

module.exports = uploadImage;
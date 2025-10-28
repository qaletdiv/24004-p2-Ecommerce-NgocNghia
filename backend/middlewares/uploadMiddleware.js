const multer = require('multer');
const path = require('path');

const multerStorage = multer.diskStorage({
    destination :(req, file, callback) => {
        const tempPath = path.join(__dirname, "..", "images", "temp");
        callback(null, tempPath);
    },
    filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname (file.originalname);
        callback(null, `image-${uniqueSuffix}${ext}`);
    }
})

const multerFilter = (req, file, callback) => {
    if(file.mimetype.startsWith('image')) {
        callback(null, true);
    }
    else {
        callback (new Error('Not an image! Please upload only images.'), false);
    }
}

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
    limits : {
        fileSize: 5 * 1024 * 1024 /// 5MB
    }
})

exports.uploadSingleImage = (fieldName = 'image') => upload.single(fieldName);
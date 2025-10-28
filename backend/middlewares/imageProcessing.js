const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

exports.resizeImage = async (req, res, next) => {
    if (!req.file) {
        return next();
    }

    const imageTempFilePath = req.file.path;
    try {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
        const ext = '.jpeg'; ///Lấy phần đuôi hình (jpg, png,...)
        const finalFilename = `image-${uniqueSuffix}${ext}`;

        req.file.processedFilename = finalFilename;

        const finalDirectory = path.join(__dirname,"..", "images", "uploads");
        const finalFilePath = path.join(finalDirectory, finalFilename);

        await sharp(imageTempFilePath)
            .resize(1000) /// chiều rộng 1000px
            .toFormat('jpeg')
            .jpeg({ quality: 90 })
            .toFile(finalFilePath);

        /// Xoá file tạm
        fs.unlink(imageTempFilePath, (err) => {
            if (err) {
                console.error('Error deleting temp file:', err);
            }else {
                console.log('Temp file deleted successfully');
            }
        })
        next();
    }catch(error){
        console.error('Error processing image:', error);
        fs.unlinkSync(imageTempFilePath, (err) => {
            if (err) {
                console.error('Error deleting temp file after processing error:', err);
            }else {
                console.log('Temp file deleted successfully after processing error');
            }
        })
        next(error);
    }
}
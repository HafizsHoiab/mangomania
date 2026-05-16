const cloudinary = require('../config/cloudinary');
const sharp = require('sharp');

exports.uploadSingleImage = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No image provided' });

    const optimized = await sharp(req.file.buffer)
      .resize({ width: 800, withoutEnlargement: true })
      .jpeg({ quality: 85 })
      .toBuffer();

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: 'mangomania', resource_type: 'image' },
        (error, result) => error ? reject(error) : resolve(result)
      ).end(optimized);
    });

    res.json({ success: true, data: { url: result.secure_url, public_id: result.public_id } });
  } catch (error) {
    next(error);
  }
};

exports.uploadMultipleImages = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) return res.status(400).json({ success: false, message: 'No images provided' });

    const uploads = await Promise.all(req.files.map(async (file) => {
      const optimized = await sharp(file.buffer)
        .resize({ width: 800, withoutEnlargement: true })
        .jpeg({ quality: 85 })
        .toBuffer();

      return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: 'mangomania', resource_type: 'image' },
          (error, result) => error ? reject(error) : resolve({ url: result.secure_url, public_id: result.public_id })
        ).end(optimized);
      });
    }));

    res.json({ success: true, data: uploads });
  } catch (error) {
    next(error);
  }
};

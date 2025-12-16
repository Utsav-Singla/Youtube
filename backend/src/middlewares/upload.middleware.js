import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';

const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    if (file.fieldname === 'video') {
      return {
        folder: 'youtube_clone/videos',
        resource_type: 'video',
      };
    }

    if (file.fieldname === 'thumbnail') {
      return {
        folder: 'youtube_clone/thumbnails',
        resource_type: 'image',
      };
    }
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB safeguard
  },
});

export default upload;

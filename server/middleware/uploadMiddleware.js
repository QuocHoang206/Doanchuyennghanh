import multer from "multer";
import cloudinary from "../config/cloudinary.js";

const storage = multer.memoryStorage();
export const upload = multer({ storage });

export const uploadToCloudinary = (buffer, folder) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder }, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      })
      .end(buffer);
  });
};

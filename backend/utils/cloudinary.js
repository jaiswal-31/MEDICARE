// utils/cloudinary.js
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// 📌 Configure Cloudinary (env required)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/* ===========================================================
   UPLOAD FILE TO CLOUDINARY
   buffer = file buffer from multer (req.file.buffer)
   folder = cloudinary folder e.g. "services", "doctors", "profiles"
   =========================================================== */
export async function uploadToCloudinary(buffer, folder = "Doctor") {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "image" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    uploadStream.end(buffer);
  });
}

/* ===========================================================
   DELETE FROM CLOUDINARY (optional)
   Pass public_id from database
   =========================================================== */
export async function deleteFromCloudinary(publicId) {
  try {
    if (!publicId) return;

    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.error("Cloudinary delete error:", err);
    throw err;
  }
}

export default cloudinary;

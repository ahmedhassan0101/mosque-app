import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure:     true,
});

export { cloudinary };

export const UPLOAD_CONFIG = {
  folder:          "mosque-app/students",
  allowed_formats: ["jpg", "jpeg", "png", "webp"],
  max_bytes:       5 * 1024 * 1024,  // 5MB
  transformation:  [
    { width: 400, height: 400, crop: "fill", gravity: "face" },
    { quality: "auto", fetch_format: "auto" },
  ],
};
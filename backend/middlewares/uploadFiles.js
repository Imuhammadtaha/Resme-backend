import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const filesStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "Files_FOR_AI_SCAN",
    resource_type: "raw",   // 👈 'raw' for pdf, docx, etc
    public_id: (req, file) => `${Date.now()}_${file.originalname}`,
  },
});

export { filesStorage };

import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const profilePictureStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "Profile_Pictures",
    resource_type: "image",
    format: async () => "webp",
    public_id: (req, file) => `${Date.now()}_${file.originalname}`,
  },
});

export { profilePictureStorage };

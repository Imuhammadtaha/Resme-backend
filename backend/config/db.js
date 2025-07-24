import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectToDatabase = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log(`Hurray Connect To DB ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
  }
};

export default connectToDatabase;

import mongoose from "mongoose";

const recruiterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
    },
    company: {
      type: String,
      required: true,
    },
    profilePicURL: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Recruiter", recruiterSchema);

import mongoose from "mongoose";

const candidateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    address: {
      type: String,
    },
    phone: {
      type: Number,
    },
    skills: {
      type: [String],
    },
    experience: {
      type: [String],
    },
    hobbies: {
      type: [String],
    },
    education: {
      type: [String],
    },
    awards: {
      type: [String],
    },
    projects: {
      type: [String],
    },
    keywords: {
      type: [String],
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Candidates", candidateSchema);

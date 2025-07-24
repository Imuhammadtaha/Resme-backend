import nodeCron from "node-cron";
import candidateModel from "../models/candidateModel.js";

nodeCron.schedule("0 0 * * *", async () => {
  console.log(`Process Started For Cleanup`);
  try {
    const delCandidates = await candidateModel.find({
      expiresAt: { $lte: new Date() },
    });

    for (const del of delCandidates) {
      del.skills = [];
      del.experience = [];
      del.hobbies = [];
      del.education = [];
      del.awards = [];
      del.projects = [];
      del.keywords = [];
    }

    await del.save();
    console.log(`Cleaned sensitive data for candidate: ${del.name}`);
  } catch (error) {
    console.error("Error during scheduled candidate cleanup:", error);
  }
});

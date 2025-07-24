import candidateModel from "../models/candidateModel.js";
import recruiterModel from "../models/recruiterModel.js";

export const saveCandidateController = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      hobbies,
      experience,
      skills,
      address,
      keywords,
      projects,
      awards,
      education,
    } = req.body;

    const id = req.user._id;

    if (!id) {
      return res.status(400).send({
        success: false,
        message: "Please Login To Save Details",
      });
    }

    const user = await recruiterModel.findById(id);

    if (!user) {
      return res.status(400).send({
        success: false,
        message: "Please register to save details",
      });
    }

    const splitAndFlatten = (arr) =>
      arr ? arr.flatMap((item) => item.split(",").map((s) => s.trim())) : [];

    const mappedHobbies = splitAndFlatten(hobbies);
    const mappedSkills = splitAndFlatten(skills);
    const mappedKeywords = splitAndFlatten(keywords);
    const mappedProjects = splitAndFlatten(projects);
    const mappedAwards = splitAndFlatten(awards);
    const mappedEducation = splitAndFlatten(education);
    const mappedExperience = splitAndFlatten(experience);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    const newCandidate = new candidateModel({
      name: name,
      email: email,
      phone,
      hobbies: mappedHobbies,
      experience: mappedExperience,
      skills: mappedSkills,
      address: address,
      keywords: mappedKeywords,
      projects: mappedProjects,
      awards: mappedAwards,
      education: mappedEducation,
      expiresAt,
    });

    await newCandidate.save();

    res.status(200).send({
      success: true,
      message: `${name}'s Data Saved Successfully`,
      newCandidate,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in Saving Candidates Info",
      error: error.message,
    });
  }
};

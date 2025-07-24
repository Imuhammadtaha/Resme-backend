import recruiterModel from "../models/recruiterModel.js";
import { profilePictureStorage } from "../middlewares/uploadPicture.js";
import multer from "multer";
import {
  comparePassword,
  hashPassword,
} from "../middlewares/userMiddleware.js";
import JWT from "jsonwebtoken";

const upload = multer({
  storage: profilePictureStorage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed:"));
    }
  },
}).single("image");

export const registerHRController = async (req, res) => {
  const uploadP = () => {
    return new Promise((resolve, reject) => {
      upload(req, res, (err) => {
        if (err) {
          return reject({
            success: false,
            status: 400,
            message: "Error in uploading the profile picture",
            error: err.message,
          });
        }
        resolve();
      });
    });
  };
  try {
    await uploadP();
    const { name, email, password, company } = req.body;
    switch (true) {
      case !name:
        return res.status(300).send({
          success: false,
          message: "Name is mandatory",
        });
      case !email:
        return res.status(300).send({
          success: false,
          message: "Email is mandatory",
        });
      case !password:
        return res.status(300).send({
          success: false,
          message: "Password is mandatory",
        });
      case !company:
        return res.status(300).send({
          success: false,
          message: "Company is mandatory",
        });
    }

    const userExistAlready = await recruiterModel.findOne({ email });

    if (userExistAlready) {
      return res.status(400).send({
        success: false,
        message: "User with this email already exists",
      });
    }

    const hashedPassword = await hashPassword(password);

    const newUser = new recruiterModel({
      name,
      email,
      company,
      password: hashedPassword,
      profilePicURL: req.file
        ? req.file.path
        : "https://cdn-icons-png.flaticon.com/512/1144/1144760.png",
    });

    await newUser.save();
    const token = JWT.sign({ _id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    const userResponse = {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      company: newUser.company,
      profilePicURL: newUser.profilePicURL,
    };
    return res.status(200).send({
      success: true,
      message: "Sign Up Successfull",
      user: userResponse,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Internal Server Error: SignUp Error",
      error: error.message,
    });
  }
};

export const loginHRController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send({
        success: false,
        message: "Email or Password is missing",
      });
    }
    const checkUser = await recruiterModel.findOne({ email });
    if (!checkUser) {
      return res.status(400).send({
        success: false,
        message: "User isn't registerd! Please Register first",
      });
    }
    const match = await comparePassword(password, checkUser.password);

    if (!match) {
      return res.status(400).send({
        success: false,
        message: "Password is incorrect",
      });
    }

    const token = await JWT.sign(
      { _id: checkUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).send({
      success: true,
      message: "Login Successfull",
      user: {
        _id: checkUser._id,
        name: checkUser.name,
        email: checkUser.email,
        company: checkUser.company,
        profilePicURL: checkUser.profilePicURL,
      },
      token
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      success: false,
      message: "Internal Server Error: Login Error",
      error: error.message,
    });
  }
};

export const deleteAccountController = async (req, res) => {
  try {
    const id = req.user._id;

    const user = await recruiterModel.findById(id);
    if (!user) {
      return res.status(400).send({
        success: false,
        message: "Error! User isn't registered",
      });
    }

    const accDel = await recruiterModel.findByIdAndDelete(id);
    if (!accDel) {
      return res.status(400).send({
        success: false,
        message: "Error in deletion of your account",
      });
    }

    res.status(200).send({
      success: true,
      message: "Your account has been deleted",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in deletion of account",
    });
  }
};

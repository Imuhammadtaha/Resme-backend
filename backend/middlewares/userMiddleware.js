import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";
import recruiterModel from "../models/recruiterModel.js";
import dotenv from "dotenv";

dotenv.config();

export const hashPassword = (password) => {
  try {
    const saltrounds = 10;
    const hashedPassword = bcrypt.hash(password, saltrounds);
    return hashedPassword;
  } catch (error) {
    console.log(error);
  }
};

export const comparePassword = (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

export const requireSignin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(400).send({
        success: false,
        message: "No Token here",
      });
    }
    const decode = JWT.verify(token, process.env.JWT_SECRET);
    req.user - decode;
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Server Error! Couldn't verify. Could be a token issue",
      error: error.message,
    });
  }
};

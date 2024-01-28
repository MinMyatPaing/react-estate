import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  try {
    if (!username && !email && !password) {
      errorHandler(401, "Invalid Input!");
    }
    const hashedPassword = bcryptjs.hashSync(password, 10);

    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json("User created!");
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const verifiedUser = await User.findOne({ email });
    if (!verifiedUser) {
      errorHandler(404, "User not found!");
    }

    const verifiedPassword = bcryptjs.compareSync(
      password,
      verifiedUser.password
    );
    if (!verifiedPassword) {
      errorHandler(401, "Incorrect credentials!");
    }

    const token = jwt.sign({ id: verifiedUser._id }, process.env.JWT_SECRET);
    const { password: _, ...rest } = verifiedUser._doc;
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};

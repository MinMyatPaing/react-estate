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

export const google = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password: _, ...rest } = user._doc;
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const newUser = new User({
        username:
          req.body.name.split(" ").join("").toLowerCase() +
          Math.random().toString(36).slice(-4),
        email: req.body.email,
        password: hashedPassword,
        avatar: req.body.photo,
      });
      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      const { password: _, ...rest } = newUser._doc;
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};

export const signOutUser = (req, res, next) => {
  try {
    res.clearCookie("access_token");

    res.status(200).json("User signed Out successfully!");
  } catch (error) {
    next(error);
  }
};

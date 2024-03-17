import bcryptjs from "bcryptjs";

import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import Listing from "../models/listing.model.js";

export const updateUser = async (req, res, next) => {
  try {
    if (req.user.id !== req.params.id) errorHandler(401, "Not authorized");

    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );

    const { password: _, ...rest } = updatedUser;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    if (req.params.id !== req.user.id) errorHandler(401, "Not Authorized!");

    await User.findByIdAndDelete(req.params.id);

    res
      .status(200)
      .json("User deleted Successfully!")
      .clearCookie("access_token");
  } catch (error) {
    next(error);
  }
};

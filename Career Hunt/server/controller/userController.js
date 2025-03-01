import asyncHandler from "express-async-handler";
import User from "../models/UserModel.js";

export const getUserProfile = asyncHandler(async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findOne({ auth0Id: id });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.log("Can't get user profile", error);
    return res.status(500).json({
      message: "internal server error",
    });
  }
});

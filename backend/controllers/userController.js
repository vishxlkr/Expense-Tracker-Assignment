import User from "../models/User.js";
import asyncHandler from "../middlewares/asyncHandler.js";

export const createUser = asyncHandler(async (req, res) => {
   const { name, email } = req.body;

   if (!name || !email) {
      const error = new Error("Please provide name and email");
      error.statusCode = 400;
      throw error;
   }

   const existingUser = await User.findOne({ email });
   if (existingUser) {
      const error = new Error("User with this email already exists");
      error.statusCode = 400;
      throw error;
   }

   const user = await User.create({ name, email });

   res.status(201).json({
      success: true,
      data: user,
   });
});

export const getUserById = asyncHandler(async (req, res) => {
   const { id } = req.params;

   const user = await User.findById(id);
   if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
   }

   res.status(200).json({
      success: true,
      data: user,
   });
});

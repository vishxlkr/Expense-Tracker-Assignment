import Balance from "../models/Balance.js";
import User from "../models/User.js";
import asyncHandler from "../middlewares/asyncHandler.js";

export const getUserBalances = asyncHandler(async (req, res) => {
   const { userId } = req.params;

   const user = await User.findById(userId);
   if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
   }

   const balances = await Balance.find({ userId }).populate(
      "otherUserId",
      "name email"
   );

   const simplifiedBalances = {};
   let totalOwed = 0;
   let totalOwing = 0;

   balances.forEach((balance) => {
      const otherUserName = balance.otherUserId.name;
      if (balance.amount > 0) {
         simplifiedBalances[otherUserName] = balance.amount;
         totalOwing += balance.amount;
      } else if (balance.amount < 0) {
         simplifiedBalances[otherUserName] = balance.amount;
         totalOwed += Math.abs(balance.amount);
      }
   });

   res.status(200).json({
      success: true,
      data: {
         userId,
         balances: simplifiedBalances,
         summary: {
            totalOwing,
            totalOwed,
            netBalance: totalOwed - totalOwing,
         },
      },
   });
});

export const settleBalance = asyncHandler(async (req, res) => {
   const { userId, otherUserId, amount } = req.body;

   if (!userId || !otherUserId || amount === undefined) {
      const error = new Error("Please provide userId, otherUserId, and amount");
      error.statusCode = 400;
      throw error;
   }

   const user = await User.findById(userId);
   if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
   }

   const otherUser = await User.findById(otherUserId);
   if (!otherUser) {
      const error = new Error("Other user not found");
      error.statusCode = 404;
      throw error;
   }

   const userIdStr = userId.toString();
   const otherUserIdStr = otherUserId.toString();

   let balance = await Balance.findOne({
      userId: userIdStr,
      otherUserId: otherUserIdStr,
   });

   if (balance) {
      balance.amount -= amount;
      if (balance.amount === 0) {
         await Balance.deleteOne({ _id: balance._id });
      } else {
         await balance.save();
      }
   } else {
      const error = new Error("No balance found between these users");
      error.statusCode = 404;
      throw error;
   }

   res.status(200).json({
      success: true,
      message: "Balance settled successfully",
   });
});

const Expense = require("../models/Expense");
const Group = require("../models/Group");
const User = require("../models/User");
const Balance = require("../models/Balance");
const asyncHandler = require("../middlewares/asyncHandler");

const calculateSplits = (totalAmount, splitType, splitDetails, members) => {
   const splits = {};

   if (splitType === "EQUAL") {
      const amountPerPerson = totalAmount / members.length;
      members.forEach((memberId) => {
         splits[memberId] = amountPerPerson;
      });
   } else if (splitType === "EXACT") {
      Object.assign(
         splits,
         Object.fromEntries(
            Object.entries(splitDetails).map(([key, value]) => [key, value])
         )
      );
   } else if (splitType === "PERCENT") {
      let totalPercent = 0;
      Object.values(splitDetails).forEach((percent) => {
         totalPercent += percent;
      });

      if (totalPercent !== 100) {
         const error = new Error("Percentages must sum to 100");
         error.statusCode = 400;
         throw error;
      }

      Object.entries(splitDetails).forEach(([memberId, percent]) => {
         splits[memberId] = (totalAmount * percent) / 100;
      });
   }

   return splits;
};

const updateBalances = async (paidBy, splits, groupId) => {
   for (const [memberId, amount] of Object.entries(splits)) {
      if (memberId === paidBy) continue;

      const paidByStr = paidBy.toString();
      const memberStr = memberId.toString();

      let balance = await Balance.findOne({
         userId: memberStr,
         otherUserId: paidByStr,
      });

      if (balance) {
         balance.amount += amount;
         await balance.save();
      } else {
         await Balance.create({
            userId: memberStr,
            otherUserId: paidByStr,
            amount,
         });
      }
   }
};

exports.addExpense = asyncHandler(async (req, res) => {
   const {
      description,
      totalAmount,
      paidBy,
      groupId,
      splitType,
      splitDetails,
   } = req.body;

   if (
      !description ||
      !totalAmount ||
      !paidBy ||
      !groupId ||
      !splitType ||
      !splitDetails
   ) {
      const error = new Error("Please provide all required fields");
      error.statusCode = 400;
      throw error;
   }

   const group = await Group.findById(groupId).populate("members");
   if (!group) {
      const error = new Error("Group not found");
      error.statusCode = 404;
      throw error;
   }

   const paidByUser = await User.findById(paidBy);
   if (!paidByUser) {
      const error = new Error("Payer user not found");
      error.statusCode = 404;
      throw error;
   }

   if (
      !group.members.map((m) => m._id.toString()).includes(paidBy.toString())
   ) {
      const error = new Error("Payer is not a member of this group");
      error.statusCode = 400;
      throw error;
   }

   const memberIds = group.members.map((m) => m._id.toString());
   const splits = calculateSplits(
      totalAmount,
      splitType,
      splitDetails,
      memberIds
   );

   const splitDetailsMap = new Map(Object.entries(splits));
   const expense = await Expense.create({
      description,
      totalAmount,
      paidBy,
      groupId,
      splitType,
      splitDetails: splitDetailsMap,
   });

   await updateBalances(paidBy, splits, groupId);

   group.expenses.push(expense._id);
   await group.save();

   const populatedExpense = await expense.populate("paidBy groupId");

   res.status(201).json({
      success: true,
      data: populatedExpense,
   });
});

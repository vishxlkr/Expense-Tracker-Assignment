import Group from "../models/Group.js";
import User from "../models/User.js";
import asyncHandler from "../middlewares/asyncHandler.js";

export const createGroup = asyncHandler(async (req, res) => {
   const { groupName, members, createdBy } = req.body;

   if (!groupName || !createdBy) {
      const error = new Error("Please provide groupName and createdBy");
      error.statusCode = 400;
      throw error;
   }

   const creator = await User.findById(createdBy);
   if (!creator) {
      const error = new Error("Creator user not found");
      error.statusCode = 404;
      throw error;
   }

   const memberList = members && members.length > 0 ? members : [createdBy];

   for (const memberId of memberList) {
      const member = await User.findById(memberId);
      if (!member) {
         const error = new Error(`Member with ID ${memberId} not found`);
         error.statusCode = 404;
         throw error;
      }
   }

   const group = await Group.create({
      groupName,
      members: memberList,
      createdBy,
      expenses: [],
   });

   const populatedGroup = await group.populate("members createdBy");

   res.status(201).json({
      success: true,
      data: populatedGroup,
   });
});

export const addMember = asyncHandler(async (req, res) => {
   const { groupId } = req.params;
   const { userId } = req.body;

   if (!userId) {
      const error = new Error("Please provide userId");
      error.statusCode = 400;
      throw error;
   }

   const group = await Group.findById(groupId);
   if (!group) {
      const error = new Error("Group not found");
      error.statusCode = 404;
      throw error;
   }

   const user = await User.findById(userId);
   if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
   }

   if (group.members.includes(userId)) {
      const error = new Error("User is already a member of this group");
      error.statusCode = 400;
      throw error;
   }

   group.members.push(userId);
   await group.save();

   const updatedGroup = await group.populate("members createdBy");

   res.status(200).json({
      success: true,
      data: updatedGroup,
   });
});

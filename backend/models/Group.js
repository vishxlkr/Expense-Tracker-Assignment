import mongoose from "mongoose";

const groupSchema = new mongoose.Schema(
   {
      groupName: {
         type: String,
         required: [true, "Please provide a group name"],
         trim: true,
      },
      members: [
         {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
         },
      ],
      expenses: [
         {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Expense",
         },
      ],
      createdBy: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User",
         required: true,
      },
   },
   { timestamps: true }
);

export default mongoose.model("Group", groupSchema);

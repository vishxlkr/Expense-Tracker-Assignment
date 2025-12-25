import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
   {
      description: {
         type: String,
         required: [true, "Please provide a description"],
         trim: true,
      },
      totalAmount: {
         type: Number,
         required: [true, "Please provide an amount"],
         min: [0, "Amount must be positive"],
      },
      paidBy: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User",
         required: true,
      },
      groupId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Group",
         required: true,
      },
      splitType: {
         type: String,
         enum: ["EQUAL", "EXACT", "PERCENT"],
         required: [true, "Please specify split type"],
      },
      splitDetails: {
         type: Map,
         of: Number,
         required: true,
      },
   },
   { timestamps: true }
);

export default mongoose.model("Expense", expenseSchema);

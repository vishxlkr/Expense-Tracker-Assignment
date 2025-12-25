import mongoose from "mongoose";

const balanceSchema = new mongoose.Schema(
   {
      userId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User",
         required: true,
      },
      otherUserId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User",
         required: true,
      },
      amount: {
         type: Number,
         required: true,
         default: 0,
      },
   },
   { timestamps: true }
);

balanceSchema.index({ userId: 1, otherUserId: 1 }, { unique: true });

export default mongoose.model("Balance", balanceSchema);

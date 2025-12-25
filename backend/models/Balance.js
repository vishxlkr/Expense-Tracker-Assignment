const mongoose = require("mongoose");

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

module.exports = mongoose.model("Balance", balanceSchema);

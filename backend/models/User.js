import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
   {
      name: {
         type: String,
         required: [true, "Please provide a name"],
         trim: true,
      },
      email: {
         type: String,
         required: [true, "Please provide an email"],
         unique: true,
         lowercase: true,
         match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            "Please provide a valid email",
         ],
      },
   },
   { timestamps: true }
);

export default mongoose.model("User", userSchema);

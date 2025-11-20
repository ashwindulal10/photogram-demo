import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema(
  {
    title: String,
    caption: String,
    filename: String,
    uploadedBy: String,
  },
  { timestamps: true }
);

export default mongoose.model("Media", mediaSchema);


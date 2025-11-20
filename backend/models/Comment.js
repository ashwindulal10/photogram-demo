import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    mediaId: String,
    text: String,
    userId: String,
  },
  { timestamps: true }
);

export default mongoose.model("Comment", commentSchema);


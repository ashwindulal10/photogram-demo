import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema(
  {
    mediaId: String,
    userId: String,
    stars: Number,
  },
  { timestamps: true }
);

export default mongoose.model("Rating", ratingSchema);

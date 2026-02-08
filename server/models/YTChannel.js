import mongoose from "mongoose";

const ytChannelSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    channelId: { type: String, required: true, trim: true },
    channelUrl: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    logoUrl: { type: String, trim: true },
    bannerUrl: { type: String, trim: true },
    featuredVideoId: { type: String, trim: true },
    subscriberCount: { type: Number, default: 0 },
    totalVideos: { type: Number, default: 0 },
    category: { type: String, trim: true },
    isVerified: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model("YTChannel", ytChannelSchema);

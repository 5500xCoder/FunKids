import mongoose from "mongoose";

const siteSettingsSchema = new mongoose.Schema(
  {
    homepageFeaturedChannelId: { type: String, default: "" },
    channelOrder: { type: [String], default: [] },
    sections: {
      continueWatching: { type: Boolean, default: true },
      latestUploads: { type: Boolean, default: true },
      mostPopular: { type: Boolean, default: true },
      categories: { type: Boolean, default: true },
      recommended: { type: Boolean, default: true }
    }
  },
  { timestamps: true }
);

export default mongoose.model("SiteSettings", siteSettingsSchema);

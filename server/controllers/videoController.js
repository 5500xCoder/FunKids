import Video from "../models/Video.js";

const buildThumb = (videoId) => `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

export const getVideos = async (req, res, next) => {
  try {
    const { channelId } = req.query;
    const filter = channelId ? { channelId } : {};
    const videos = await Video.find(filter).sort({ publishedAt: -1, createdAt: -1 });
    res.json(videos);
  } catch (err) {
    next(err);
  }
};

export const getFeaturedVideo = async (req, res, next) => {
  try {
    const { channelId } = req.query;
    const filter = channelId ? { channelId, isFeatured: true } : { isFeatured: true };
    const featured = await Video.findOne(filter).sort({ publishedAt: -1, createdAt: -1 });
    if (!featured) {
      return res.status(404).json({ message: "No featured video set" });
    }
    res.json(featured);
  } catch (err) {
    next(err);
  }
};

export const createVideo = async (req, res, next) => {
  try {
    const {
      title,
      videoId,
      channelName,
      channelId,
      channelLogo,
      thumbnailUrl,
      category,
      isFeatured,
      isTrending
    } = req.body;

    if (!title || !videoId || !channelName || !channelId) {
      return res.status(400).json({
        message: "Title, videoId, channelName, and channelId are required"
      });
    }

    const video = await Video.create({
      title: title.trim(),
      videoId: videoId.trim(),
      channelName: channelName.trim(),
      channelId: channelId.trim(),
      channelLogo: channelLogo?.trim() || "",
      thumbnailUrl: thumbnailUrl?.trim() || buildThumb(videoId.trim()),
      category: category?.trim() || "",
      isFeatured: Boolean(isFeatured),
      isTrending: Boolean(isTrending)
    });

    res.status(201).json({ message: "Video created", data: video });
  } catch (err) {
    next(err);
  }
};

export const deleteVideo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await Video.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Video not found" });
    }
    res.json({ message: "Video deleted" });
  } catch (err) {
    next(err);
  }
};

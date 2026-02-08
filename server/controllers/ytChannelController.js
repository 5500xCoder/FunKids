import YTChannel from "../models/YTChannel.js";
import Video from "../models/Video.js";

const API_KEY = process.env.YT_API_KEY;
const YT_API = "https://www.googleapis.com/youtube/v3";

const buildThumb = (videoId) => `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

const parseChannelInput = (input) => {
  if (!input) return null;
  const trimmed = input.trim();
  try {
    const url = new URL(trimmed);
    const parts = url.pathname.split("/").filter(Boolean);
    if (parts[0] === "channel" && parts[1]) return { type: "id", value: parts[1] };
    if (parts[0]?.startsWith("@")) return { type: "handle", value: parts[0].slice(1) };
    if (parts[0] === "user" && parts[1]) return { type: "query", value: parts[1] };
    if (parts[0] === "c" && parts[1]) return { type: "query", value: parts[1] };
  } catch {
    if (/^[a-zA-Z0-9_-]{20,}$/.test(trimmed)) return { type: "id", value: trimmed };
    if (trimmed.startsWith("@")) return { type: "handle", value: trimmed.slice(1) };
    return { type: "query", value: trimmed };
  }
  return { type: "query", value: trimmed };
};

const fetchJson = async (url) => {
  const res = await fetch(url);
  if (!res.ok) return null;
  return res.json();
};

const fetchChannelDetailsById = async (id) => {
  const url = `${YT_API}/channels?part=snippet,statistics,brandingSettings,contentDetails&id=${id}&key=${API_KEY}`;
  const data = await fetchJson(url);
  return data?.items?.[0] || null;
};

const fetchChannelDetailsByHandle = async (handle) => {
  const url = `${YT_API}/channels?part=snippet,statistics,brandingSettings,contentDetails&forHandle=${handle}&key=${API_KEY}`;
  const data = await fetchJson(url);
  return data?.items?.[0] || null;
};

const searchChannels = async (query) => {
  const url = `${YT_API}/search?part=snippet&type=channel&q=${encodeURIComponent(query)}&maxResults=5&key=${API_KEY}`;
  const data = await fetchJson(url);
  return data?.items || [];
};

const mapChannel = (item) => {
  const snippet = item.snippet || {};
  const stats = item.statistics || {};
  const branding = item.brandingSettings || {};
  const image = branding.image || {};

  return {
    channelId: item.id,
    name: snippet.title || "",
    description: snippet.description || "",
    channelUrl: `https://www.youtube.com/channel/${item.id}`,
    logoUrl: snippet.thumbnails?.high?.url || snippet.thumbnails?.default?.url || "",
    bannerUrl: image.bannerExternalUrl || "",
    subscriberCount: Number(stats.subscriberCount || 0),
    totalVideos: Number(stats.videoCount || 0),
    isVerified: Number(stats.subscriberCount || 0) >= 100000
  };
};

const parseDuration = (iso) => {
  const match = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/.exec(iso || "");
  if (!match) return 0;
  const h = Number(match[1] || 0);
  const m = Number(match[2] || 0);
  const s = Number(match[3] || 0);
  return h * 3600 + m * 60 + s;
};

const fetchVideosStats = async (videoIds) => {
  if (!videoIds.length) return {};
  const url = `${YT_API}/videos?part=contentDetails,statistics&id=${videoIds.join(",")}&key=${API_KEY}`;
  const data = await fetchJson(url);
  const map = {};
  (data?.items || []).forEach((item) => {
    map[item.id] = {
      durationSeconds: parseDuration(item.contentDetails?.duration),
      views: Number(item.statistics?.viewCount || 0)
    };
  });
  return map;
};

const syncChannelVideos = async (channel, category) => {
  if (!API_KEY) return;
  const details = await fetchChannelDetailsById(channel.channelId);
  const uploadsId = details?.contentDetails?.relatedPlaylists?.uploads;
  if (!uploadsId) return;

  const latestUrl = `${YT_API}/playlistItems?part=snippet&playlistId=${uploadsId}&maxResults=15&key=${API_KEY}`;
  const latestData = await fetchJson(latestUrl);
  const latestItems = latestData?.items || [];
  const latestVideoIds = latestItems.map((item) => item.snippet?.resourceId?.videoId).filter(Boolean);
  const latestStats = await fetchVideosStats(latestVideoIds);

  for (const item of latestItems) {
    const videoId = item.snippet?.resourceId?.videoId;
    if (!videoId) continue;
    const snippet = item.snippet || {};
    const stat = latestStats[videoId] || { durationSeconds: 0, views: 0 };

    await Video.findOneAndUpdate(
      { videoId },
      {
        title: snippet.title || "",
        videoId,
        channelName: channel.name,
        channelId: channel.channelId,
        channelLogo: channel.logoUrl,
        thumbnailUrl: snippet.thumbnails?.high?.url || buildThumb(videoId),
        category: category || "recent",
        durationSeconds: stat.durationSeconds,
        views: stat.views,
        publishedAt: snippet.publishedAt ? new Date(snippet.publishedAt) : undefined
      },
      { upsert: true, new: true }
    );
  }

  const popularUrl = `${YT_API}/search?part=snippet&type=video&channelId=${channel.channelId}&order=viewCount&maxResults=8&key=${API_KEY}`;
  const popularData = await fetchJson(popularUrl);
  const popularItems = popularData?.items || [];
  const popularVideoIds = popularItems.map((item) => item.id?.videoId).filter(Boolean);
  const popularStats = await fetchVideosStats(popularVideoIds);

  for (const item of popularItems) {
    const videoId = item.id?.videoId;
    if (!videoId) continue;
    const snippet = item.snippet || {};
    const stat = popularStats[videoId] || { durationSeconds: 0, views: 0 };
    await Video.findOneAndUpdate(
      { videoId },
      {
        title: snippet.title || "",
        videoId,
        channelName: channel.name,
        channelId: channel.channelId,
        channelLogo: channel.logoUrl,
        thumbnailUrl: snippet.thumbnails?.high?.url || buildThumb(videoId),
        category: "popular",
        durationSeconds: stat.durationSeconds,
        views: stat.views,
        publishedAt: snippet.publishedAt ? new Date(snippet.publishedAt) : undefined
      },
      { upsert: true, new: true }
    );
  }
};

export const syncAllChannels = async () => {
  const channels = await YTChannel.find({ isActive: true });
  for (const channel of channels) {
    const details = await fetchChannelDetailsById(channel.channelId);
    if (details) {
      const mapped = mapChannel(details);
      await YTChannel.findByIdAndUpdate(channel._id, {
        ...mapped,
        category: channel.category,
        featuredVideoId: channel.featuredVideoId,
        isActive: channel.isActive
      });
    }
    await syncChannelVideos(channel, channel.category || "recent");
  }
};

export const getActiveChannels = async (req, res, next) => {
  try {
    const channels = await YTChannel.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(channels);
  } catch (err) {
    next(err);
  }
};

export const getAllChannels = async (req, res, next) => {
  try {
    const channels = await YTChannel.find().sort({ createdAt: -1 });
    res.json(channels);
  } catch (err) {
    next(err);
  }
};

export const getChannelById = async (req, res, next) => {
  try {
    const channel = await YTChannel.findById(req.params.id);
    if (!channel) return res.status(404).json({ message: "Channel not found" });
    res.json(channel);
  } catch (err) {
    next(err);
  }
};

export const lookupChannels = async (req, res, next) => {
  try {
    if (!API_KEY) {
      return res.status(400).json({ message: "YT_API_KEY is not configured" });
    }
    const { query } = req.body;
    const parsed = parseChannelInput(query);
    if (!parsed) {
      return res.status(400).json({ message: "Provide a channel URL, handle, or ID" });
    }

    let items = [];
    if (parsed.type === "id") {
      const data = await fetchChannelDetailsById(parsed.value);
      if (data) items = [data];
    } else if (parsed.type === "handle") {
      const data = await fetchChannelDetailsByHandle(parsed.value);
      if (data) items = [data];
    } else {
      const search = await searchChannels(parsed.value);
      const ids = search.map((item) => item.id?.channelId).filter(Boolean);
      if (ids.length) {
        const url = `${YT_API}/channels?part=snippet,statistics,brandingSettings,contentDetails&id=${ids.join(",")}&key=${API_KEY}`;
        const data = await fetchJson(url);
        items = data?.items || [];
      }
    }

    const mapped = items.map(mapChannel);
    res.json(mapped);
  } catch (err) {
    next(err);
  }
};

export const createChannel = async (req, res, next) => {
  try {
    const { channelId, category, featuredVideoId, isActive } = req.body;
    if (!API_KEY) {
      return res.status(400).json({ message: "YT_API_KEY is not configured" });
    }
    if (!channelId) {
      return res.status(400).json({ message: "channelId is required" });
    }

    const existing = await YTChannel.findOne({ channelId });
    if (existing) {
      return res.status(409).json({ message: "Channel already exists" });
    }

    const details = await fetchChannelDetailsById(channelId);
    if (!details) {
      return res.status(404).json({ message: "Channel not found" });
    }

    const mapped = mapChannel(details);
    const channel = await YTChannel.create({
      ...mapped,
      category: category?.trim() || "",
      featuredVideoId: featuredVideoId?.trim() || "",
      isActive: isActive !== false
    });

    await syncChannelVideos(channel, channel.category || "recent");

    res.status(201).json({ message: "Channel created", data: channel });
  } catch (err) {
    next(err);
  }
};

export const updateChannel = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { category, featuredVideoId, isActive } = req.body;

    const channel = await YTChannel.findById(id);
    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    const updated = await YTChannel.findByIdAndUpdate(
      id,
      {
        category: category?.trim() || "",
        featuredVideoId: featuredVideoId?.trim() || "",
        isActive: Boolean(isActive)
      },
      { new: true }
    );

    res.json({ message: "Channel updated", data: updated });
  } catch (err) {
    next(err);
  }
};

export const deleteChannel = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await YTChannel.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Channel not found" });
    }
    res.json({ message: "Channel deleted" });
  } catch (err) {
    next(err);
  }
};

export const syncChannel = async (req, res, next) => {
  try {
    const channel = await YTChannel.findById(req.params.id);
    if (!channel) return res.status(404).json({ message: "Channel not found" });

    const details = await fetchChannelDetailsById(channel.channelId);
    if (details) {
      const mapped = mapChannel(details);
      await YTChannel.findByIdAndUpdate(channel._id, {
        ...mapped,
        category: channel.category,
        featuredVideoId: channel.featuredVideoId,
        isActive: channel.isActive
      });
    }

    await syncChannelVideos(channel, channel.category || "recent");

    res.json({ message: "Channel synced" });
  } catch (err) {
    next(err);
  }
};

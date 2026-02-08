import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

const STORAGE_PROGRESS = "fk_video_progress";
const STORAGE_WATCHLIST = "fk_watchlist";

const formatDuration = (seconds) => {
  if (!seconds) return "";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
};

const formatViews = (views) => {
  if (!views) return "0";
  if (views > 1_000_000) return `${(views / 1_000_000).toFixed(1)}M views`;
  if (views > 1_000) return `${(views / 1_000).toFixed(1)}K views`;
  return `${views} views`;
};

const loadProgress = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_PROGRESS) || "{}") || {};
  } catch {
    return {};
  }
};

const saveProgress = (data) => {
  localStorage.setItem(STORAGE_PROGRESS, JSON.stringify(data));
};

const loadWatchlist = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_WATCHLIST) || "[]") || [];
  } catch {
    return [];
  }
};

const saveWatchlist = (data) => {
  localStorage.setItem(STORAGE_WATCHLIST, JSON.stringify(data));
};

const VideoModalPlayer = ({ video, onClose, onNext, onProgress }) => {
  useEffect(() => {
    if (!video) return;

    const onKey = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.classList.add("modal-open");

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.classList.remove("modal-open");
    };
  }, [video, onClose]);

  useEffect(() => {
    if (!video) return;
    let player;
    let progressTimer;

    const createPlayer = () => {
      if (!window.YT || !window.YT.Player) return;
      player = new window.YT.Player("yt-modal-player", {
        videoId: video.videoId,
        playerVars: {
          autoplay: 1,
          rel: 0
        },
        events: {
          onStateChange: (event) => {
            if (event.data === 0) {
              onNext();
            }
          }
        }
      });

      progressTimer = setInterval(() => {
        if (player && player.getCurrentTime) {
          const time = player.getCurrentTime();
          onProgress(video.videoId, time);
        }
      }, 3000);
    };

    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);
      window.onYouTubeIframeAPIReady = createPlayer;
    } else {
      createPlayer();
    }

    return () => {
      if (progressTimer) clearInterval(progressTimer);
      if (player && player.destroy) player.destroy();
    };
  }, [video, onNext, onProgress]);

  if (!video) return null;

  return (
    <div className="video-modal" onClick={onClose} role="presentation">
      <div className="modal-content" onClick={(e) => e.stopPropagation()} role="presentation">
        <button className="modal-close" type="button" onClick={onClose}>
          ✕
        </button>
        <div className="video-wrapper">
          <div id="yt-modal-player" />
        </div>
        <div className="modal-meta">
          <div>
            <h3>{video.title}</h3>
            <p className="muted">{formatViews(video.views)}</p>
          </div>
          <div className="admin-actions">
            <button
              className="btn ghost"
              type="button"
              onClick={() => navigator.clipboard.writeText(`https://youtu.be/${video.videoId}`)}
            >
              Share
            </button>
            <button className="btn ghost" type="button" onClick={onNext}>
              Next Video
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const VideoCard = ({ video, onPlay, isInWatchlist, onToggleWatchlist }) => (
  <button className="video-card" type="button" onClick={onPlay}>
    <div className="video-thumb">
      <img src={video.thumbnailUrl} alt={video.title} loading="lazy" />
      <div className="video-hover">
        <span>▶</span>
      </div>
      {video.durationSeconds > 0 && (
        <span className="video-duration">{formatDuration(video.durationSeconds)}</span>
      )}
    </div>
    <div className="video-meta">
      {video.channelLogo ? (
        <img src={video.channelLogo} alt={video.channelName} className="video-logo" />
      ) : (
        <div className="video-logo placeholder">FK</div>
      )}
      <div>
        <h4>{video.title}</h4>
        <p>{formatViews(video.views)}</p>
      </div>
      <button
        className={`watchlist-btn ${isInWatchlist ? "active" : ""}`}
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onToggleWatchlist(video.videoId);
        }}
      >
        {isInWatchlist ? "✓" : "+"}
      </button>
    </div>
  </button>
);

const VideoRow = ({ title, videos, onPlay, watchlist, onToggleWatchlist }) => {
  if (!videos.length) return null;
  return (
    <section className="video-row">
      <div className="row-header">
        <h2>{title}</h2>
      </div>
      <div className="row-scroller">
        {videos.map((video) => (
          <VideoCard
            key={video._id}
            video={video}
            onPlay={() => onPlay(video)}
            isInWatchlist={watchlist.includes(video.videoId)}
            onToggleWatchlist={onToggleWatchlist}
          />
        ))}
      </div>
    </section>
  );
};

const YTChannelFeatured = () => {
  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const { id } = useParams();
  const [channel, setChannel] = useState(null);
  const [videos, setVideos] = useState([]);
  const [activeVideo, setActiveVideo] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [progress, setProgress] = useState(loadProgress());
  const [watchlist, setWatchlist] = useState(loadWatchlist());
  const [lastPlayed, setLastPlayed] = useState(null);
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    document.title = "FunKids Channel | FunKids Studio";
    const load = async () => {
      const [channelRes, settingsRes] = await Promise.all([
        fetch(`${baseUrl}/api/ytchannels/${id}`),
        fetch(`${baseUrl}/api/settings`)
      ]);
      const channelData = channelRes.ok ? await channelRes.json() : null;
      setSettings(settingsRes.ok ? await settingsRes.json() : null);
      setChannel(channelData);
      if (channelData?.channelId) {
        const videosRes = await fetch(`${baseUrl}/api/videos?channelId=${channelData.channelId}`);
        setVideos(videosRes.ok ? await videosRes.json() : []);
      } else {
        setVideos([]);
      }
    };
    load();
  }, [id]);

  useEffect(() => {
    if (channel?.name) {
      document.title = `${channel.name} | FunKids Studio`;
    }
  }, [channel]);

  useEffect(() => {
    if (!channel) return;
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "VideoChannel",
      name: channel.name,
      description: channel.description,
      url: channel.channelUrl
    });
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, [channel]);

  const featured = useMemo(() => {
    const explicit = videos.find((v) => v.videoId === channel?.featuredVideoId);
    if (explicit) return explicit;
    const popular = [...videos].sort((a, b) => (b.views || 0) - (a.views || 0));
    return popular[0] || videos[0] || null;
  }, [videos, channel]);

  const latest = useMemo(() => [...videos].sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)), [videos]);
  const popular = useMemo(() => [...videos].sort((a, b) => (b.views || 0) - (a.views || 0)), [videos]);
  const trending = useMemo(() => videos.filter((v) => v.isTrending), [videos]);

  const continueWatching = useMemo(
    () => videos.filter((v) => progress[v.videoId] && progress[v.videoId] > 10),
    [videos, progress]
  );

  const recommended = useMemo(
    () => videos.filter((v) => !watchlist.includes(v.videoId)).slice(0, 10),
    [videos, watchlist]
  );

  const categories = useMemo(() => {
    const map = {};
    videos.forEach((video) => {
      const key = (video.category || "Other").toLowerCase();
      if (!map[key]) map[key] = [];
      map[key].push(video);
    });
    return map;
  }, [videos]);

  const filteredVideos = useMemo(() => {
    let list = videos;
    if (search) {
      list = list.filter((v) => v.title.toLowerCase().includes(search.toLowerCase()));
    }
    if (filter !== "all") {
      list = list.filter((v) => (v.category || "other").toLowerCase() === filter);
    }
    return list;
  }, [videos, search, filter]);

  const handleProgress = (videoId, time) => {
    const updated = { ...progress, [videoId]: time };
    setProgress(updated);
    saveProgress(updated);
  };

  const trackPlay = async (video, watchTimeSeconds = 0, incrementPlay = true) => {
    try {
      await fetch(`${baseUrl}/api/analytics/track`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          videoId: video.videoId,
          title: video.title,
          channelId: video.channelId,
          channelName: video.channelName,
          watchTimeSeconds,
          incrementPlay
        })
      });
    } catch {
      // no-op
    }
  };

  const handlePlay = (video) => {
    setActiveVideo(video);
    setLastPlayed(video);
    trackPlay(video, 0, true);
  };

  const handleClose = () => {
    if (lastPlayed) {
      const watched = progress[lastPlayed.videoId] || 0;
      trackPlay(lastPlayed, watched, false);
    }
    setActiveVideo(null);
  };

  const sections = settings?.sections || {};

  const toggleWatchlist = (videoId) => {
    let updated;
    if (watchlist.includes(videoId)) {
      updated = watchlist.filter((id) => id !== videoId);
    } else {
      updated = [...watchlist, videoId];
    }
    setWatchlist(updated);
    saveWatchlist(updated);
  };

  const handleNext = () => {
    if (!activeVideo) return;
    const list = filteredVideos.length ? filteredVideos : videos;
    const idx = list.findIndex((v) => v.videoId === activeVideo.videoId);
    const next = list[idx + 1] || list[0];
    setActiveVideo(next);
    setLastPlayed(next);
    trackPlay(next, 0, true);
  };

  return (
    <div className="page yt-page">
      <div className="yt-heading">
        <h1>{channel?.name || "Channel"}</h1>
        <p>{channel?.description || ""}</p>
      </div>

      <section
        className="yt-hero hero-video"
        style={channel?.bannerUrl ? { backgroundImage: `url(${channel.bannerUrl})` } : undefined}
      >
        {featured && (
          <iframe
            title={featured.title}
            src={`https://www.youtube.com/embed/${featured.videoId}?autoplay=1&mute=1&controls=0&rel=0`}
            allow="autoplay; encrypted-media"
            className="hero-iframe"
          />
        )}
        <div className="hero-overlay" />
        <div className="hero-content">
          <p className="hero-kicker">Produced by FunKids Studio</p>
          {channel?.logoUrl && <img src={channel.logoUrl} alt={channel.name} className="hero-logo" />}
          <h2>{featured?.title || "Featured"}</h2>
          <p className="hero-desc">{channel?.name}</p>
          <div className="hero-actions">
            <button
              className="btn primary"
              type="button"
              onClick={() => featured && handlePlay(featured)}
              disabled={!featured}
            >
              Play
            </button>
            {channel?.channelUrl && (
              <a className="btn ghost" href={channel.channelUrl} target="_blank" rel="noreferrer">
                Subscribe
              </a>
            )}
          </div>
        </div>
      </section>

      <div className="yt-controls">
        <input
          type="search"
          placeholder="Search videos"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All categories</option>
          {Object.keys(categories).map((key) => (
            <option key={key} value={key}>
              {key}
            </option>
          ))}
        </select>
      </div>

      {sections.continueWatching !== false && (
        <VideoRow
          title="Continue Watching"
          videos={continueWatching}
          onPlay={handlePlay}
          watchlist={watchlist}
          onToggleWatchlist={toggleWatchlist}
        />
      )}

      {(search || filter !== "all") && (
        <VideoRow
          title="Search Results"
          videos={filteredVideos}
          onPlay={handlePlay}
          watchlist={watchlist}
          onToggleWatchlist={toggleWatchlist}
        />
      )}

      {sections.latestUploads !== false && (
        <VideoRow
          title="Latest Uploads"
          videos={latest}
          onPlay={handlePlay}
          watchlist={watchlist}
          onToggleWatchlist={toggleWatchlist}
        />
      )}

      {sections.mostPopular !== false && (
        <VideoRow
          title="Most Popular"
          videos={popular}
          onPlay={handlePlay}
          watchlist={watchlist}
          onToggleWatchlist={toggleWatchlist}
        />
      )}

      {trending.length > 0 && (
        <VideoRow
          title="Trending"
          videos={trending}
          onPlay={handlePlay}
          watchlist={watchlist}
          onToggleWatchlist={toggleWatchlist}
        />
      )}

      {sections.categories !== false &&
        Object.entries(categories).map(([key, list]) => (
          <VideoRow
            key={key}
            title={key.charAt(0).toUpperCase() + key.slice(1)}
            videos={list}
            onPlay={handlePlay}
            watchlist={watchlist}
            onToggleWatchlist={toggleWatchlist}
          />
        ))}

      {sections.recommended !== false && (
        <VideoRow
          title="Recommended"
          videos={recommended}
          onPlay={handlePlay}
          watchlist={watchlist}
          onToggleWatchlist={toggleWatchlist}
        />
      )}

      <VideoModalPlayer
        video={activeVideo}
        onClose={handleClose}
        onNext={handleNext}
        onProgress={handleProgress}
      />
    </div>
  );
};

export default YTChannelFeatured;

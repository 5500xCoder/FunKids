import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./config/db.js";
import cron from "node-cron";
import { syncAllChannels } from "./controllers/ytChannelController.js";
import contactRoutes from "./routes/contactRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import ytChannelRoutes from "./routes/ytChannelRoutes.js";
import adminYtChannelRoutes from "./routes/adminYtChannelRoutes.js";
import videoRoutes from "./routes/videoRoutes.js";
import adminVideoRoutes from "./routes/adminVideoRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors({
  origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "FunKids Studio API" });
});

app.use("/api/contact", contactRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin-users", adminRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/ytchannels", ytChannelRoutes);
app.use("/api/admin/ytchannels", adminYtChannelRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/admin/videos", adminVideoRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/settings", settingsRoutes);

if (process.env.NODE_ENV === "production") {
  const clientDist = path.join(__dirname, "../client/dist");
  app.use(express.static(clientDist));
  app.get("*", (req, res) => {
    res.sendFile(path.join(clientDist, "index.html"));
  });
}

app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.message || "Server error"
  });
});

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    if (process.env.YT_API_KEY) {
      cron.schedule("0 */6 * * *", async () => {
        try {
          await syncAllChannels();
          console.log("YT channels synced");
        } catch (err) {
          console.error("YT sync failed", err);
        }
      });
    }
  })
  .catch((err) => {
    console.error("Failed to start server:", err);
    process.exit(1);
  });

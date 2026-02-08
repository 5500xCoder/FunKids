import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import AdminUser from "../models/AdminUser.js";

dotenv.config();

const args = process.argv.slice(2);
const getArg = (name) => {
  const idx = args.indexOf(name);
  return idx >= 0 ? args[idx + 1] : null;
};

const email = getArg("--email");
const password = getArg("--password");

if (!email || !password) {
  console.error("Usage: node scripts/createAdmin.js --email you@example.com --password yourpass");
  process.exit(1);
}

const run = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is missing in environment variables");
  }

  await mongoose.connect(uri, {
    dbName: process.env.MONGODB_DB || "funkids_studio"
  });

  const existing = await AdminUser.findOne({ email: email.toLowerCase() });
  if (existing) {
    console.log("Admin already exists for this email.");
    process.exit(0);
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await AdminUser.create({ email: email.toLowerCase(), passwordHash });
  console.log("Admin user created successfully.");
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

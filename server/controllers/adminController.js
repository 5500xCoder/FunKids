import bcrypt from "bcryptjs";
import AdminUser from "../models/AdminUser.js";

export const listAdmins = async (req, res, next) => {
  try {
    const admins = await AdminUser.find().select("email createdAt updatedAt").sort({ createdAt: -1 });
    res.json(admins);
  } catch (err) {
    next(err);
  }
};

export const createAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const existing = await AdminUser.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: "Admin already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const admin = await AdminUser.create({ email: email.toLowerCase(), passwordHash });

    res.status(201).json({
      message: "Admin created",
      data: { id: admin._id, email: admin.email, createdAt: admin.createdAt }
    });
  } catch (err) {
    next(err);
  }
};

export const resetAdminPassword = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const updated = await AdminUser.findByIdAndUpdate(
      id,
      { passwordHash },
      { new: true }
    ).select("email updatedAt");

    if (!updated) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.json({ message: "Password reset", data: updated });
  } catch (err) {
    next(err);
  }
};

export const deleteAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (req.user?.id === id) {
      return res.status(400).json({ message: "You cannot delete your own account" });
    }

    const deleted = await AdminUser.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.json({ message: "Admin deleted" });
  } catch (err) {
    next(err);
  }
};

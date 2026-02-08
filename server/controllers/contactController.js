import ContactMessage from "../models/ContactMessage.js";

const isValidEmail = (email) => {
  return /\S+@\S+\.\S+/.test(email);
};

export const createContactMessage = async (req, res, next) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Please provide a valid email" });
    }

    const saved = await ContactMessage.create({ name, email, message });
    return res.status(201).json({
      message: "Thanks for reaching out. We'll get back to you soon.",
      data: { id: saved._id }
    });
  } catch (err) {
    next(err);
  }
};

export const getContactMessages = async (req, res, next) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    next(err);
  }
};

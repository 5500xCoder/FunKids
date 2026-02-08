import JobOpportunity from "../models/JobOpportunity.js";
import JobApplication from "../models/JobApplication.js";

const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

export const getJobs = async (req, res, next) => {
  try {
    const jobs = await JobOpportunity.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    next(err);
  }
};

export const createJob = async (req, res, next) => {
  try {
    const { jobId, title, description, skillsRequired, status } = req.body;

    if (!jobId || !title || !description) {
      return res.status(400).json({ message: "Job ID, title, and description are required" });
    }

    const existing = await JobOpportunity.findOne({ jobId: jobId.trim() });
    if (existing) {
      return res.status(409).json({ message: "Job ID already exists" });
    }

    const job = await JobOpportunity.create({
      jobId: jobId.trim(),
      title: title.trim(),
      description: description.trim(),
      skillsRequired: Array.isArray(skillsRequired)
        ? skillsRequired.map((s) => s.trim()).filter(Boolean)
        : [],
      status: status === "closed" ? "closed" : "open"
    });

    res.status(201).json({ message: "Job created", data: job });
  } catch (err) {
    next(err);
  }
};

export const updateJob = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { jobId, title, description, skillsRequired, status } = req.body;

    if (!jobId || !title || !description) {
      return res.status(400).json({ message: "Job ID, title, and description are required" });
    }

    const existing = await JobOpportunity.findOne({ jobId: jobId.trim(), _id: { $ne: id } });
    if (existing) {
      return res.status(409).json({ message: "Job ID already exists" });
    }

    const updated = await JobOpportunity.findByIdAndUpdate(
      id,
      {
        jobId: jobId.trim(),
        title: title.trim(),
        description: description.trim(),
        skillsRequired: Array.isArray(skillsRequired)
          ? skillsRequired.map((s) => s.trim()).filter(Boolean)
          : [],
        status: status === "closed" ? "closed" : "open"
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.json({ message: "Job updated", data: updated });
  } catch (err) {
    next(err);
  }
};

export const deleteJob = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await JobOpportunity.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.json({ message: "Job deleted" });
  } catch (err) {
    next(err);
  }
};

export const applyToJob = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, message, portfolioUrl } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: "Name, email, and message are required" });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Please provide a valid email" });
    }

    const job = await JobOpportunity.findById(id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.status === "closed") {
      return res.status(400).json({ message: "This opportunity is closed" });
    }

    const application = await JobApplication.create({
      job: job._id,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim(),
      portfolioUrl: portfolioUrl?.trim() || ""
    });

    res.status(201).json({ message: "Application submitted", data: { id: application._id } });
  } catch (err) {
    next(err);
  }
};

export const getApplications = async (req, res, next) => {
  try {
    const applications = await JobApplication.find()
      .populate("job", "jobId title")
      .sort({ createdAt: -1 });
    res.json(applications);
  } catch (err) {
    next(err);
  }
};

import Project from "../models/Project.js";

const seedProjects = [
  {
    title: "Sona Mona Rhymes",
    description: "Kids YouTube channel featuring joyful rhymes and playful learning.",
    status: "current"
  },
  {
    title: "FunKids Stories",
    description: "Coming soon: story-driven animations that inspire imagination.",
    status: "upcoming"
  },
  {
    title: "FunKids Learning",
    description: "Coming soon: educational content designed for curious minds.",
    status: "upcoming"
  },
  {
    title: "Animation Series",
    description: "Coming soon: episodic adventures with lovable characters.",
    status: "upcoming"
  }
];

export const getProjects = async (req, res, next) => {
  try {
    const count = await Project.countDocuments();
    if (count === 0) {
      await Project.insertMany(seedProjects);
    }

    const projects = await Project.find().sort({ status: 1, createdAt: 1 });
    res.json(projects);
  } catch (err) {
    next(err);
  }
};

export const createProject = async (req, res, next) => {
  try {
    const { title, description, status } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required" });
    }

    const project = await Project.create({
      title: title.trim(),
      description: description.trim(),
      status: status === "current" ? "current" : "upcoming"
    });

    res.status(201).json({ message: "Project created", data: project });
  } catch (err) {
    next(err);
  }
};

export const updateProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required" });
    }

    const updated = await Project.findByIdAndUpdate(
      id,
      {
        title: title.trim(),
        description: description.trim(),
        status: status === "current" ? "current" : "upcoming"
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json({ message: "Project updated", data: updated });
  } catch (err) {
    next(err);
  }
};

export const deleteProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await Project.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.json({ message: "Project deleted" });
  } catch (err) {
    next(err);
  }
};

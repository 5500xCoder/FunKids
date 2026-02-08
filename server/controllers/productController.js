import Product from "../models/Product.js";

export const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    next(err);
  }
};

export const getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    next(err);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const { title, description, price, imageUrl, category, isActive } = req.body;

    if (!title || !description || price === undefined) {
      return res.status(400).json({ message: "Title, description, and price are required" });
    }

    const product = await Product.create({
      title: title.trim(),
      description: description.trim(),
      price: Number(price),
      imageUrl: imageUrl?.trim() || "",
      category: category?.trim() || "",
      isActive: isActive !== false
    });

    res.status(201).json({ message: "Product created", data: product });
  } catch (err) {
    next(err);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, price, imageUrl, category, isActive } = req.body;

    if (!title || !description || price === undefined) {
      return res.status(400).json({ message: "Title, description, and price are required" });
    }

    const updated = await Product.findByIdAndUpdate(
      id,
      {
        title: title.trim(),
        description: description.trim(),
        price: Number(price),
        imageUrl: imageUrl?.trim() || "",
        category: category?.trim() || "",
        isActive: Boolean(isActive)
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product updated", data: updated });
  } catch (err) {
    next(err);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product deleted" });
  } catch (err) {
    next(err);
  }
};

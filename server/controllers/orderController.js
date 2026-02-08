import Product from "../models/Product.js";
import Order from "../models/Order.js";

const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

export const createOrder = async (req, res, next) => {
  try {
    const { items, customer } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    if (!customer?.name || !customer?.email || !customer?.address || !customer?.city || !customer?.state || !customer?.pincode) {
      return res.status(400).json({ message: "Complete customer information is required" });
    }

    if (!isValidEmail(customer.email)) {
      return res.status(400).json({ message: "Please provide a valid email" });
    }

    const productIds = items.map((item) => item.productId);
    const products = await Product.find({ _id: { $in: productIds }, isActive: true });

    const productMap = new Map(products.map((p) => [p._id.toString(), p]));

    let subtotal = 0;
    const orderItems = items.map((item) => {
      const product = productMap.get(item.productId);
      if (!product) {
        throw new Error("One or more products are unavailable");
      }
      const quantity = Number(item.quantity || 1);
      subtotal += product.price * quantity;
      return {
        product: product._id,
        title: product.title,
        price: product.price,
        quantity
      };
    });

    const order = await Order.create({
      items: orderItems,
      subtotal,
      customer: {
        name: customer.name.trim(),
        email: customer.email.trim().toLowerCase(),
        phone: customer.phone?.trim() || "",
        address: customer.address.trim(),
        city: customer.city.trim(),
        state: customer.state.trim(),
        pincode: customer.pincode.trim()
      }
    });

    res.status(201).json({ message: "Order placed", data: { id: order._id } });
  } catch (err) {
    next(err);
  }
};

export const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    next(err);
  }
};

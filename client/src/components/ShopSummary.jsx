import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";

const ShopSummary = () => {
  const { items, subtotal } = useCart();
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  if (itemCount === 0) return null;

  return (
    <div className="shop-summary">
      <p>
        You have <strong>{itemCount}</strong> item{itemCount > 1 ? "s" : ""} in your cart. Subtotal:
        <strong> ₹{subtotal.toFixed(0)}</strong>
      </p>
      <Link to="/cart" className="btn primary">
        Go to Cart
      </Link>
    </div>
  );
};

export default ShopSummary;

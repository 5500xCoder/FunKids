import React, { useState } from "react";
import { useCart } from "../context/CartContext.jsx";

const Cart = () => {
  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const { items, updateQuantity, removeItem, clearCart, subtotal } = useCart();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: ""
  });
  const [status, setStatus] = useState({ type: "", message: "" });

  const formatPrice = (value) => `₹${value.toFixed(0)}`;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (items.length === 0) {
      setStatus({ type: "error", message: "Your cart is empty." });
      return;
    }

    try {
      const res = await fetch(`${baseUrl}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({ productId: item.productId, quantity: item.quantity })),
          customer: form
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Unable to place order");
      }

      setStatus({ type: "success", message: "Order placed successfully." });
      clearCart();
      setForm({ name: "", email: "", phone: "", address: "", city: "", state: "", pincode: "" });
    } catch (err) {
      setStatus({ type: "error", message: err.message });
    }
  };

  return (
    <div className="page">
      <section className="page-hero">
        <h1>Your Cart</h1>
        <p>Review your items and submit an order inquiry.</p>
      </section>

      {status.message && <div className={`alert ${status.type}`}>{status.message}</div>}

      <section className="section split">
        <div className="cart-list">
          {items.length === 0 && (
            <div className="card">
              <h3>No items in cart</h3>
              <p>Visit the store to add FunKids products.</p>
            </div>
          )}
          {items.map((item) => (
            <div key={item.productId} className="cart-item">
              <div>
                <h3>{item.title}</h3>
                <p className="muted">{formatPrice(item.price)} each</p>
              </div>
              <div className="cart-controls">
                <button
                  className="btn ghost"
                  type="button"
                  onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  className="btn ghost"
                  type="button"
                  onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                >
                  +
                </button>
                <button className="btn secondary" type="button" onClick={() => removeItem(item.productId)}>
                  Remove
                </button>
              </div>
            </div>
          ))}
          <div className="cart-summary">
            <h3>Subtotal</h3>
            <p className="price">{formatPrice(subtotal)}</p>
          </div>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          <h2>Checkout (No Payment)</h2>
          <label>
            Full Name
            <input name="name" value={form.name} onChange={handleChange} required />
          </label>
          <label>
            Email
            <input type="email" name="email" value={form.email} onChange={handleChange} required />
          </label>
          <label>
            Phone
            <input name="phone" value={form.phone} onChange={handleChange} />
          </label>
          <label>
            Address
            <textarea name="address" rows="3" value={form.address} onChange={handleChange} required />
          </label>
          <label>
            City
            <input name="city" value={form.city} onChange={handleChange} required />
          </label>
          <label>
            State
            <input name="state" value={form.state} onChange={handleChange} required />
          </label>
          <label>
            Pincode
            <input name="pincode" value={form.pincode} onChange={handleChange} required />
          </label>
          <button className="btn primary" type="submit">
            Place Order
          </button>
        </form>
      </section>
    </div>
  );
};

export default Cart;

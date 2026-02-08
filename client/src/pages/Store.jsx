import React, { useEffect, useState } from "react";
import { useCart } from "../context/CartContext.jsx";
import ShopSummary from "../components/ShopSummary.jsx";

const Store = () => {
  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const { addItem } = useCart();
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [status, setStatus] = useState({ type: "", message: "" });

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/products`);
        if (!res.ok) {
          throw new Error("Unable to load products");
        }
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        setStatus({ type: "error", message: "Store items are coming soon." });
      }
    };

    loadProducts();
  }, []);

  const formatPrice = (value) => `₹${value.toFixed(0)}`;

  const categories = [
    "All",
    "Kids Study Materials",
    "Kids Toys",
    "Fancy Dress",
    "Kids Merchandise"
  ];

  const filteredProducts =
    activeCategory === "All"
      ? products
      : products.filter((product) => product.category === activeCategory);

  return (
    <div className="page">
      <section className="page-hero">
        <h1>FunKids Store</h1>
        <p>Shop joyful merch and learning tools crafted for kids and families.</p>
      </section>

      {status.message && <div className={`alert ${status.type}`}>{status.message}</div>}

      <section className="section">
        <div className="section-header">
          <h2>Featured Products</h2>
          <p>Curated collections from FunKids Studio.</p>
        </div>
        <div className="category-tabs">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={`category-tab ${activeCategory === category ? "active" : ""}`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
        <ShopSummary />
        <div className="product-grid">
          {filteredProducts.map((product) => (
            <div key={product._id} className="product-card">
              <div className="product-image">
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.title} />
                ) : (
                  <div className="image-placeholder">FunKids</div>
                )}
              </div>
              <div className="product-info">
                <h3>{product.title}</h3>
                <p>{product.description}</p>
                <div className="product-meta">
                  <span className="price">{formatPrice(product.price)}</span>
                  <button className="btn primary" type="button" onClick={() => addItem(product)}>
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
          {filteredProducts.length === 0 && !status.message && (
            <div className="card">
              <h3>No products in this category</h3>
              <p>We are preparing the FunKids Store collection.</p>
              <span className="badge">Produced by FunKids Studio</span>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Store;

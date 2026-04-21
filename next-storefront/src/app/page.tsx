"use client";

import { useEffect, useMemo, useState } from "react";

type Product = { id: string; name: string; priceCents: number; imageUrl: string; category: string };

const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (search.trim()) params.set("search", search.trim());
      if (category) params.set("category", category);
      const url = params.toString() ? `/api/products?${params.toString()}` : "/api/products";
      const response = await fetch(url, { signal: controller.signal });
      const data = await response.json().catch(() => null);
      setProducts(data?.products ?? []);
      setCategories(data?.categories ?? []);
      setIsLoading(false);
    };

    load().catch(() => setIsLoading(false));
    return () => controller.abort();
  }, [search, category]);

  const productMap = useMemo(() => new Map(products.map((product) => [product.id, product])), [products]);
  const cartItems = useMemo(
    () => Object.entries(cart).flatMap(([productId, quantity]) => {
      const product = productMap.get(productId);
      return product ? [{ product, quantity }] : [];
    }),
    [cart, productMap],
  );

  const subtotalCents = cartItems.reduce((sum, item) => sum + item.product.priceCents * item.quantity, 0);
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const setQuantity = (productId: string, quantity: number) => {
    setCart((current) => {
      const next = { ...current };
      if (quantity <= 0) delete next[productId];
      else next[productId] = Math.min(99, quantity);
      return next;
    });
  };

  const placeOrder = async () => {
    if (cartItems.length === 0) return;
    setIsSubmitting(true);
    setMessage(null);
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: cartItems.map(({ product, quantity }) => ({ productId: product.id, quantity })) }),
    });
    setIsSubmitting(false);
    if (!response.ok) {
      setMessage("Unable to place order.");
      return;
    }
    setCart({});
    setMessage("Order placed.");
  };

  return (
    <main className="container-fluid pb-5">
      <div className="page-layout mx-auto px-3 px-md-4">
        <section className="storefront-section d-grid gap-4">
          <div className="search-panel p-4">
            <div className="d-flex flex-column flex-md-row gap-3 align-items-md-end">
              <label className="flex-grow-1">
                <div className="small fw-semibold mb-1">Search</div>
                <input className="form-control" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search products" />
              </label>
              <label className="flex-grow-1">
                <div className="small fw-semibold mb-1">Category</div>
                <select className="form-select" value={category} onChange={(event) => setCategory(event.target.value)}>
                  <option value="">All categories</option>
                  {categories.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </label>
            </div>
          </div>

          <div className="d-flex flex-wrap gap-2">
            <button type="button" className={`btn filter-pill ${!category ? "filter-pill--selected" : ""}`} onClick={() => setCategory("")}>All</button>
            {categories.map((item) => <button type="button" key={item} className={`btn filter-pill ${category === item ? "filter-pill--selected" : ""}`} onClick={() => setCategory(item)}>{item}</button>)}
          </div>

          <div className="d-grid gap-3">
            {isLoading ? <div className="search-panel p-4">Loading products...</div> : products.map((product) => (
              <article key={product.id} className="product-card p-3 p-md-4">
                <div className="row g-3 align-items-center">
                  <div className="col-4 col-md-3"><img src={product.imageUrl} alt={product.name} className="img-fluid rounded-3" /></div>
                  <div className="col-8 col-md-6">
                    <div className="small text-secondary-custom">{product.category}</div>
                    <h2 className="h5 mb-2">{product.name}</h2>
                    <div className="price-text fw-semibold">{money.format(product.priceCents / 100)}</div>
                  </div>
                  <div className="col-12 col-md-3 text-md-end"><button type="button" className="btn add-to-cart-button" onClick={() => setQuantity(product.id, (cart[product.id] ?? 0) + 1)}>Add to cart</button></div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <aside className="cart p-4 d-grid gap-3">
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="h5 mb-0">Cart Summary</h2>
            <span className="badge text-bg-light">{itemCount} items</span>
          </div>
          {cartItems.length === 0 ? <div className="text-secondary-custom">Your cart is empty.</div> : cartItems.map(({ product, quantity }) => (
            <div key={product.id} className="border rounded-3 p-3 d-grid gap-2">
              <div className="d-flex justify-content-between gap-2"><div><div className="fw-semibold">{product.name}</div><div className="small text-secondary-custom">{money.format(product.priceCents / 100)} each</div></div><div className="price-text fw-semibold">{money.format((product.priceCents * quantity) / 100)}</div></div>
              <div className="d-flex gap-2 align-items-center">
                <input className="form-control form-control-sm" type="number" min={0} max={99} value={quantity} onChange={(event) => setQuantity(product.id, Number(event.target.value))} />
              </div>
            </div>
          ))}
          <div className="d-flex justify-content-between fw-semibold"><span>Subtotal</span><span>{money.format(subtotalCents / 100)}</span></div>
          <div className="d-flex gap-2">
            <button type="button" className="btn cart-button--secondary flex-fill" onClick={() => setCart({})}>Clear Cart</button>
            <button type="button" className="btn cart-button--primary flex-fill" disabled={cartItems.length === 0 || isSubmitting} onClick={placeOrder}>{isSubmitting ? "Placing..." : "Place Order"}</button>
          </div>
          {message ? <div className="small text-secondary-custom">{message}</div> : null}
        </aside>
      </div>
    </main>
  );
}

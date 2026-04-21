"use client";

import { useEffect, useState } from "react";

type Order = {
  id: string;
  createdAt: string;
  totalCents: number;
  status: "pending" | "confirmed" | "cancelled";
  items: { productId: string; quantity: number; priceCents: number }[];
};

const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  const loadOrders = async () => {
    setIsLoading(true);
    setError(null);
    const response = await fetch("/api/orders");
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      setError(data?.error ?? "Failed to load orders.");
      setIsLoading(false);
      return;
    }

    setOrders(data?.orders ?? []);
    setIsLoading(false);
  };

  useEffect(() => {
    loadOrders().catch(() => {
      setError("Failed to load orders.");
      setIsLoading(false);
    });
  }, []);

  const updateStatus = async (id: string, status: Order["status"]) => {
    setUpdatingOrderId(id);
    const snapshot = orders;
    setOrders((current) => current.map((order) => (order.id === id ? { ...order, status } : order)));

    const response = await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      setOrders(snapshot);
      await loadOrders();
      setUpdatingOrderId(null);
      return;
    }

    const data = await response.json().catch(() => null);
    if (data?.order) {
      setOrders((current) => current.map((order) => (order.id === id ? data.order : order)));
    }

    setUpdatingOrderId(null);
  };

  return (
    <main className="container-fluid pb-5">
      <div className="page-layout mx-auto px-3 px-md-4">
        <section className="storefront-section d-grid gap-3">
          <h1 className="h3 mb-0">Orders</h1>
          {isLoading ? (
            <div className="search-panel p-4">Loading orders...</div>
          ) : error ? (
            <div className="search-panel p-4 text-danger">{error}</div>
          ) : orders.length === 0 ? (
            <div className="search-panel p-4 text-secondary-custom">No orders yet.</div>
          ) : (
            orders.map((order) => {
              const syncing = updatingOrderId === order.id;
              return (
                <article key={order.id} className="product-card p-3 p-md-4 d-grid gap-3">
                  <div className="d-flex flex-column flex-md-row justify-content-between gap-2">
                    <div>
                      <div className="fw-semibold">{order.id}</div>
                      <div className="small text-secondary-custom">{new Date(order.createdAt).toLocaleString()}</div>
                    </div>
                    <div className={`badge orders-status--${order.status}`}>{order.status}</div>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span>Total</span>
                    <span className="price-text fw-semibold">{money.format(order.totalCents / 100)}</span>
                  </div>
                  <div className="d-flex gap-2 flex-wrap">
                    <button
                      className="btn cart-button--primary"
                      disabled={order.status !== "pending" || syncing}
                      onClick={() => updateStatus(order.id, "confirmed")}
                    >
                      {syncing ? "Processing..." : "Confirm"}
                    </button>
                    <button
                      className="btn cart-button--secondary"
                      disabled={order.status !== "pending" || syncing}
                      onClick={() => updateStatus(order.id, "cancelled")}
                    >
                      {syncing ? "Processing..." : "Cancel"}
                    </button>
                  </div>
                </article>
              );
            })
          )}
        </section>
      </div>
    </main>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";

type Product = {
  id: string;
  name: string;
  priceCents: number;
  imageUrl: string;
  category: string;
};

type ProductDraft = {
  name: string;
  priceCents: string;
  category: string;
  imageUrl: string;
};

const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const placeholderImage = "/file.svg";

const emptyDraft: ProductDraft = {
  name: "",
  priceCents: "",
  category: "",
  imageUrl: placeholderImage,
};

function toDraft(product: Product): ProductDraft {
  return {
    name: product.name,
    priceCents: String(product.priceCents),
    category: product.category,
    imageUrl: product.imageUrl || placeholderImage,
  };
}

export default function ManagePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [draft, setDraft] = useState<ProductDraft>(emptyDraft);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = async () => {
    setIsLoading(true);
    setError(null);
    const response = await fetch("/api/products");
    const data = await response.json().catch(() => null);
    if (!response.ok) {
      setError(data?.error ?? "Failed to load products.");
      setIsLoading(false);
      return;
    }
    setProducts(data?.products ?? []);
    setCategories(data?.categories ?? []);
    setIsLoading(false);
  };

  useEffect(() => {
    loadProducts().catch(() => {
      setError("Failed to load products.");
      setIsLoading(false);
    });
  }, []);

  const categoryOptions = useMemo(() => {
    const merged = new Set(categories);
    for (const product of products) merged.add(product.category);
    return Array.from(merged);
  }, [categories, products]);

  const resetForm = () => {
    setDraft(emptyDraft);
    setEditingId(null);
    setMessage(null);
    setError(null);
  };

  const submitProduct = async () => {
    setIsSaving(true);
    setMessage(null);
    setError(null);

    const payload = {
      name: draft.name.trim(),
      priceCents: Number(draft.priceCents),
      category: draft.category.trim(),
      imageUrl: draft.imageUrl.trim() || placeholderImage,
    };

    const response = await fetch("/api/products", {
      method: editingId ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editingId ? { id: editingId, ...payload } : payload),
    });

    const data = await response.json().catch(() => null);
    if (!response.ok) {
      setError(data?.error ?? "Unable to save product.");
      setIsSaving(false);
      return;
    }

    setMessage(editingId ? "Product updated." : "Product added.");
    resetForm();
    await loadProducts();
    setIsSaving(false);
  };

  const editProduct = (product: Product) => {
    setEditingId(product.id);
    setDraft(toDraft(product));
    setMessage(null);
    setError(null);
  };

  const deleteProduct = async (id: string) => {
    if (!window.confirm("Delete this product?")) return;
    const response = await fetch(`/api/products?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    const data = await response.json().catch(() => null);
    if (!response.ok) {
      setError(data?.error ?? "Unable to delete product.");
      return;
    }
    if (editingId === id) resetForm();
    setMessage("Product deleted.");
    await loadProducts();
  };

  return (
    <main className="container-fluid pb-5">
      <div className="page-layout mx-auto px-3 px-md-4">
        <section className="storefront-section d-grid gap-3">
          <div className="search-panel p-4 d-grid gap-2">
            <div className="d-flex flex-column flex-md-row justify-content-between gap-2 align-items-md-center">
              <div>
                <h1 className="h3 mb-1">Manage products</h1>
                <p className="mb-0 text-secondary-custom">Add, edit, and delete product records using placeholder images by default.</p>
              </div>
              <button type="button" className="btn manage-button--secondary" onClick={resetForm}>
                New product
              </button>
            </div>
          </div>

          <form
            className="manage-form p-4 d-grid gap-3"
            onSubmit={(event) => {
              event.preventDefault();
              submitProduct().catch(() => setError("Unable to save product."));
            }}
          >
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Name</label>
                <input
                  className="form-control"
                  value={draft.name}
                  onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))}
                  placeholder="Product name"
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Price</label>
                <input
                  className="form-control"
                  type="number"
                  min={1}
                  value={draft.priceCents}
                  onChange={(event) => setDraft((current) => ({ ...current, priceCents: event.target.value }))}
                  placeholder="12999"
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Category</label>
                <input
                  className="form-control"
                  list="manage-category-list"
                  value={draft.category}
                  onChange={(event) => setDraft((current) => ({ ...current, category: event.target.value }))}
                  placeholder="Electronics"
                  required
                />
                <datalist id="manage-category-list">
                  {categoryOptions.map((item) => (
                    <option key={item} value={item} />
                  ))}
                </datalist>
              </div>
              <div className="col-md-6">
                <label className="form-label">Image URL</label>
                <input
                  className="form-control"
                  value={draft.imageUrl}
                  onChange={(event) => setDraft((current) => ({ ...current, imageUrl: event.target.value }))}
                  placeholder={placeholderImage}
                  required
                />
              </div>
            </div>

            <div className="d-flex gap-2 flex-wrap">
              <button type="submit" className="btn manage-button--primary" disabled={isSaving}>
                {isSaving ? "Saving..." : editingId ? "Update product" : "Add product"}
              </button>
              <button type="button" className="btn manage-button--secondary" onClick={resetForm}>
                Cancel
              </button>
            </div>

            {message ? <div className="small text-secondary-custom">{message}</div> : null}
            {error ? <div className="small text-danger">{error}</div> : null}
          </form>

          {isLoading ? (
            <div className="search-panel p-4">Loading products...</div>
          ) : products.length === 0 ? (
            <div className="search-panel p-4 text-secondary-custom">No products found.</div>
          ) : (
            products.map((product) => {
              const editing = editingId === product.id;
              return (
                <article key={product.id} className={`product-card p-3 p-md-4 ${editing ? "manage-card--editing" : ""}`}>
                  <div className="row g-3 align-items-center">
                    <div className="col-4 col-md-2">
                      <img src={product.imageUrl || placeholderImage} alt={product.name} className="img-fluid rounded-3" />
                    </div>
                    <div className="col-8 col-md-6">
                      <div className="small text-secondary-custom">{product.category}</div>
                      <h2 className="h5 mb-1">{product.name}</h2>
                      <div className="price-text fw-semibold">{money.format(product.priceCents / 100)}</div>
                      <div className="small text-muted-custom">{product.id}</div>
                    </div>
                    <div className="col-12 col-md-4">
                      <div className="d-flex gap-2 flex-wrap justify-content-md-end">
                        <button type="button" className="btn manage-button--secondary" onClick={() => editProduct(product)}>
                          Edit
                        </button>
                        <button type="button" className="btn manage-button--danger" onClick={() => deleteProduct(product.id)}>
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </section>

        <aside className="cart p-4 d-grid gap-3">
          <h2 className="h5 mb-0">Manage tips</h2>
          <div className="text-secondary-custom">
            Keep `imageUrl` pointed at a placeholder for now. Edit mode updates the selected product in place.
          </div>
          <div className="border rounded-3 p-3 bg-light d-grid gap-2">
            <div className="fw-semibold">Current state</div>
            <div className="small text-secondary-custom">Products: {products.length}</div>
            <div className="small text-secondary-custom">Categories: {categoryOptions.length}</div>
            <div className="small text-secondary-custom">Editing: {editingId ?? "none"}</div>
          </div>
        </aside>
      </div>
    </main>
  );
}

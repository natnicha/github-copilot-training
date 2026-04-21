import { NextResponse } from "next/server";
import { getDb, type Product } from "../db";

function normalizeProduct(body: unknown) {
  if (!body || typeof body !== "object") return null;
  const candidate = body as Record<string, unknown>;
  const name = typeof candidate.name === "string" ? candidate.name.trim() : "";
  const imageUrl = typeof candidate.imageUrl === "string" ? candidate.imageUrl.trim() : "";
  const category = typeof candidate.category === "string" ? candidate.category.trim() : "";
  const priceCents = Number(candidate.priceCents);
  if (!name || !imageUrl || !category || !Number.isInteger(priceCents) || priceCents <= 0) return null;
  return { name, imageUrl, category, priceCents };
}

export async function GET(request: Request) {
  const db = await getDb();
  const url = new URL(request.url);
  const search = url.searchParams.get("search")?.trim().toLowerCase() ?? "";
  const category = url.searchParams.get("category")?.trim() ?? "";

  const products = db.data.products.filter((product: Product) => {
    const matchesSearch = !search || [product.name, product.category].some((value) => value.toLowerCase().includes(search));
    const matchesCategory = !category || product.category === category;
    return matchesSearch && matchesCategory;
  });

  return NextResponse.json({ products, categories: db.data.categories });
}

export async function POST(request: Request) {
  const db = await getDb();
  const normalized = normalizeProduct(await request.json().catch(() => null));
  if (!normalized) {
    return NextResponse.json({ error: "Invalid product payload." }, { status: 400 });
  }

  const product: Product = {
    id: `prd-${String(db.data.products.length + 1).padStart(3, "0")}`,
    ...normalized,
  };

  db.data.products.push(product);
  if (!db.data.categories.includes(product.category)) {
    db.data.categories.push(product.category);
  }
  await db.write();

  return NextResponse.json({ product }, { status: 201 });
}

export async function PATCH(request: Request) {
  const db = await getDb();
  const body = await request.json().catch(() => null);
  if (!body || typeof body.id !== "string") {
    return NextResponse.json({ error: "Invalid product payload." }, { status: 400 });
  }

  const normalized = normalizeProduct(body);
  if (!normalized) {
    return NextResponse.json({ error: "Invalid product payload." }, { status: 400 });
  }

  const product = db.data.products.find((entry: Product) => entry.id === body.id.trim());
  if (!product) {
    return NextResponse.json({ error: "Product not found." }, { status: 404 });
  }

  product.name = normalized.name;
  product.imageUrl = normalized.imageUrl;
  product.category = normalized.category;
  product.priceCents = normalized.priceCents;
  if (!db.data.categories.includes(product.category)) {
    db.data.categories.push(product.category);
  }
  await db.write();

  return NextResponse.json({ product });
}

export async function DELETE(request: Request) {
  const db = await getDb();
  const url = new URL(request.url);
  const id = url.searchParams.get("id")?.trim() ?? "";
  if (!id) {
    return NextResponse.json({ error: "Invalid product id." }, { status: 400 });
  }

  const index = db.data.products.findIndex((entry: Product) => entry.id === id);
  if (index < 0) {
    return NextResponse.json({ error: "Product not found." }, { status: 404 });
  }

  db.data.products.splice(index, 1);
  await db.write();

  return NextResponse.json({ ok: true });
}

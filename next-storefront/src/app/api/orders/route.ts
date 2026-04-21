import { NextResponse } from "next/server";
import { getDb, type Order, type OrderItem, type Product } from "../db";

function nextOrderId(existing: string[]) {
  const numbers = existing
    .map((id) => Number(id.replace(/^ORD-/, "")))
    .filter((value) => Number.isInteger(value) && value > 0);
  const next = numbers.length ? Math.max(...numbers) + 1 : 1;
  return `ORD-${String(next).padStart(3, "0")}`;
}

export async function GET() {
  const db = await getDb();
  return NextResponse.json({ orders: db.data.orders });
}

export async function POST(request: Request) {
  const db = await getDb();
  const body = await request.json().catch(() => null);

  if (!body || !Array.isArray(body.items) || body.items.length === 0) {
    return NextResponse.json({ error: "Invalid order payload." }, { status: 400 });
  }

  const items: OrderItem[] = [];
  let totalCents = 0;

  for (const entry of body.items) {
    const productId = typeof entry?.productId === "string" ? entry.productId.trim() : "";
    const quantity = Number(entry?.quantity);
    if (!productId || !Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
      return NextResponse.json({ error: "Invalid order item." }, { status: 400 });
    }

    const product = db.data.products.find((candidate: Product) => candidate.id === productId);
    if (!product) {
      return NextResponse.json({ error: `Product not found: ${productId}` }, { status: 404 });
    }

    items.push({ productId, quantity, priceCents: product.priceCents });
    totalCents += product.priceCents * quantity;
  }

  const order: Order = {
    id: nextOrderId(db.data.orders.map((orderItem: Order) => orderItem.id)),
    createdAt: new Date().toISOString(),
    totalCents,
    items,
    status: "pending",
  };

  db.data.orders.unshift(order);
  await db.write();

  return NextResponse.json({ order }, { status: 201 });
}

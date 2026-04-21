import { NextResponse } from "next/server";
import { getDb, type Order, type OrderStatus } from "../../db";

const allowedStatuses: OrderStatus[] = ["pending", "confirmed", "cancelled"];

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json().catch(() => null);
  const status = body?.status as OrderStatus | undefined;

  if (!id || !id.startsWith("ORD-")) {
    return NextResponse.json({ error: "Invalid order id." }, { status: 400 });
  }

  if (!status || !allowedStatuses.includes(status)) {
    return NextResponse.json({ error: "Invalid order status." }, { status: 400 });
  }

  const db = await getDb();
  const order = db.data.orders.find((entry: Order) => entry.id === id);
  if (!order) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }

  order.status = status;
  await db.write();

  return NextResponse.json({ order });
}

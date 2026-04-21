import { cache } from "react";
import { join } from "path";
import { JSONFilePreset } from "lowdb/node";

export interface Product {
  id: string;
  name: string;
  priceCents: number;
  imageUrl: string;
  category: string;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  priceCents: number;
}

export type OrderStatus = "pending" | "confirmed" | "cancelled";

export interface Order {
  id: string;
  createdAt: string;
  totalCents: number;
  items: OrderItem[];
  status: OrderStatus;
}

export interface DbData {
  products: Product[];
  categories: string[];
  orders: Order[];
}

const defaultData: DbData = {
  products: [
    { id: "prd-001", name: "Aurora Headphones", priceCents: 12999, imageUrl: "https://images.unsplash.com/photo-1518441902117-f0a3c9f0b6d8?w=400", category: "Electronics" },
    { id: "prd-002", name: "Nimbus Lamp", priceCents: 5999, imageUrl: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400", category: "Home" },
    { id: "prd-003", name: "Everyday Jacket", priceCents: 8999, imageUrl: "https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=400", category: "Apparel" },
    { id: "prd-004", name: "Pocket Speaker", priceCents: 3999, imageUrl: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400", category: "Electronics" }
  ],
  categories: ["Electronics", "Home", "Apparel"],
  orders: [],
};

let dbPromise: Promise<any> | null = null;

async function loadDb() {
  const file = join(process.cwd(), "db.json");
  const db = await JSONFilePreset<DbData>(file, defaultData);
  await db.read();
  db.data ??= defaultData;
  db.data.products ??= defaultData.products;
  db.data.categories ??= defaultData.categories;
  db.data.orders ??= [];

  let changed = false;
  if (!db.data.categories) {
    db.data.categories = defaultData.categories;
    changed = true;
  }
  if (!db.data.products) {
    db.data.products = defaultData.products;
    changed = true;
  }
  if (!db.data.orders) {
    db.data.orders = [];
    changed = true;
  }
  if (changed) {
    await db.write();
  }

  return db;
}

export const getDb = cache(async () => {
  dbPromise ??= loadDb();
  return dbPromise;
});

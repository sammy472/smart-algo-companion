import { pgTable, serial, text, varchar, integer, timestamp, boolean } from "drizzle-orm/pg-core";

export const farmers = pgTable("farmers", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }),
  address: text("address"),
  location: varchar("location", { length: 255 }),
  phone: varchar("phone", { length: 15 }),
  password: text("password"),
  email: varchar("email", { length: 255 }).unique(),
  avatar: text("avatar"),
  dateCreated: timestamp("date_created").defaultNow(),
});

export const buyers = pgTable("buyers", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).unique(),
  phone: varchar("phone", { length: 15 }),
  password: text("password"),
  address: text("address"),
  location: varchar("location", { length: 255 }),
  avatar: text("avatar"),
  dateCreated: timestamp("date_created").defaultNow(),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }),
  quantity: integer("quantity"),
  price: integer("price"),
  status: varchar("status", { length: 100 }),
  productLocation: varchar("product_location", { length: 255 }),
  dateCreated: timestamp("date_created").defaultNow(),
  avatar: text("avatar"),
  farmerId: integer("farmer_id").references(() => farmers.id),
});

export const devices = pgTable("devices", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }),
  location: varchar("location", { length: 255 }),
  dateInstalled: timestamp("date_installed").defaultNow(),
  farmerId: integer("farmer_id").references(() => farmers.id),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }),
  avatar: text("avatar"),
  price: integer("price"),
  quantity: integer("quantity"),
  status: varchar("status", { length: 100 }).default("pending"),
  farmerConfirmed: boolean("farmer_confirmed").default(false),
  buyerConfirmed: boolean("buyer_confirmed").default(false),
  farmerId: integer("farmer_id").references(() => farmers.id),
  buyerId: integer("buyer_id").references(() => buyers.id),
});

export const carts = pgTable("carts", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").references(() => products.id),
});

export const chats = pgTable("chats", {
  id: serial("id").primaryKey(),
  from: varchar("from", { length: 255 }),
  to: varchar("to", { length: 255 }),
  farmerId: integer("farmer_id").references(() => farmers.id),
  buyerId: integer("buyer_id").references(() => buyers.id),
});

export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }),
  message: text("message"),
  type: varchar("type", { length: 50 }), // e.g., order, message, promo, system
  read: boolean("read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  farmerId: integer("farmer_id").references(() => farmers.id).nullable(),
  buyerId: integer("buyer_id").references(() => buyers.id).nullable(),
});

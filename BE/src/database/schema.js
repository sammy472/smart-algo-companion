import { pgTable, serial, text, varchar, integer, timestamp, boolean, numeric } from "drizzle-orm/pg-core";

export const farmers = pgTable("farmers", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }),
  address: text("address"),
  location: varchar("location", { length: 255 }),
  city: varchar("city", { length: 100 }),
  country: varchar("country", { length: 100 }),
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
  city: varchar("city", { length: 100 }),
  country: varchar("country", { length: 100 }),
  avatar: text("avatar"),
  dateCreated: timestamp("date_created").defaultNow(),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }),
  quantity: integer("quantity"),
  price: numeric("price", { precision: 10, scale: 2 }),
  status: varchar("status", { length: 100 }).default("in stock"),
  productLocation: varchar("product_location", { length: 255 }),
  deliveryOptions: varchar("delivery_options", { length: 255 }),
  dateCreated: timestamp("date_created").defaultNow(),
  avatar: text("avatar").array(3),
  farmerId: integer("farmer_id").references(() => farmers.id).notNull(),
  numberOfOrders: integer("number_of_orders").default(0),
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
  price: numeric("price", { precision: 10, scale: 2 }),
  quantity: integer("quantity"),
  status: varchar("status", { length: 100 }).default("pending"), // pending, accepted, declined, completed, cancelled
  farmerConfirmed: boolean("farmer_confirmed").default(false),
  buyerConfirmed: boolean("buyer_confirmed").default(false),
  declineReason: text("decline_reason"), // Reason if farmer declines
  productId: integer("product_id").references(() => products.id).notNull(),
  farmerId: integer("farmer_id").references(() => farmers.id).notNull(),
  buyerId: integer("buyer_id").references(() => buyers.id).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const carts = pgTable("carts", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").references(() => products.id).notNull(),
  buyerId: integer("buyer_id").references(() => buyers.id).notNull(),
  quantity: integer("quantity").default(1),
});

export const chats = pgTable("chats", {
  id: serial("id").primaryKey(),
  message: text("message").notNull(),
  from: varchar("from", { length: 255 }),
  to: varchar("to", { length: 255 }),
  farmerId: integer("farmer_id").references(() => farmers.id),
  buyerId: integer("buyer_id").references(() => buyers.id),
  productId: integer("product_id").references(() => products.id), // Link to product if conversation is about a product
  createdAt: timestamp("created_at").defaultNow(),
  read: boolean("read").default(false),
});

export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }),
  message: text("message"),
  type: varchar("type", { length: 50 }), // system, user, order, message, profile_update, password_reset, device_login
  read: boolean("read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  farmerId: integer("farmer_id").references(() => farmers.id), // Nullable - can be for farmer or buyer
  buyerId: integer("buyer_id").references(() => buyers.id), // Nullable - can be for farmer or buyer
  relatedId: integer("related_id"), // ID of related order, product, etc.
  relatedType: varchar("related_type", { length: 50 }), // order, product, message, etc.
});

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  status: varchar("status", { length: 50 }).default("pending"), // pending, completed, cancelled, terminated
  createdAt: timestamp("created_at").defaultNow(),
  terminationAt: timestamp("termination_at").$defaultFn(() => new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)), // default to 2 days later
  farmerConfirmed: boolean("farmer_confirmed").default(false),
  buyerConfirmed: boolean("buyer_confirmed").default(false),
  completed: boolean("completed").default(false), // Set to true when both parties confirm
  terminated: boolean("terminated").default(false), // Set to true after 48 hours
  orderId: integer("order_id").references(() => orders.id).notNull()
});

// Password reset tokens
export const passwordResetTokens = pgTable("password_reset_tokens", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull(),
  token: varchar("token", { length: 255 }).notNull(),
  role: varchar("role", { length: 20 }).notNull(), // farmer or buyer
  expiresAt: timestamp("expires_at").notNull(), // 5 minutes from creation
  used: boolean("used").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// AI Crop Detection Results
export const cropDetections = pgTable("crop_detections", {
  id: serial("id").primaryKey(),
  farmerId: integer("farmer_id").references(() => farmers.id).notNull(),
  imageUrl: text("image_url").notNull(),
  videoUrl: text("video_url"), // Optional video
  classification: varchar("classification", { length: 50 }).notNull(), // healthy or unhealthy
  infectionType: varchar("infection_type", { length: 255 }), // Specific infection if unhealthy
  confidence: numeric("confidence", { precision: 5, scale: 2 }), // AI confidence score
  pesticideRecommendation: text("pesticide_recommendation"), // Optional recommendations
  createdAt: timestamp("created_at").defaultNow(),
});

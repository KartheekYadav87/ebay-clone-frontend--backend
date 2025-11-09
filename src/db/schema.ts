import { sqliteTable, integer, text, real } from 'drizzle-orm/sqlite-core';

// Users table
export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  phone: text('phone'),
  address: text('address'),
  userType: text('user_type').notNull(), // 'buyer', 'seller', 'admin'
  createdAt: text('created_at').notNull(),
});

// Products table
export const products = sqliteTable('products', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  sellerId: integer('seller_id').notNull().references(() => users.id),
  name: text('name').notNull(),
  description: text('description'),
  category: text('category').notNull(),
  price: real('price').notNull(),
  quantity: integer('quantity').notNull(),
  isAuction: text('is_auction').notNull(), // 'Y' or 'N'
  expirationDate: text('expiration_date'),
  rating: real('rating'),
  imageUrl: text('image_url'),
  createdAt: text('created_at').notNull(),
});

// Cart table
export const cart = sqliteTable('cart', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  buyerId: integer('buyer_id').notNull().references(() => users.id),
  productId: integer('product_id').notNull().references(() => products.id),
  quantity: integer('quantity').notNull().default(1),
  addedDate: text('added_date').notNull(),
});

// Orders table
export const orders = sqliteTable('orders', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  buyerId: integer('buyer_id').notNull().references(() => users.id),
  totalAmount: real('total_amount').notNull(),
  orderDate: text('order_date').notNull(),
  status: text('status').notNull().default('Pending'),
});

// Order items table
export const orderItems = sqliteTable('order_items', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  orderId: integer('order_id').notNull().references(() => orders.id),
  productId: integer('product_id').notNull().references(() => products.id),
  quantity: integer('quantity').notNull(),
  priceAtPurchase: real('price_at_purchase').notNull(),
});

// Payments table
export const payments = sqliteTable('payments', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  orderId: integer('order_id').notNull().references(() => orders.id),
  paymentType: text('payment_type').notNull(),
  amount: real('amount').notNull(),
  paymentDate: text('payment_date').notNull(),
});

// Bids table
export const bids = sqliteTable('bids', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  productId: integer('product_id').notNull().references(() => products.id),
  buyerId: integer('buyer_id').notNull().references(() => users.id),
  bidAmount: real('bid_amount').notNull(),
  bidDate: text('bid_date').notNull(),
});

// Auctions table
export const auctions = sqliteTable('auctions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  productId: integer('product_id').notNull().unique().references(() => products.id),
  minPrice: real('min_price').notNull(),
  winningBidId: integer('winning_bid_id').references(() => bids.id),
});
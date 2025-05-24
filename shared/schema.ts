import { pgTable, text, serial, integer, boolean, timestamp, varchar, jsonb, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User schema for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  profileImageUrl: true,
});

// API Activity schema
export const apiActivities = pgTable("api_activities", {
  id: serial("id").primaryKey(),
  endpoint: text("endpoint").notNull(),
  method: text("method").notNull(),
  status: integer("status").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const insertApiActivitySchema = createInsertSchema(apiActivities).pick({
  endpoint: true,
  method: true,
  status: true,
});

// API Status schema
export const apiStatuses = pgTable("api_statuses", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  status: text("status").notNull(), // 'operational', 'degraded', 'down'
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertApiStatusSchema = createInsertSchema(apiStatuses).pick({
  name: true,
  status: true,
});

// Metrics schema
export const metrics = pgTable("metrics", {
  id: serial("id").primaryKey(),
  totalUsers: integer("total_users").notNull(),
  apiRequests: integer("api_requests").notNull(),
  avgResponseTime: integer("avg_response_time").notNull(),
  errorRate: text("error_rate").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const insertMetricsSchema = createInsertSchema(metrics).pick({
  totalUsers: true,
  apiRequests: true,
  avgResponseTime: true,
  errorRate: true,
});

// Export types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

export type InsertApiActivity = z.infer<typeof insertApiActivitySchema>;
export type ApiActivity = typeof apiActivities.$inferSelect;

export type InsertApiStatus = z.infer<typeof insertApiStatusSchema>;
export type ApiStatus = typeof apiStatuses.$inferSelect;

export type InsertMetrics = z.infer<typeof insertMetricsSchema>;
export type Metrics = typeof metrics.$inferSelect;

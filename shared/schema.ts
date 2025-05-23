import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  displayName: text("display_name"),
  initials: text("initials"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  displayName: true,
  initials: true,
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
export type User = typeof users.$inferSelect;

export type InsertApiActivity = z.infer<typeof insertApiActivitySchema>;
export type ApiActivity = typeof apiActivities.$inferSelect;

export type InsertApiStatus = z.infer<typeof insertApiStatusSchema>;
export type ApiStatus = typeof apiStatuses.$inferSelect;

export type InsertMetrics = z.infer<typeof insertMetricsSchema>;
export type Metrics = typeof metrics.$inferSelect;

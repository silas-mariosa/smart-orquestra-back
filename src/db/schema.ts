import { relations, sql } from "drizzle-orm";
import { int, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { z } from "zod";

export const authTable = sqliteTable("auth", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  password: text("password").notNull(),
  email: text("email").unique().notNull(),
  phone: text("phone"),
  emailConfirmedAt: integer("email_confirmed_at", { mode: "timestamp" }),
  deletedAt: integer("deleted_at", { mode: "timestamp" }),
  createdAt: text("created_at")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$onUpdate(
    () => new Date()
  ),
});

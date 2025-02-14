import { relations, sql, InferSelectModel } from "drizzle-orm";
import { int, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { z } from "zod";

export const Auth = sqliteTable("auth", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  password: text("password").notNull(),
  email: text("email").unique().notNull(),
  deletedAt: integer("deleted_at", { mode: "timestamp" }),
  createdAt: text("created_at")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$onUpdate(
    () => new Date()
  ),
});

export type AuthType = InferSelectModel<typeof Auth>;

export const Users = sqliteTable("user", {
  id: int("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  brithday: text("brithday"),
  accessLevel: text(["Administrador", "Membro"]).notNull(),
  addressId: int("address_id"),
  orchestraId: int("orchestra_id"),
  instrumentId: int("instrument_id"),
  groupId: int("group_id"),
  auth_id: int("auth_id").notNull(),
  active: integer("active", { mode: "boolean" }).default(true),
  deletedAt: integer("deleted_at", { mode: "timestamp" }),
  createdAt: text("created_at")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$onUpdate(
    () => new Date()
  ),
});

export const userRelations = relations(Users, ({ one }) => ({
  auth: one(Auth),
  Orchestra_create: one(Orchestra), // DONO => one-to-one
  Orchestra_worker: one(Orchestra, {
    // TRABALHAR PARA => one-to-many
    fields: [Users.orchestraId],
    references: [Orchestra.id],
  }),
}));

export const Address = sqliteTable("address", {
  id: int("id").primaryKey({ autoIncrement: true }),
  cep: text("cep"),
  estado: text("estado"),
  cidade: text("cidade"),
  bairro: text("bairro"),
  endereco: text("endereco"),
  numero: text("numero"),
  complemento: text("complemento"),
});

export const addressRelations = relations(Address, ({ one }) => ({
  instituicao: one(Users),
}));

export const Orchestra = sqliteTable("orchestra", {
  id: int("id").primaryKey({ autoIncrement: true }),
  nome_orchestra: text("name").notNull(),
  user_auth: int("auth_id").notNull(),
  auth_id: int("auth_id").notNull(),
  deletedAt: integer("deleted_at", { mode: "timestamp" }),
  createdAt: text("created_at")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$onUpdate(
    () => new Date()
  ),
});

export const orquetraRelations = relations(Orchestra, ({ many }) => ({
  members: many(Users),
}));

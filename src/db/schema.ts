import { relations, sql, InferSelectModel, or } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const Auth = sqliteTable("auth", {
  id: text()
    .primaryKey()
    .$default(() => sql`(lower(hex(randomblob(16))))`),
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
  id: text("id")
    .primaryKey()
    .$default(() => sql`(lower(hex(randomblob(16))))`),
  name: text("name").notNull(),
  brithday: text("brithday"),
  accessLevel: text(["Administrador", "Membro"]).notNull(),
  addressId: text("address_id"),
  orchestraId: text("orchestra_id"),
  auth_id: text("auth_id").notNull(),
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
  id: text("id")
    .primaryKey()
    .$default(() => sql`(lower(hex(randomblob(16))))`),
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
  id: text("id")
    .primaryKey()
    .$default(() => sql`(lower(hex(randomblob(16))))`),
  nome_orchestra: text("name").notNull(),
  user_auth: text("auth_id").notNull(),
  auth_id: text("auth_id").notNull(),
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
  instrumentos: many(Instruments),
  categories: many(categoriesInstruments),
  Louvores: many(Louvores),
  groups: many(Grupos),
}));

export const categoriesInstruments = sqliteTable("categories_instruments", {
  id: text("id")
    .primaryKey()
    .$default(() => sql`(lower(hex(randomblob(16))))`),
  name: text("name").notNull(),
  orchestraId: text("orchestra_id").notNull(),
  deletedAt: integer("deleted_at", { mode: "timestamp" }),
  createdAt: text("created_at")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$onUpdate(
    () => new Date()
  ),
});

export const categoriesInstrumentsRelations = relations(
  categoriesInstruments,
  ({ one }) => ({
    instruments: one(Instruments),
    orchestra: one(Orchestra),
  })
);

export const Instruments = sqliteTable("instruments", {
  id: text("id")
    .primaryKey()
    .$default(() => sql`(lower(hex(randomblob(16))))`),
  nameInstrument: text("name").notNull(),
  orchestraId: text("orchestra_id").notNull(),
  typeInstrument: text("type").notNull(),
  categories: text("categories"),
  description: text("description"),
  deletedAt: integer("deleted_at", { mode: "timestamp" }),
  createdAt: text("created_at")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$onUpdate(
    () => new Date()
  ),
});

export const instrumentsRelations = relations(Instruments, ({ one }) => ({
  orchestra: one(Orchestra),
  categories: one(categoriesInstruments),
}));

export const ListIstruments = sqliteTable("list_instruments", {
  id: text("id")
    .primaryKey()
    .$default(() => sql`(lower(hex(randomblob(16))))`),
  orchestraId: text("orchestra_id").notNull(),
  instrumentId: text("instrument_id").notNull(),
  user_id: text("user_id").notNull(),
  owner: text("owner").notNull(),
  position: text("position"),
  serie: text("serie"),
  brand: text("brand"),
  model: text("model"),
  deletedAt: integer("deleted_at", { mode: "timestamp" }),
  createdAt: text("created_at")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$onUpdate(
    () => new Date()
  ),
});

export const listInstrumentsRelations = relations(
  ListIstruments,
  ({ one }) => ({
    orchestra: one(Orchestra),
    instrument: one(Instruments),
    user: one(Users),
  })
);

export const GroupList = sqliteTable("group_list", {
  id: text("id")
    .primaryKey()
    .$default(() => sql`(lower(hex(randomblob(16))))`),
  GroupId: text("name").notNull(),
  orchestraId: text("orchestra_id").notNull(),
  userId: text("user_id").notNull(),
  deletedAt: integer("deleted_at", { mode: "timestamp" }),
  createdAt: text("created_at")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$onUpdate(
    () => new Date()
  ),
});

export const groupListRelations = relations(GroupList, ({ one }) => ({
  orchestra: one(Orchestra),
  group: one(Grupos),
  user: one(Users),
}));

export const Louvores = sqliteTable("louvores", {
  id: text("id")
    .primaryKey()
    .$default(() => sql`(lower(hex(randomblob(16))))`),
  nameLouvor: text("nameLouvor").notNull(),
  description: text("description"),
  orchestraId: text("orchestra_id").notNull(),
  pdf: text("pdf"),
  mp3: text("mp3"),
  instrumentos: text("instrumentos"),
  deletedAt: integer("deleted_at", { mode: "timestamp" }),
  createdAt: text("created_at")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$onUpdate(
    () => new Date()
  ),
});

export const louvoresRelations = relations(Louvores, ({ one }) => ({
  orchestra: one(Orchestra),
}));

export const Grupos = sqliteTable("grupos", {
  id: text("id")
    .primaryKey()
    .$default(() => sql`(lower(hex(randomblob(16))))`),
  name: text("name").notNull(),
  historia: text("historia"),
  orchestraId: text("orchestra_id").notNull(),
  deletedAt: integer("deleted_at", { mode: "timestamp" }),
  createdAt: text("created_at")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$onUpdate(
    () => new Date()
  ),
});

export const groupsRelations = relations(Grupos, ({ one }) => ({
  orchestra: one(Orchestra),
}));

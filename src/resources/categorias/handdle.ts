import { eq, and } from "drizzle-orm";
import { db } from "../../db/drizzle-client";
import { categoriesInstruments } from "../../db/schema";

export const getAllCategories = async (orquestraId: string) => {
  return await db
    .select()
    .from(categoriesInstruments)
    .where(eq(categoriesInstruments.orchestraId, orquestraId));
};

export const getCategoryById = async (id: string, orquestraId: string) => {
  return await db
    .select()
    .from(categoriesInstruments)
    .where(
      and(
        eq(categoriesInstruments.id, id),
        eq(categoriesInstruments.orchestraId, orquestraId)
      )
    );
};

export const deleteCategory = async (id: string, orquestraId: string) => {
  return await db
    .delete(categoriesInstruments)
    .where(
      and(
        eq(categoriesInstruments.id, id),
        eq(categoriesInstruments.orchestraId, orquestraId)
      )
    )
    .returning();
};

export const postCategory = async (name: string, orchestraId: string) => {
  return await db
    .insert(categoriesInstruments)
    .values({
      name,
      orchestraId,
    })
    .returning();
};

export const updateCategory = async (id: string, name: string) => {
  return await db
    .update(categoriesInstruments)
    .set({ name })
    .where(eq(categoriesInstruments.id, id))
    .returning();
};

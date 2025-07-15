import { db } from "../../db/drizzle-client";
import { Ensaios } from "../../db/schema";
import { eq } from "drizzle-orm";

export const getAllEnsaios = async (orchestraId: string) => {
  return await db
    .select()
    .from(Ensaios)
    .where(eq(Ensaios.orchestraId, orchestraId));
};

export const createEnsaio = async (data: any) => {
  return (await db.insert(Ensaios).values(data).returning())[0];
};

export const updateEnsaio = async (id: string, data: any) => {
  return (
    await db.update(Ensaios).set(data).where(eq(Ensaios.id, id)).returning()
  )[0];
};

export const deleteEnsaio = async (id: string) => {
  return (await db.delete(Ensaios).where(eq(Ensaios.id, id)).returning())[0];
};

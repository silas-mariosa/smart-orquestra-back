import { db } from "../../db/drizzle-client";
import { eq, and } from "drizzle-orm";
import { Louvores } from "../../db/schema";

export const getAllLouvores = async (orchestraId: string) => {
  return await db
    .select()
    .from(Louvores)
    .where(eq(Louvores.orchestraId, orchestraId));
};

export const getLouvoresById = async (id: string, orchestraId: string) => {
  return await db
    .select()
    .from(Louvores)
    .where(and(eq(Louvores.id, id), eq(Louvores.orchestraId, orchestraId)));
};

export const postLouvor = async ({
  nameLouvor,
  orchestraId,
  description,
  pdf,
  mp3,
  instrumentos,
}: {
  nameLouvor: string;
  orchestraId: string;
  description: string;
  pdf: string;
  mp3: string;
  instrumentos: string;
}) => {
  return await db
    .insert(Louvores)
    .values({
      nameLouvor,
      orchestraId,
      description,
      pdf,
      mp3,
      instrumentos,
    })
    .returning();
};

export const updateLouvor = async ({
  id,
  nameLouvor,
  orchestraId,
  description,
  pdf,
  mp3,
  instrumentos,
}: {
  id: string;
  nameLouvor: string;
  orchestraId: string;
  description: string;
  pdf: string;
  mp3: string;
  instrumentos: string;
}) => {
  return await db
    .update(Louvores)
    .set({
      nameLouvor,
      description,
      pdf,
      mp3,
      instrumentos,
    })
    .where(and(eq(Louvores.id, id), eq(Louvores.orchestraId, orchestraId)))
    .returning();
};

export const deleteLouvor = async (id: string, orchestraId: string) => {
  return await db
    .delete(Louvores)
    .where(and(eq(Louvores.id, id), eq(Louvores.orchestraId, orchestraId)))
    .returning();
};

import { db } from "../../db/drizzle-client";
import { eq, and } from "drizzle-orm";
import { Grupos } from "../../db/schema";

export const getAllGrupos = async (orchestraId: string) => {
  return await db
    .select()
    .from(Grupos)
    .where(eq(Grupos.orchestraId, orchestraId));
};

export const getGruposById = async (id: string, orchestraId: string) => {
  return await db
    .select()
    .from(Grupos)
    .where(and(eq(Grupos.id, id), eq(Grupos.orchestraId, orchestraId)));
};

export const postGrupo = async ({
  name,
  historia,
  orchestraId,
}: {
  name: string;
  historia: string;
  orchestraId: string;
}) => {
  return await db
    .insert(Grupos)
    .values({
      name,
      historia,
      orchestraId,
    })
    .returning();
};

export const updateGrupo = async ({
  id,
  name,
  historia,
  orchestraId,
}: {
  id: string;
  name: string;
  historia: string;
  orchestraId: string;
}) => {
  return await db
    .update(Grupos)
    .set({
      name,
      historia,
    })
    .where(and(eq(Grupos.id, id), eq(Grupos.orchestraId, orchestraId)))
    .returning();
};

export const deleteGrupo = async (id: string) => {
  return await db.delete(Grupos).where(eq(Grupos.id, id)).returning();
};

import { db } from "../../db/drizzle-client";
import { Orchestra } from "../../db/schema";
import { eq } from "drizzle-orm";

export const getOrchestraByID = async (orchestraId: string) => {
  return await db.select().from(Orchestra).where(eq(Orchestra.id, orchestraId));
};

export const postOrchestra = async ({
  nome_orchestra,
  user_auth,
  auth_id,
}: {
  nome_orchestra: string;
  user_auth: string;
  auth_id: string;
}) => {
  return await db
    .insert(Orchestra)
    .values({
      nome_orchestra,
      user_auth,
      auth_id,
    })
    .returning();
};

export const updateOrchestra = async (
  orchestraId: string,
  {
    nome_orchestra,
  }: {
    nome_orchestra: string;
  }
) => {
  return await db
    .update(Orchestra)
    .set({
      nome_orchestra,
    })
    .where(eq(Orchestra.id, orchestraId))
    .returning();
};

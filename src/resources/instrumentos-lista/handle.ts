import { db } from "../../db/drizzle-client";
import { eq, and } from "drizzle-orm";
import { ListIstruments } from "../../db/schema";

export const getAllInstrumentsList = async (orchestraId: string) => {
  return await db
    .select()
    .from(ListIstruments)
    .where(eq(ListIstruments.orchestraId, orchestraId));
};

export const getInstrumentListByUserID = async (user_id: string) => {
  return await db
    .select()
    .from(ListIstruments)
    .where(eq(ListIstruments.user_id, user_id));
};

export const getInstrumentListById = async (
  id: string,
  orchestraId: string
) => {
  return await db
    .select()
    .from(ListIstruments)
    .where(
      and(
        eq(ListIstruments.id, id),
        eq(ListIstruments.orchestraId, orchestraId)
      )
    );
};

export const postListInstrument = async ({
  orchestraId,
  instrumentId,
  user_id,
  owner,
  position,
  serie,
  brand,
  model,
}: {
  orchestraId: string;
  instrumentId: string;
  user_id: string;
  owner: string;
  position: string;
  serie: string;
  brand: string;
  model: string;
}) => {
  return await db
    .insert(ListIstruments)
    .values({
      orchestraId,
      instrumentId,
      user_id,
      owner,
      position,
      serie,
      brand,
      model,
    })
    .returning();
};

export const updateListInstrument = async ({
  id,
  orchestraId,
  instrumentId,
  owner,
  position,
  serie,
  brand,
  model,
}: {
  id: string;
  orchestraId: string;
  instrumentId: string;
  owner: string;
  position: string;
  serie: string;
  brand: string;
  model: string;
}) => {
  return await db
    .update(ListIstruments)
    .set({
      instrumentId,
      owner,
      position,
      serie,
      brand,
      model,
    })
    .where(
      and(
        eq(ListIstruments.id, id),
        eq(ListIstruments.orchestraId, orchestraId)
      )
    )
    .returning();
};

export const deleteListInstrument = async (id: string, orchestraId: string) => {
  return await db
    .delete(ListIstruments)
    .where(
      and(
        eq(ListIstruments.id, id),
        eq(ListIstruments.orchestraId, orchestraId)
      )
    )
    .returning();
};

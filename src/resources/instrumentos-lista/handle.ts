import { db } from "../../db/drizzle-client";
import { eq, and } from "drizzle-orm";
import { ListIstruments, Instruments } from "../../db/schema";

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

export const getInstrumentListByUserIDWithName = async (user_id: string) => {
  return await db
    .select({
      id: ListIstruments.id,
      orchestraId: ListIstruments.orchestraId,
      instrumentId: ListIstruments.instrumentId,
      user_id: ListIstruments.user_id,
      owner: ListIstruments.owner,
      position: ListIstruments.position,
      serie: ListIstruments.serie,
      brand: ListIstruments.brand,
      model: ListIstruments.model,
      deletedAt: ListIstruments.deletedAt,
      createdAt: ListIstruments.createdAt,
      updatedAt: ListIstruments.updatedAt,
      instrumentName: Instruments.nameInstrument,
    })
    .from(ListIstruments)
    .leftJoin(Instruments, eq(ListIstruments.instrumentId, Instruments.id))
    .where(eq(ListIstruments.user_id, user_id));
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

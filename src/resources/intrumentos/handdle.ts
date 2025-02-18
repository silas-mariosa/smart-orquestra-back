import { db } from "../../db/drizzle-client";
import { Instruments } from "../../db/schema";
import { eq, and } from "drizzle-orm";

type InstrumentType = {
  nameInstrument: string;
  orchestraId: string;
  typeInstrument: string;
  categories: string;
  description: string;
};

export const getAllInstruments = async (orchestraId: string) => {
  return await db
    .select()
    .from(Instruments)
    .where(eq(Instruments.orchestraId, orchestraId));
};

export const getInstrumentsByCategory = async (
  id: string,
  orchestraId: string
) => {
  return await db
    .select()
    .from(Instruments)
    .where(
      and(
        eq(Instruments.categories, id),
        eq(Instruments.orchestraId, orchestraId)
      )
    );
};

export const getInstrumentByID = async (
  instrumentId: string,
  orchestraId: string
) => {
  return await db
    .select()
    .from(Instruments)
    .where(
      and(
        eq(Instruments.id, instrumentId),
        eq(Instruments.orchestraId, orchestraId)
      )
    );
};

export const postInstrument = async ({
  nameInstrument,
  orchestraId,
  typeInstrument,
  categories,
  description,
}: {
  nameInstrument: string;
  orchestraId: string;
  typeInstrument: string;
  categories: string;
  description: string;
}) => {
  return await db
    .insert(Instruments)
    .values({
      nameInstrument,
      orchestraId,
      typeInstrument,
      categories,
      description,
    })
    .returning();
};

export const deleteInstrument = async (instrumentId: string) => {
  return await db
    .delete(Instruments)
    .where(eq(Instruments.id, instrumentId))
    .returning();
};

export const updateInstrument = async (
  id: string,
  {
    categories,
    description,
    nameInstrument,
    orchestraId,
    typeInstrument,
  }: InstrumentType
) => {
  await db
    .update(Instruments)
    .set({
      categories,
      description,
      nameInstrument,
      orchestraId,
      typeInstrument,
    })
    .where(eq(Instruments.id, id));
};

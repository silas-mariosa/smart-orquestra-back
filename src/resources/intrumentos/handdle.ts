import { db } from "../../db/drizzle-client";
import { categoriesInstruments, Instruments } from "../../db/schema";
import { eq, and, inArray } from "drizzle-orm";
import { categorias } from "../categorias/route";

type InstrumentType = {
  nameInstrument: string;
  orchestraId: string;
  typeInstrument: string;
  categories: string;
  description: string;
};

export const getAllInstruments = async (orchestraId: string) => {
  const instruments = await db
    .select()
    .from(Instruments)
    .where(eq(Instruments.orchestraId, orchestraId));

  const categoryIds = instruments
    .map((i) => i.categories)
    .filter((id): id is string => id !== null);

  const categories = await db
    .select()
    .from(categoriesInstruments)
    .where(inArray(categoriesInstruments.id, categoryIds));

  const categoriesMap = Object.fromEntries(
    categories.map((cat) => [cat.id, cat.name])
  );

  return instruments.map((instrument) => ({
    ...instrument,
    categories: instrument.categories
      ? (categoriesMap[instrument.categories] ?? null)
      : null,
  }));
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

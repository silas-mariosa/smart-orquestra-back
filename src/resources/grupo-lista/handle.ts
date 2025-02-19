import { db } from "../../db/drizzle-client";
import { eq, and } from "drizzle-orm";
import { GroupList } from "../../db/schema";

export const getAllInListGroups = async (orchestraId: string) => {
  return await db
    .select()
    .from(GroupList)
    .where(eq(GroupList.orchestraId, orchestraId));
};

export const getListGroupById = async (id: string, orchestraId: string) => {
  return await db
    .select()
    .from(GroupList)
    .where(and(eq(GroupList.id, id), eq(GroupList.orchestraId, orchestraId)));
};

export const postListGroup = async ({
  GroupId,
  orchestraId,
  userId,
}: {
  GroupId: string;
  orchestraId: string;
  userId: string;
}) => {
  return await db
    .insert(GroupList)
    .values({
      GroupId,
      orchestraId,
      userId,
    })
    .returning();
};

export const updateListGroup = async ({
  id,
  GroupId,
  orchestraId,
}: {
  id: string;
  GroupId: string;
  orchestraId: string;
}) => {
  return await db
    .update(GroupList)
    .set({
      GroupId,
    })
    .where(and(eq(GroupList.id, id), eq(GroupList.orchestraId, orchestraId)))
    .returning();
};

export const deleteListGroup = async (id: string, orchestraId: string) => {
  return await db
    .delete(GroupList)
    .where(and(eq(GroupList.id, id), eq(GroupList.orchestraId, orchestraId)))
    .returning();
};

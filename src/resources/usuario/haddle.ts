import { eq, and, or } from "drizzle-orm";
import { Address, Users } from "../../db/schema";
import { db } from "../../db/drizzle-client";
import { insertAddress, updateAddress } from "../address/handle";

export const getAllUsers = async (orchestraId: string) => {
  return await db
    .select()
    .from(Users)
    .where(eq(Users.orchestraId, orchestraId));
};

export const getUsersById = async (id: string, orchestraId: string) => {
  return await db
    .select()
    .from(Users)
    .where(and(eq(Users.id, id), eq(Users.orchestraId, orchestraId)))
    .innerJoin(Address, eq(Address.id, Users.addressId));
};

export const getUsersByAuthId = async (authId: string) => {
  return await db.select().from(Users).where(eq(Users.auth_id, authId));
};

export const postUsers = async ({
  auth_id,
  orchestraId,
  accessLevel,
  name,
}: {
  auth_id: string;
  orchestraId: string;
  accessLevel: string;
  name: string;
}) => {
  const address = {
    cep: "",
    estado: "",
    cidade: "",
    bairro: "",
    endereco: "",
    numero: "",
    complemento: "",
  };
  const addressId = await insertAddress(address);
  return (
    await db
      .insert(Users)
      .values({
        auth_id,
        orchestraId,
        accessLevel,
        name,
        addressId: addressId,
        active: true,
      })
      .returning()
  )[0];
};

export const updateUsers = async (
  id: string,
  name: string,
  brithday: string,
  cep: string,
  estado: string,
  cidade: string,
  bairro: string,
  endereco: string,
  numero: string,
  complemento: string,
  whatsapp: string
) => {
  try {
    const [existingUsers] = await db
      .select({ address_id: Users.addressId })
      .from(Users)
      .where(eq(Users.id, id));

    if (!existingUsers) {
      throw new Error("Users not found");
    }

    const addressId = existingUsers.address_id;

    if (addressId === null) {
      throw new Error(`Address ID for Gabinete with id ${id} is null`);
    }
    const { address_id } = existingUsers;

    // Atualiza o endereço
    await updateAddress(address_id as string, {
      cep,
      estado,
      cidade,
      bairro,
      endereco,
      numero,
      complemento,
    });
    return await db
      .update(Users)
      .set({
        name,
        brithday,
        whatsapp,
      })
      .where(eq(Users.id, id))
      .returning();
  } catch (error) {
    return error;
  }
};
export const deleteUsers = async (id: string, orchestraId: string) => {
  return await db
    .delete(Users)
    .where(and(eq(Users.id, id), eq(Users.orchestraId, orchestraId)))
    .returning();
};

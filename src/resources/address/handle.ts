import { eq } from "drizzle-orm";
import { Address } from "../../db/schema";
import { db } from "../../db/drizzle-client";

export type addressType = {
  cep?: string;
  estado?: string;
  cidade?: string;
  bairro?: string;
  endereco?: string;
  numero?: string;
  complemento?: string;
};

export const insertAddress = async ({
  cep,
  estado,
  cidade,
  bairro,
  endereco,
  numero,
  complemento,
}: addressType) => {
  const [newAddress] = await db
    .insert(Address)
    .values({
      cep,
      estado,
      cidade,
      bairro,
      endereco,
      numero,
      complemento,
    })
    .returning({ id: Address.id });

  return newAddress.id;
};

export const getAddressById = async (id: string) => {
  const [address] = await db.select().from(Address).where(eq(Address.id, id));

  return address;
};

export const updateAddress = async (
  id: string,
  { cep, estado, cidade, bairro, endereco, numero, complemento }: addressType
) => {
  await db
    .update(Address)
    .set({
      cep,
      estado,
      cidade,
      bairro,
      endereco,
      numero,
      complemento,
    })
    .where(eq(Address.id, id));
};

export const deleteAddress = async (id: string) => {
  await db.delete(Address).where(eq(Address.id, id));
};

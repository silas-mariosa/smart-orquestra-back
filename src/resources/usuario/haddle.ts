import { eq, and, or } from "drizzle-orm";
import { Address, Users, Auth } from "../../db/schema";
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

// Função para gerar senha aleatória
const generateRandomPassword = (): string => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
  let password = "";
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

// Criar usuário com senha aleatória
export const postUsersWithRandomPassword = async ({
  orchestraId,
  accessLevel,
  name,
  email,
}: {
  orchestraId: string;
  accessLevel: string;
  name: string;
  email: string;
}) => {
  try {
    // Gerar senha aleatória
    const randomPassword = generateRandomPassword();

    // Criar registro de autenticação
    const [authData] = await db
      .insert(Auth)
      .values({
        name: name,
        email: email,
        password: await Bun.password.hash(randomPassword),
      })
      .returning();

    if (!authData) {
      throw new Error("Erro ao criar registro de autenticação");
    }

    // Criar endereço padrão
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

    // Criar usuário
    const [userData] = await db
      .insert(Users)
      .values({
        auth_id: authData.id,
        orchestraId,
        accessLevel,
        name,
        addressId: addressId,
        active: true,
      })
      .returning();

    return {
      user: userData,
      password: randomPassword, // Retorna a senha para ser passada ao usuário
    };
  } catch (error) {
    console.error("Erro ao criar usuário com senha aleatória:", error);
    throw error;
  }
};

// Gerar nova senha para usuário existente
export const generateNewPasswordForUser = async (
  userId: string,
  orchestraId: string
) => {
  try {
    // Verificar se o usuário existe e pertence à orquestra
    const [user] = await db
      .select()
      .from(Users)
      .where(and(eq(Users.id, userId), eq(Users.orchestraId, orchestraId)));

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    // Gerar nova senha aleatória
    const newPassword = generateRandomPassword();

    // Atualizar senha no registro de autenticação
    const [authData] = await db
      .update(Auth)
      .set({
        password: await Bun.password.hash(newPassword),
      })
      .where(eq(Auth.id, user.auth_id))
      .returning();

    if (!authData) {
      throw new Error("Erro ao atualizar senha");
    }

    return {
      user: user,
      newPassword: newPassword, // Retorna a nova senha para ser passada ao usuário
    };
  } catch (error) {
    console.error("Erro ao gerar nova senha:", error);
    throw error;
  }
};

export const updateUserPassword = async (
  auth_id: string,
  newPassword: string
) => {
  console.log("auth_id: ", auth_id);
  console.log("newPassword: ", newPassword);
  try {
    const [updated] = await db
      .update(Auth)
      .set({ password: await Bun.password.hash(newPassword) })
      .where(eq(Auth.id, auth_id))
      .returning();
    return !!updated;
  } catch (error) {
    console.error("Erro ao atualizar senha:", error);
    return false;
  }
};

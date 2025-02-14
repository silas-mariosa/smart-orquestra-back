import { and, eq } from "drizzle-orm";
import { db } from "../../db/drizzle-client";
import { Auth, AuthType } from "../../db/schema";

type Body = {
  name: string;
  email: string;
  senha: string;
};

type Result<T> = {
  data: T | null;
  error: string | null;
};

export const signUp = async (body: Body): Promise<Result<AuthType>> => {
  try {
    const [data] = await db
      .insert(Auth)
      .values({
        name: body.name,
        email: body.email,
        password: await Bun.password.hash(body.senha),
      })
      .returning();

    return { data, error: null };
  } catch (error) {
    return { data: null, error: (error as Error).message };
  }
};

export const signIn = async (body: Body): Promise<Result<AuthType>> => {
  try {
    const [data] = await db
      .select()
      .from(Auth)
      .where(and(eq(Auth.email, body.email)));
    // Verificar se a senha do usuário é a mesma que a senha recebido no signin
    const validPassword = await Bun.password.verify(body.senha, data.password);
    if (validPassword) {
      return { data, error: null };
    } else {
      return { data: null, error: "Senha inválida" };
    }
  } catch (error) {
    return { data: null, error: (error as Error).message };
  }
};

// codigo reduntante porque eh assim que estava antes
export const signUpNewUser = signUp;

export const updatePassword = async (body: Body): Promise<Result<AuthType>> => {
  try {
    const hashedPassword = await Bun.password.hash(body.senha);

    const [data] = await db
      .update(Auth)
      .set({ password: hashedPassword })
      .where(eq(Auth.email, body.email))
      .returning();

    if (!data) {
      return { data: null, error: "User not found" };
    }
    return { data, error: null };
  } catch (error) {
    return { data: null, error: (error as Error).message };
  }
};

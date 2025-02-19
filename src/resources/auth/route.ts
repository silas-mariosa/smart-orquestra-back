import { Elysia, t } from "elysia";
import { JWT } from "../../jwt";
import { signIn, signUp } from "./handler";
import { getUsersByAuthId, postUsers } from "../usuario/haddle";
import { getOrchestraByID, postOrchestra } from "../orquestra/handle";
import { or } from "drizzle-orm";

const swaggerGroup = {
  detail: {
    tags: ["Auth"],
  },
};

export const auth = new Elysia({ prefix: "/auth" })
  .use(JWT)
  .guard(
    {
      body: t.Object({
        nameOrquestra: t.String(),
        name: t.String(),
        email: t.String(),
        senha: t.String(),
      }),
    },
    (app) =>
      app.post(
        "/signup",
        async ({ body, jwt, error }) => {
          try {
            const { data, error: signInError } = await signUp(body);

            if (signInError) return error(400, "E-mail ou senha não conferem!");

            const authId = data?.id;
            if (authId === undefined)
              return error(400, "Authentication ID is undefined");

            const name = data?.name;
            if (name === undefined) return error(400, "Name is undefined");

            const [newOrchestra] = await postOrchestra({
              nome_orchestra: body.nameOrquestra,
              user_auth: authId,
              auth_id: authId,
            });

            const newUser = await postUsers({
              auth_id: authId,
              orchestraId: newOrchestra.id,
              accessLevel: "Administrador",
              name: name,
            });
          } catch (error: Error | any) {
            return error(400, "Erro ao criar usuário!");
          }
        },
        swaggerGroup
      )
  )
  .guard(
    {
      body: t.Object({
        name: t.String(),
        email: t.String(),
        senha: t.String(),
      }),
    },
    (app) =>
      app.post(
        "/signupUsers",
        async ({ body, jwt, headers, error }) => {
          const authToken = headers.authorization?.split(" ")[1];
          try {
            const profile = await jwt.verify(authToken);
            if (!profile) {
              return error(400, "Invalid Token");
            }
            const orchestraId = profile.orchestraId;
            console.log(orchestraId);
            if (!orchestraId) {
              return error(400, "Invalid orchestraId");
            }
            const { data, error: signInError } = await signUp(body);
            if (signInError) return error(400, "E-mail ou senha não conferem!");

            const authId = data?.id;
            if (authId === undefined)
              return error(400, "Authentication ID is undefined");

            const name = data?.name;
            if (name === undefined) return error(400, "Name is undefined");

            const newUser = await postUsers({
              auth_id: authId,
              orchestraId: orchestraId as string,
              accessLevel: "Membro",
              name: name,
            });
          } catch (error: Error | any) {
            return error(400, "Erro ao criar usuário!");
          }
        },
        swaggerGroup
      )
  )
  .guard(
    {
      body: t.Object({
        email: t.String(),
        senha: t.String(),
      }),
    },
    (app) =>
      app.post(
        "/signin",
        async ({ body, error, jwt, cookie: { authTokenSmart } }) => {
          try {
            const { data, error: signInError } = await signIn(body);
            if (signInError) return error(400, "E-mail ou senha não conferem!");

            const authId = data?.id;
            if (authId === undefined)
              throw new Error("Authentication ID is undefined");

            const usuario = (await getUsersByAuthId(authId))?.[0];
            if (!usuario) return error(400, "Usuário não encontrado!");

            if (!usuario.orchestraId)
              return error(400, "Orchestra ID não encontrada!");
            const orchestra = (
              await getOrchestraByID(usuario.orchestraId)
            )?.[0];
            if (!orchestra) return error(400, "Orchestra não encontrada!");

            const token = await jwt.sign({
              userId: usuario.id,
              orchestraId: orchestra.id,
              name: usuario.name,
              accessLevel: usuario.accessLevel,
            });
            authTokenSmart.set({
              value: token,
              httpOnly: true,
              maxAge: 7 * 86400,
              path: "/",
            });

            const reponseToken = {
              token: token,
            };
            return {
              reponseToken,
            };
          } catch (error: Error | any) {
            return error(400, "Erro ao fazer login!");
          }
        },
        swaggerGroup
      )
  );

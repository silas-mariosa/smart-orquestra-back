import { Elysia, t } from "elysia";
import { getAllUsers, getUsersById, postUsers, updateUsers } from "./haddle";
import { JWT } from "../../jwt";

interface UsuarioRequestBody {
  auth_id: string;
  orchestraId: string;
  accessLevel: "Administrador" | "Membro";
  name: string;
  instrumentId: string;
  groupId: string;
}

const swaggerGroup = {
  detail: {
    tags: ["Usuarios"],
  },
};

export const usuario = new Elysia({ prefix: "/usuario" })
  .use(JWT)
  .guard((app) =>
    app
      .get(
        "/",
        async ({ jwt, error, headers }) => {
          const authToken = headers.authorization?.split(" ")[1];
          try {
            const profile = await jwt.verify(authToken);
            if (!profile) {
              throw new Error("Invalid Token");
            }
            const orchestraId = profile.orchestraId;

            if (!orchestraId) {
              error(400, "Invalid orchestraId");
            }
            return await getAllUsers(orchestraId as string);
          } catch (error) {
            return error;
          }
        },
        swaggerGroup
      )
      .get(
        "/",
        async ({ jwt, headers, error }) => {
          const authToken = headers.authorization?.split(" ")[1];
          try {
            const profile = await jwt.verify(authToken);
            if (!profile) {
              return error(404, "Invalid Token");
            }
            const id = profile.userId as string;
            if (!id) {
              return error(404, "Invalid id");
            }
            const orchestraId = profile.orchestraId;
            if (!orchestraId) {
              return error(404, "Invalid orchestraId");
            }

            const usuarioById = await getUsersById(id, orchestraId as string);
            if (!usuarioById) {
              return error(400, "Usuario não encontrado!");
            } else {
              return usuarioById;
            }
          } catch (error) {
            return error;
          }
        },
        swaggerGroup
      )
      .guard(
        {
          body: t.Object({
            auth_id: t.String(),
            orchestraId: t.String(),
            accessLevel: t.String(),
            name: t.String(),
            instrumentListId: t.String(),
            groupId: t.String(),
          }),
        },
        (app) =>
          app.post(
            "/",
            async (
              { body }: { body: UsuarioRequestBody },
              { headers, jwt }: any
            ) => {
              const authToken = headers.authorization?.split(" ")[1];
              try {
                const profile = await jwt.verify(authToken);
                if (!profile) {
                  throw new Error("Invalid Token");
                }
                return await postUsers(body);
              } catch (error) {
                return error;
              }
            },
            swaggerGroup
          )
      )
      .guard(
        {
          body: t.Object({
            name: t.String(),
            brithday: t.String(),
            whatsapp: t.String(),
            cep: t.String(),
            estado: t.String(),
            cidade: t.String(),
            bairro: t.String(),
            endereco: t.String(),
            numero: t.String(),
            complemento: t.String(),
          }),
        },
        (app) =>
          app.put(
            "/update-usuario",
            async ({ body, headers, jwt, error }) => {
              const authToken = headers.authorization?.split(" ")[1];
              console.log("Body: ", body);
              try {
                const profile = await jwt.verify(authToken);
                if (!profile) {
                  return error(404, "Invalid Token");
                }
                const id = profile.userId as string;
                if (!id) {
                  return error(404, "Invalid id");
                }
                return await updateUsers(
                  id,
                  body.name,
                  body.brithday,
                  body.cep,
                  body.estado,
                  body.cidade,
                  body.bairro,
                  body.endereco,
                  body.numero,
                  body.complemento,
                  body.whatsapp
                );
              } catch (error) {
                return error;
              }
            },
            swaggerGroup
          )
      )
  );

import { Elysia, t } from "elysia";
import { getAllUsers, getUsersById, postUsers, updateUsers } from "./haddle";
import { JWT } from "../../jwt";

interface UsuarioRequestBody {
  auth_id: number;
  orchestraId: number;
  accessLevel: "Administrador" | "Membro";
  name: string;
  instrumentId: number;
  groupId: number;
}

const swaggerGroup = {
  detail: {
    tags: ["Usuarios"],
  },
};

export const usuario = new Elysia({ prefix: "/usuario" }).use(JWT).guard(
  {
    async beforeHandle({ set, jwt, headers, cookie: { authTokenEasy } }) {
      const authToken = headers.authorization?.split(" ")[1];

      if (!authToken) {
        set.status = 401;
        return "Unauthorized";
      }

      try {
        await jwt.verify(authToken);
      } catch (error) {
        set.status = 401;
        return "Invalid Token";
      }
    },
  },
  (app) =>
    app
      .get(
        "/",
        async ({ jwt, set, headers, cookie: { authTokenEasy } }) => {
          const authToken = headers.authorization?.split(" ")[1];
          try {
            const profile = await jwt.verify(authToken);
            if (!profile) {
              throw new Error("Invalid Token");
            }
            const orchestraId =
              typeof profile.orchestraId === "string"
                ? parseInt(profile.orchestraId, 10)
                : profile.orchestraId;
            if (isNaN(orchestraId)) {
              throw new Error("Invalid orchestraId");
            }
            return await getAllUsers(orchestraId);
          } catch (error) {
            return error;
          }
        },
        swaggerGroup
      )
      .get(
        "/:id",
        async ({ params: { id }, jwt, headers }) => {
          const authToken = headers.authorization?.split(" ")[1];
          try {
            const profile = await jwt.verify(authToken);
            if (!profile) {
              throw new Error("Invalid Token");
            }
            const gabinete_ID =
              typeof profile.gabinete_ID === "string"
                ? parseInt(profile.gabinete_ID, 10)
                : profile.gabinete_ID;
            if (isNaN(gabinete_ID)) {
              throw new Error("Invalid gabinete_ID");
            }
            return await getUsersById(Number(id), gabinete_ID);
          } catch (error) {
            return error;
          }
        },
        swaggerGroup
      )
      .guard(
        {
          body: t.Object({
            auth_id: t.Numeric(),
            orchestraId: t.Numeric(),
            accessLevel: t.String(),
            name: t.String(),
            instrumentId: t.Numeric(),
            groupId: t.Numeric(),
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
            orchestraId: t.Numeric(),
            accessLevel: t.String(),
            brithday: t.String(),
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
            "/updateUsuario/:id",
            async ({ body, headers, jwt, params: { id } }) => {
              const authToken = headers.authorization?.split(" ")[1];
              try {
                const profile = await jwt.verify(authToken);
                if (!profile) {
                  throw new Error("Invalid Token");
                }

                return await updateUsers(
                  Number(id),
                  body.name,
                  body.brithday,
                  body.cep,
                  body.estado,
                  body.cidade,
                  body.bairro,
                  body.endereco,
                  body.numero,
                  body.complemento
                );
              } catch (error) {
                return error;
              }
            },
            swaggerGroup
          )
      )
);

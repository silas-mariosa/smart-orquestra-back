import { Elysia, t } from "elysia";
import { JWT } from "../../jwt";
import {
  deleteGrupo,
  getAllGrupos,
  getGruposById,
  postGrupo,
  updateGrupo,
} from "./handle";

const swaggerGroup = {
  detail: {
    tags: ["Grupos"],
  },
};

export const grupos = new Elysia({ prefix: "/grupos" }).use(JWT).guard((app) =>
  app
    .get(
      "/", // get all grupos
      async ({ jwt, error, headers }) => {
        const authToken = headers.authorization?.split(" ")[1];
        try {
          const profile = await jwt.verify(authToken);
          if (!profile) {
            throw new Error("Invalid Token");
          }
          const orchestraId = profile.orchestraId;
          if (!orchestraId) {
            return error(400, "Invalid orchestraId");
          }
          return await getAllGrupos(orchestraId as string);
        } catch (error) {
          return error;
        }
      },
      swaggerGroup
    )
    .get(
      "/:id", // get grupo by id
      async ({ params: { id }, jwt, headers, error }) => {
        const authToken = headers.authorization?.split(" ")[1];
        try {
          const profile = await jwt.verify(authToken);
          if (!profile) {
            return error(400, "Invalid Token");
          }
          const orchestraId = profile.orchestraId;
          if (!orchestraId) {
            return error(400, "Invalid orchestraId");
          }
          return await getGruposById(id, orchestraId as string);
        } catch (error) {
          return error;
        }
      },
      swaggerGroup
    )
    .guard(
      {
        body: t.Object({
          name: t.String(),
          historia: t.String(),
        }),
      },
      (app) =>
        app
          .post(
            "/",
            async ({ body, jwt, headers, error }) => {
              const authToken = headers.authorization?.split(" ")[1];
              try {
                const profile = await jwt.verify(authToken);
                if (!profile) {
                  return error(400, "Invalid Token");
                }
                const orchestraId = profile.orchestraId;
                if (!orchestraId) {
                  return error(400, "Invalid orchestraId");
                }
                return await postGrupo({
                  name: body.name,
                  historia: body.historia,
                  orchestraId: orchestraId as string,
                });
              } catch (error) {
                return error;
              }
            },
            swaggerGroup
          )
          .put(
            "/:id",
            async ({ params: { id }, body, jwt, headers, error }) => {
              const authToken = headers.authorization?.split(" ")[1];
              try {
                const profile = await jwt.verify(authToken);
                if (!profile) {
                  return error(400, "Invalid Token");
                }
                const orchestraId = profile.orchestraId;
                if (!orchestraId) {
                  return error(400, "Invalid orchestraId");
                }
                return await updateGrupo({
                  id: id,
                  name: body.name,
                  historia: body.historia,
                  orchestraId: orchestraId as string,
                });
              } catch (error) {
                return error;
              }
            },
            swaggerGroup
          )
    )
    .delete(
      "/:id",
      async ({ params: { id }, jwt, headers, error }) => {
        const authToken = headers.authorization?.split(" ")[1];
        try {
          const profile = await jwt.verify(authToken);
          if (!profile) {
            return error(400, "Invalid Token");
          }
          const orchestraId = profile.orchestraId;
          if (!orchestraId) {
            return error(400, "Invalid orchestraId");
          }
          return await deleteGrupo(id);
        } catch (error) {
          return error;
        }
      },
      swaggerGroup
    )
);

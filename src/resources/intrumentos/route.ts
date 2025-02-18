import { Elysia, t } from "elysia";
import { JWT } from "../../jwt";
import {
  getAllInstruments,
  deleteInstrument,
  getInstrumentByID,
  postInstrument,
  updateInstrument,
  getInstrumentsByCategory,
} from "./handdle";
import { app } from "../..";
import { getCategoryById } from "../categorias/handdle";

const swaggerGroup = {
  detail: {
    tags: ["Instrumentos"],
  },
};

export const instrumentos = new Elysia({ prefix: "/instrumentos" })
  .use(JWT)
  .guard((app) =>
    app
      .get(
        "/",
        async ({ jwt, error, headers, cookie: { authTokenEasy } }) => {
          const authToken = headers.authorization?.split(" ")[1];
          try {
            const profile = await jwt.verify(authToken);
            if (!profile) {
              throw new Error("Invalid Token");
            }
            const orchestraId = profile.orchestraId;
            if (orchestraId) {
              return error(400, "Invalid orchestraId");
            }
            return await getAllInstruments(orchestraId as string);
          } catch (error) {
            return error;
          }
        },
        swaggerGroup
      )
      .get(
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

            const usuarioById = await getInstrumentByID(
              id,
              orchestraId as string
            );
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
            nameInstrument: t.String(),
            typeInstrument: t.String(),
            categories: t.String(),
            description: t.String(),
          }),
        },
        (app) =>
          app.post(
            "/",
            async ({ body, error, headers, jwt }) => {
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
                return await postInstrument({
                  description: body.description,
                  nameInstrument: body.nameInstrument,
                  orchestraId: orchestraId as string,
                  typeInstrument: body.typeInstrument,
                  categories: body.categories,
                });
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
            nameInstrument: t.String(),
            typeInstrument: t.String(),
            categories: t.String(),
            description: t.String(),
          }),
        },
        (app) =>
          app.put(
            "/:id",
            async ({ params: { id }, error, body, headers, jwt }) => {
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
                return await updateInstrument(id, {
                  description: body.description,
                  orchestraId: orchestraId as string,
                  nameInstrument: body.nameInstrument,
                  typeInstrument: body.typeInstrument,
                  categories: body.categories,
                });
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
            categoryById: t.String(),
          }),
        },
        (app) =>
          app.get(
            "/category/:id",
            async ({ params: { id }, error, headers, jwt }) => {
              const authToken = headers.authorization?.split(" ")[1];
              try {
                const profile = await jwt.verify(authToken);
                if (!profile) {
                  throw new Error("Invalid Token");
                }
                const orchestraId = profile.orchestraId;
                console.log(orchestraId);
                if (!orchestraId) {
                  return error(400, "Invalid orchestraId");
                }
                return await getInstrumentsByCategory(
                  id,
                  orchestraId as string
                );
              } catch (error) {
                return error;
              }
            },
            swaggerGroup
          )
      )
  );

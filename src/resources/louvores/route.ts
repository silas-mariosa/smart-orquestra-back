import { Elysia, t } from "elysia";
import { JWT } from "../../jwt";
import {
  deleteLouvor,
  getAllLouvores,
  getLouvoresById,
  postLouvor,
  updateLouvor,
} from "./handle";

const swaggerGroup = {
  detail: {
    tags: ["Louvores"],
  },
};

export const louvores = new Elysia({ prefix: "/louvores" })
  .use(JWT)
  .guard((app) =>
    app
      .get(
        "/", // get all louvores
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
            return await getAllLouvores(orchestraId as string);
          } catch (error) {
            return error;
          }
        },
        swaggerGroup
      )
      .get(
        "/:id", // get louvore by id
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
            return await getLouvoresById(id, orchestraId as string);
          } catch (error) {
            return error;
          }
        },
        swaggerGroup
      )
      .guard(
        {
          body: t.Object({
            nameLouvor: t.String(),
            description: t.String(),
            pdf: t.String(),
            mp3: t.String(),
            instrumentos: t.String(),
          }),
        },
        (app) =>
          app
            .post(
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
                  return await postLouvor({
                    nameLouvor: body.nameLouvor,
                    description: body.description,
                    pdf: body.pdf,
                    mp3: body.mp3,
                    instrumentos: body.instrumentos,
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
              async ({ params: { id }, body, error, headers, jwt }) => {
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
                  return await updateLouvor({
                    id: id,
                    nameLouvor: body.nameLouvor,
                    description: body.description,
                    pdf: body.pdf,
                    mp3: body.mp3,
                    instrumentos: body.instrumentos,
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
            return await deleteLouvor(id, orchestraId as string);
          } catch (error) {
            return error;
          }
        },
        swaggerGroup
      )
  );

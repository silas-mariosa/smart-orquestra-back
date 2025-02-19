import { Elysia, t } from "elysia";
import { JWT } from "../../jwt";
import {
  deleteListInstrument,
  getAllInstrumentsList,
  getInstrumentListById,
  getInstrumentListByUserID,
  postListInstrument,
  updateListInstrument,
} from "./handle";

const swaggerGroup = {
  detail: {
    tags: ["Instruments by List"],
  },
};

export const instrumentosList = new Elysia({ prefix: "/instrumentos-lista" })
  .use(JWT)
  .guard((app) =>
    app
      .get(
        "/", // get all instrumentos
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
            return await getAllInstrumentsList(orchestraId as string);
          } catch (error) {
            return error;
          }
        },
        swaggerGroup
      )
      .get(
        "/:id", // get instrumento by id
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
            return await getInstrumentListById(id, orchestraId as string);
          } catch (error) {
            return error;
          }
        },
        swaggerGroup
      )
      .get(
        "/by-user", // get instrumento by id
        async ({ jwt, headers, error }) => {
          const authToken = headers.authorization?.split(" ")[1];
          try {
            const profile = await jwt.verify(authToken);
            if (!profile) {
              return error(400, "Invalid Token");
            }
            const userId = profile.userId;
            if (!userId) {
              return error(400, "Invalid userId");
            }
            return await getInstrumentListByUserID(userId as string);
          } catch (error) {
            return error;
          }
        },
        swaggerGroup
      )
      .guard(
        {
          body: t.Object({
            instrumentId: t.String(),
            owner: t.String(),
            position: t.String(),
            serie: t.String(),
            brand: t.String(),
            model: t.String(),
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
                    return error(400, "Invalid Token");
                  }
                  const orchestraId = profile.orchestraId;
                  if (!orchestraId) {
                    return error(400, "Invalid orchestraId");
                  }

                  const userID = profile.userId;
                  if (!orchestraId) {
                    return error(400, "Invalid userID");
                  }
                  return await postListInstrument({
                    orchestraId: orchestraId as string,
                    instrumentId: body.instrumentId,
                    user_id: userID as string,
                    owner: body.owner,
                    position: body.position,
                    serie: body.serie,
                    brand: body.brand,
                    model: body.model,
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

                  return await updateListInstrument({
                    id: id,
                    orchestraId: orchestraId as string,
                    instrumentId: body.instrumentId,
                    owner: body.owner,
                    position: body.position,
                    serie: body.serie,
                    brand: body.brand,
                    model: body.model,
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
            return await deleteListInstrument(id, orchestraId as string);
          } catch (error) {
            return error;
          }
        },
        swaggerGroup
      )
  );
